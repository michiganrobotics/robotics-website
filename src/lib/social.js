import axios from 'axios';

  // async function fetchTwitterPosts() {
  //   const bearerToken = import.meta.env.TWITTER_BEARER_TOKEN;
  //   const userId = '894988418295443456';
  //   const url = `https://api.twitter.com/2/users/${userId}/tweets`;
    
  //   try {
  //     const response = await axios.get(url, {
  //       headers: { 'Authorization': `Bearer ${bearerToken}` },
  //       params: {
  //         'tweet.fields': 'created_at,text,in_reply_to_user_id',
  //         'max_results': 1,
  //         'exclude': 'replies'
  //       }
  //     });
  //     return response.data.data
  //       .filter(tweet => !tweet.in_reply_to_user_id)
  //       .map(tweet => ({
  //         id: tweet.id,
  //         content: tweet.text,
  //         date: tweet.created_at,
  //         platform: 'Twitter',
  //         link: `https://twitter.com/umrobotics/status/${tweet.id}`
  //       }));
  //   } catch (error) {
  //     // console.error('Error fetching Twitter posts:', error);
  //     // return [];
  //   }
  // }
  
  async function fetchInstagramPosts() {
    const accessToken = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
    const userId = '17841408845500744';
    const url = `https://graph.instagram.com/v12.0/${userId}/media`;
    
    try {
      const response = await axios.get(url, {
        params: {
          access_token: accessToken,
          fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink',
          limit: 1
        }
      });
      return response.data.data.map(post => ({
        id: post.id,
        content: post.caption,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url,
        mediaType: post.media_type,
        date: post.timestamp,
        platform: 'Instagram',
        link: post.permalink
      }));
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      return [];
    }
  }
  
  async function fetchYoutubePosts() {
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
      return response.data.items.map(item => ({
        id: item.id.videoId,
        content: item.snippet.title,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        date: item.snippet.publishedAt,
        platform: 'YouTube',
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
    } catch (error) {
      // console.error('Error fetching YouTube posts:', error);
      // return [];
    }
  }
  
//   async function fetchLinkedinPosts() {
//     const accessToken = 'YOUR_LINKEDIN_ACCESS_TOKEN';
//     const url = 'https://api.linkedin.com/v2/ugcPosts';
    
//     try {
//       const response = await axios.get(url, {
//         headers: { 'Authorization': `Bearer ${accessToken}` },
//         params: {
//           q: 'authors',
//           authors: 'urn:li:person:YOUR_LINKEDIN_ID',
//           count: 10
//         }
//       });
//       return response.data.elements.map(post => ({
//         id: post.id,
//         content: post.specificContent['com.linkedin.ugc.ShareContent'].shareCommentary.text,
//         date: post.created.time,
//         platform: 'LinkedIn'
//       }));
//     } catch (error) {
//       console.error('Error fetching LinkedIn posts:', error);
//       return [];
//     }
//   }
  
export { fetchInstagramPosts, fetchYoutubePosts };
