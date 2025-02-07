module.exports = {
  onPreBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    if (await utils.cache.has(cacheDir)) {
      console.log('Found cached profile images');
      await utils.cache.restore(cacheDir);
      
      // Ensure the public directory exists
      await utils.run.command(`mkdir -p ${publicDir}`);
      
      // Copy all cached images to the public directory
      console.log('Copying cached images to src directory');
      await utils.run.command(`cp ${cacheDir}/*.jpg ${publicDir}/ || true`);
    } else {
      console.log('No cached profile images found');
    }
  },
  
  onPostBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    // Ensure the cache directory exists
    await utils.run.command(`mkdir -p ${cacheDir}`);
    
    // Copy any new images from public to cache
    console.log('Copying new images to cache');
    await utils.run.command(`cp ${publicDir}/*.jpg ${cacheDir}/ || true`);
    
    console.log('Caching profile images for future builds');
    await utils.cache.save(cacheDir);
  }
}; 