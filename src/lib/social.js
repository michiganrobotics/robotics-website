import axios from 'axios';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = '.netlify/cache/social-data';
const TWITTER_CACHE_FILE = path.join(CACHE_DIR, 'twitter.json');
const INSTAGRAM_CACHE_FILE = path.join(CACHE_DIR, 'instagram.json');
const YOUTUBE_CACHE_FILE = path.join(CACHE_DIR, 'youtube.json');

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// X API free tier no longer permits timeline reads, so we manually feature one
// tweet and hydrate its content via the public syndication endpoint. To swap
// in a new tweet, paste its numeric ID from the URL (twitter.com/.../status/<ID>).
const FEATURED_TWEET_ID = '2062502152233238750';

// Helper function to read cache
const readCache = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const cache = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return cache;
    }
  } catch (error) {
    console.error(`Error reading cache from ${filePath}:`, error);
  }
  return null;
};

// Helper function to write cache
const writeCache = (filePath, data, lastPostId) => {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({
      data,
      timestamp: Date.now(),
      lastPostId
    }));
  } catch (error) {
    console.error(`Error writing cache to ${filePath}:`, error);
  }
};

let twitterCache = {
  data: null,
  timestamp: null
};

// Token algorithm used by the public cdn.syndication.twimg.com/tweet-result endpoint.
// Lifted from the embed.js client; no auth required, but the endpoint can only
// hydrate a known tweet ID (it can't list a user's recent tweets).
function tweetSyndicationToken(id) {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(36)
    .replace(/(0+|\.)/g, '');
}

async function fetchTwitterPosts() {
  const cache = readCache(TWITTER_CACHE_FILE);
  const now = Date.now();

  // Return fresh cache without making any network call.
  if (cache?.data?.length && cache.timestamp && (now - cache.timestamp < CACHE_DURATION)) {
    return cache.data;
  }

  const tweetId = FEATURED_TWEET_ID;
  if (!tweetId) {
    return cache?.data || [];
  }

  try {
    const token = tweetSyndicationToken(tweetId);
    const response = await axios.get(
      `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&token=${token}&lang=en`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    const t = response.data;
    if (!t?.id_str) {
      console.error('Twitter syndication returned unexpected payload:', t);
      return cache?.data || [];
    }

    const tweets = [{
      id: t.id_str,
      content: t.text,
      date: t.created_at,
      platform: 'X',
      link: `https://twitter.com/${t.user?.screen_name || 'umrobotics'}/status/${t.id_str}`,
      loading: 'lazy'
    }];

    writeCache(TWITTER_CACHE_FILE, tweets, t.id_str);
    return tweets;
  } catch (error) {
    console.error('Error fetching Twitter post via syndication:', error.response?.data || error.message);
    return cache?.data || [];
  }
}
  
let instagramCache = {
  data: null,
  timestamp: null
};

let youtubeCache = {
  data: null,
  timestamp: null
};

async function fetchInstagramPosts() {
  const cache = readCache(INSTAGRAM_CACHE_FILE);
  const now = Date.now();

  try {
    const accessToken = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken || accessToken.trim() === '') {
      console.error('Instagram access token is not configured');
      return [];
    }

    const baseUrl = 'https://graph.instagram.com/v18.0';
    const userResponse = await axios.get(`${baseUrl}/me`, {
      params: {
        access_token: accessToken,
        fields: 'id,username'
      }
    });

    const userId = userResponse.data.id;
  
    const mediaResponse = await axios.get(`${baseUrl}/${userId}/media`, {
      params: {
        access_token: accessToken,
        fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink',
        limit: 1
      }
    });
  
    const posts = mediaResponse.data.data.map(post => ({
      id: post.id,
      content: post.caption,
      mediaUrl: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      thumbnailUrl: post.thumbnail_url,
      mediaType: post.media_type,
      date: post.timestamp,
      platform: 'Instagram',
      link: post.permalink,
      loading: 'lazy'
    }));

    const lastPostId = posts[0]?.id;
    writeCache(INSTAGRAM_CACHE_FILE, posts, lastPostId);
    return posts;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('Error fetching Instagram posts:', errorMessage);
    
    if (error.response?.data?.error?.code === 190) {
      console.error('Instagram token is invalid or has expired. Please update the INSTAGRAM_ACCESS_TOKEN environment variable with a valid token.');
    }
    
    return cache?.data || [];
  }
}
  
// Filter out YouTube Shorts. Requesting youtube.com/shorts/<id> returns 200 for
// an actual Short, but redirects (303) to /watch for a regular video. This is
// reliable where aspect ratio is not: a vertical video over the Shorts length
// limit is still a normal upload we want to feature.
async function filterShorts(items) {
  if (!items?.length) return [];

  const checks = await Promise.all(
    items.map(async (item) => {
      const videoId = item.id.videoId;
      if (!videoId) return { item, isShort: false };
      try {
        const res = await axios.get(`https://www.youtube.com/shorts/${videoId}`, {
          maxRedirects: 0,
          validateStatus: () => true,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        return { item, isShort: res.status === 200 };
      } catch (error) {
        // On any network error, keep the video rather than dropping it.
        return { item, isShort: false };
      }
    })
  );

  return checks.filter(c => !c.isShort).map(c => c.item);
}

async function fetchYoutubePosts() {
  const cache = readCache(YOUTUBE_CACHE_FILE);
  const now = Date.now();

  try {
    const apiKey = import.meta.env.YOUTUBE_API_KEY;
    const channelId = 'UC-WH2n-SkB166pUq5o5ULUg';
    const url = 'https://www.googleapis.com/youtube/v3/search';

    // If we have a cache, check for new videos
    if (cache?.lastPostId) {
      const response = await axios.get(url, {
        params: {
          key: apiKey,
          channelId: channelId,
          part: 'snippet',
          order: 'date',
          type: 'video',
          maxResults: 3,
          publishedAfter: new Date(cache.timestamp).toISOString()
        }
      });

      // If no new videos and cache is less than 7 days old, return cached data
      if (!response.data.items?.length && (now - cache.timestamp < CACHE_DURATION)) {
        return cache.data;
      }
    }

    // If we get here, either cache is old or we have new videos
    const response = await axios.get(url, {
      params: {
        key: apiKey,
        channelId: channelId,
        part: 'snippet',
        order: 'date',
        type: 'video',
        maxResults: 6
      }
    });

    const nonShortItems = await filterShorts(response.data.items);
    // Fall back to the most recent video if every result is a Short
    const selectedItems = nonShortItems.length > 0 ? nonShortItems : response.data.items;

    const posts = selectedItems.slice(0, 1).map(item => ({
      id: item.id.videoId,
      content: item.snippet.title
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'"),
      description: item.snippet.description
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'"),
      thumbnailUrl: item.snippet.thumbnails.high.url,
      date: item.snippet.publishedAt,
      platform: 'YouTube',
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      loading: 'lazy'
    }));

    // Save to cache with the newest video ID
    const lastPostId = posts[0]?.id;
    writeCache(YOUTUBE_CACHE_FILE, posts, lastPostId);
    return posts;

  } catch (error) {
    console.error('Error fetching YouTube posts:', error);
    return cache?.data || [];
  }
}

export { fetchInstagramPosts, fetchYoutubePosts, fetchTwitterPosts };