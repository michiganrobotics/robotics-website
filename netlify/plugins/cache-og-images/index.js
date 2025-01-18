module.exports = {
    onPreBuild: async ({ utils }) => {
      // Restore cached OG images if they exist
      await utils.cache.restore('.netlify/cache/og-images');
      console.log('Restored OG image cache');
    },
    onPostBuild: async ({ utils }) => {
      // Save newly generated OG images to cache
      await utils.cache.save('.netlify/cache/og-images');
      console.log('Saved OG images to cache');
    },
  };