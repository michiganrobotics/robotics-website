module.exports = {
  onPreBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    console.log('Starting profile image cache process...');
    
    // Create directories if they don't exist
    await utils.run.command(`mkdir -p ${cacheDir} ${publicDir}`);
    
    // Restore cached images first
    if (await utils.cache.has(cacheDir)) {
      console.log('Found cached profile images directory');
      await utils.cache.restore(cacheDir);
      
      try {
        // Check if cache directory has any jpg files
        const hasJpgFiles = await utils.run.command(`find ${cacheDir} -name "*.jpg" -type f | grep . > /dev/null && echo "true" || echo "false"`, { 
          stdio: ['pipe', 'pipe', 'pipe']
        });
        
        if (hasJpgFiles.stdout.trim() === 'true') {
          console.log('Copying existing cached images to src directory');
          await utils.run.command(`cp ${cacheDir}/*.jpg ${publicDir}/`);
          console.log('Successfully copied cached images');
        } else {
          console.log('No jpg files found in cache directory');
        }
      } catch (error) {
        console.log('No existing images to copy from cache');
      }
    } else {
      console.log('No profile image cache found - will create new cache');
    }

    // Prefetch new/updated images
    try {
      console.log('Pre-fetching student profile images from Google Sheet...');
      const students = await getStudentData();
      console.log(`Found ${students.length} student records to process`);
      
      const imagesProcessed = students.filter(student => student.profileImage).length;
      console.log(`Successfully processed ${imagesProcessed} profile images`);
    } catch (error) {
      console.error('Error pre-fetching images:', error);
      utils.build.failBuild('Failed to prefetch profile images: ' + error.message);
    }
  },
  
  onPostBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    try {
      await utils.run.command(`mkdir -p ${cacheDir}`);
      
      try {
        // Check if public directory has any jpg files
        const hasJpgFiles = await utils.run.command(`find ${publicDir} -name "*.jpg" -type f | grep . > /dev/null && echo "true" || echo "false"`, { 
          stdio: ['pipe', 'pipe', 'pipe']
        });
        
        if (hasJpgFiles.stdout.trim() === 'true') {
          console.log('Copying new images to cache');
          await utils.run.command(`cp ${publicDir}/*.jpg ${cacheDir}/`);
          console.log('Successfully updated image cache');
        } else {
          console.log('No new images to cache');
        }
      } catch (error) {
        console.log('No new images to add to cache');
      }
      
      console.log('Saving profile images cache for future builds');
      await utils.cache.save(cacheDir);
      console.log('Cache save completed');
    } catch (error) {
      console.error('Error in post-build cache operations:', error);
    }
  }
}; 