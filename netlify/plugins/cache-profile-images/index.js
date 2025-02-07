module.exports = {
  onPreBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    if (await utils.cache.has(cacheDir)) {
      console.log('Found cached profile images');
      await utils.cache.restore(cacheDir);
      
      // Ensure the public directory exists
      try {
        await utils.run.command(`mkdir -p ${publicDir}`);
        
        // Try to copy files, but don't fail if no files exist
        try {
          console.log('Copying cached images to src directory');
          await utils.run.command(`cp ${cacheDir}/*.jpg ${publicDir}/`);
        } catch (error) {
          console.log('No cached images to copy or copy failed');
        }
      } catch (error) {
        console.error('Error creating directory:', error);
      }
    } else {
      console.log('No cached profile images found');
    }
  },
  
  onPostBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    try {
      // Ensure the cache directory exists
      await utils.run.command(`mkdir -p ${cacheDir}`);
      
      // Try to copy files, but don't fail if no files exist
      try {
        console.log('Copying new images to cache');
        await utils.run.command(`cp ${publicDir}/*.jpg ${cacheDir}/`);
      } catch (error) {
        console.log('No new images to cache or copy failed');
      }
      
      console.log('Caching profile images for future builds');
      await utils.cache.save(cacheDir);
    } catch (error) {
      console.error('Error in post-build cache operations:', error);
    }
  }
}; 