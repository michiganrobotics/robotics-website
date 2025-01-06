import axios from 'axios';
  let twitterCache = {
    data: null,
    timestamp: null
  };

  async function fetchTwitterPosts() {
    // Check if cache exists and is less than 24 hours old
    const now = Date.now();
    if (twitterCache.data && twitterCache.timestamp && (now - twitterCache.timestamp < 24 * 60 * 60 * 1000)) {
      return twitterCache.data;
    }

    const bearerToken = import.meta.env.TWITTER_BEARER_TOKEN;
    const userId = '894988418295443456';
    const url = `https://api.twitter.com/2/users/${userId}/tweets`;
    
    try {
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
          link: `https://twitter.com/umrobotics/status/${tweet.id}`
        }));

      // Update cache
      twitterCache = {
        data: tweets,
        timestamp: now
      };

      return tweets;
    } catch (error) {
      console.error('Error fetching Twitter posts:', error.response?.data || error);
      return [];
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
    // Check if cache exists and is less than 24 hours old
    const now = Date.now();
    if (instagramCache.data && instagramCache.timestamp && (now - instagramCache.timestamp < 24 * 60 * 60 * 1000)) {
      return instagramCache.data;
    }

    const accessToken = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
    const baseUrl = 'https://graph.instagram.com/v18.0'; // Updated to latest version
  
    try {
      // First, get the user ID
      const userResponse = await axios.get(`${baseUrl}/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,username'
        }
      });
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
        link: post.permalink
      }));

      // Update cache
      instagramCache = {
        data: posts,
        timestamp: now
      };

      return posts;
    } catch (error) {
      console.error('Error fetching Instagram posts:', error.response?.data || error.message);
      return [];
    }
  }
  
  async function fetchYoutubePosts() {
    // Check if cache exists and is less than 24 hours old
    const now = Date.now();
    if (youtubeCache.data && youtubeCache.timestamp && (now - youtubeCache.timestamp < 24 * 60 * 60 * 1000)) {
      return youtubeCache.data;
    }

    const apiKey = import.meta.env.YOUTUBE_API_KEY;
    const channelId = 'UC-WH2n-SkB166pUq5o5ULUg';
    const url = 'https://www.googleapis.com/youtube/v3/search';
    
    try {
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
        content: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        date: item.snippet.publishedAt,
        platform: 'YouTube',
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));

      // Update cache
      youtubeCache = {
        data: posts,
        timestamp: now
      };

      return posts;
    } catch (error) {
      console.error('Error fetching YouTube posts:', error);
      return [];
    }
  }

  
export { fetchInstagramPosts, fetchYoutubePosts, fetchTwitterPosts };