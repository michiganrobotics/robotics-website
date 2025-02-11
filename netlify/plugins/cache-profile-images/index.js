module.exports = {
  onPreBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    // Create directories if they don't exist
    await utils.run.command(`mkdir -p ${cacheDir} ${publicDir}`);
    
    if (await utils.cache.has(cacheDir)) {
      console.log('Found cached profile images');
      await utils.cache.restore(cacheDir);
      
      try {
        console.log('Copying cached images to src directory');
        await utils.run.command(`cp ${cacheDir}/*.jpg ${publicDir}/ 2>/dev/null || true`);
      } catch (error) {
        console.log('No cached images to copy');
      }
    } else {
      console.log('No cached profile images found');
    }
  },
  
  onPostBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    try {
      await utils.run.command(`mkdir -p ${cacheDir}`);
      
      try {
        console.log('Copying new images to cache');
        await utils.run.command(`cp ${publicDir}/*.jpg ${cacheDir}/ 2>/dev/null || true`);
      } catch (error) {
        console.log('No new images to cache');
      }
      
      console.log('Caching profile images for future builds');
      await utils.cache.save(cacheDir);
    } catch (error) {
      console.error('Error in post-build cache operations:', error);
    }
  }
}; 