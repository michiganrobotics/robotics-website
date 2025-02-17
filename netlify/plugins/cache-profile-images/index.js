const path = require('path');

module.exports = {
  async onPreBuild({ utils }) {
    const cacheDir = '.netlify/cache/cached-profiles';
    
    try {
      // Restore cached images if they exist
      if (await utils.cache.has(cacheDir)) {
        console.log('Found cached profile images');
        await utils.cache.restore(cacheDir);
        console.log('Restored profile image cache');
      }
    } catch (error) {
      console.error('Error restoring profile image cache:', error);
    }
  },

  async onPostBuild({ utils }) {
    const cacheDir = '.netlify/cache/cached-profiles';
    
    try {
      // Save any new images to cache
      console.log('Saving profile images to cache');
      await utils.cache.save(cacheDir);
      console.log('Saved profile image cache');
    } catch (error) {
      console.error('Error saving profile image cache:', error);
    }
  }
};
