const path = require('path');

module.exports = {
  async onPreBuild({ utils }) {
    const cacheDir = '.netlify/cache/social-data';
    
    try {
      if (await utils.cache.has(cacheDir)) {
        console.log('Found cached social media data');
        await utils.cache.restore(cacheDir);
        console.log('Restored social media cache');
      }
    } catch (error) {
      console.error('Error restoring social media cache:', error);
    }
  },

  async onPostBuild({ utils }) {
    const cacheDir = '.netlify/cache/social-data';
    
    try {
      console.log('Saving social media data to cache');
      await utils.cache.save(cacheDir);
      console.log('Saved social media cache');
    } catch (error) {
      console.error('Error saving social media cache:', error);
    }
  }
}; 