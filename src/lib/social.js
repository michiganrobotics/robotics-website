import axios from 'axios';
import fs from 'fs';
import path from 'path';

const CACHE_DIR = '.netlify/cache/social-data';
const TWITTER_CACHE_FILE = path.join(CACHE_DIR, 'twitter.json');
const INSTAGRAM_CACHE_FILE = path.join(CACHE_DIR, 'instagram.json');
const YOUTUBE_CACHE_FILE = path.join(CACHE_DIR, 'youtube.json');

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

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

async function fetchTwitterPosts() {
  const cache = readCache(TWITTER_CACHE_FILE);
  const now = Date.now();

  try {
    const bearerToken = import.meta.env.TWITTER_BEARER_TOKEN;
    const userId = '894988418295443456';
    const url = `https://api.twitter.com/2/users/${userId}/tweets`;
    
    // If we have a cache, first check if there are new tweets
    if (cache?.lastPostId) {
      const response = await axios.get(url, {
        headers: { 
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          'since_id': cache.lastPostId,  // Only get tweets newer than our last cached tweet
          'tweet.fields': 'created_at,text',
          'max_results': 5,
          'exclude': 'retweets,replies'
        }
      });

      // If no new tweets and cache is less than 7 days old, return cached data
      if (!response.data.data?.length && (now - cache.timestamp < CACHE_DURATION)) {
        return cache.data;
      }
    }

    // If we get here, either cache is old or we have new tweets
    const response = await axios.get(url, {
      headers: { 
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      },
      params: {
        'tweet.fields': 'created_at,text',
        'max_results': 5,  // Get more tweets so we can filter
        'exclude': 'retweets,replies'  // Updated exclusion parameters
      }
    });

    if (!response.data.data) {
      console.error('No tweets found in response:', response.data);
      return [];
    }

    const tweets = response.data.data
      .filter(tweet => !tweet.in_reply_to_user_id)
      .slice(0, 1)  // Take only the first tweet after filtering
      .map(tweet => ({
        id: tweet.id,
        content: tweet.text,
        date: tweet.created_at,
        platform: 'X',
        link: `https://twitter.com/umrobotics/status/${tweet.id}`,
        loading: 'lazy'
      }));

    // Save to cache with the newest tweet ID
    const lastPostId = tweets[0]?.id;
    writeCache(TWITTER_CACHE_FILE, tweets, lastPostId);
    return tweets;
  } catch (error) {
    if (error.response?.status === 429) {
      console.error('Twitter rate limit exceeded. Using cached data if available.');
      return cache?.data || [];
    }
    console.error('Error fetching Twitter posts:', error.response?.data || error);
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

    // If we have a cache with a last post ID, check for new posts
    if (cache?.lastPostId) {
      const mediaResponse = await axios.get(`https://graph.instagram.com/v18.0/${cache.lastPostId}`, {
        params: {
          access_token: accessToken,
          fields: 'id'
        }
      });

      // If the last post still exists and cache is < 7 days old, use cache
      if (mediaResponse.data.id && (now - cache.timestamp < CACHE_DURATION)) {
        return cache.data;
      }
    }

    // Simplified token validation
    const baseUrl = 'https://graph.instagram.com/v18.0';
    const userResponse = await axios.get(`${baseUrl}/me`, {
      params: {
        access_token: accessToken,
        fields: 'id,username'
      }
    });

    // If we get here, token is valid
    const userId = userResponse.data.id;
  
    // Then, fetch the media
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
      mediaUrl: post.media_url,
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
          maxResults: 1,
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
        maxResults: 1
      }
    });

    const posts = response.data.items.map(item => ({
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