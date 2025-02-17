const { getStudentData } = require('./src/lib/googleSheets'); // Import your data-fetching logic
const fs = require('fs/promises');
const path = require('path');

module.exports = {
  onPreBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';

    // Create directories if they don't exist
    await utils.run.command(`mkdir -p ${cacheDir} ${publicDir}`);

    // Restore cached images if available
    if (await utils.cache.has(cacheDir)) {
      console.log('Found cached profile images');
      await utils.cache.restore(cacheDir);

      try {
        console.log('Copying cached images to src directory');
        await utils.run.command(`cp "${cacheDir}"/*.jpg "${publicDir}/"`);
      } catch (error) {
        console.log('No cached images to copy');
      }
    } else {
      console.log('No cached profile images found');
    }

    // Fetch student data and download new profile images
    const students = await getStudentData();
    for (const student of students) {
      if (student.profileImage) {
        const fileName = path.basename(student.profileImage);
        const publicPath = path.join(publicDir, fileName);
        const cachePath = path.join(cacheDir, fileName);

        try {
          // Check if the image already exists in public directory
          await fs.access(publicPath);
          console.log(`Image already exists: ${publicPath}`);
        } catch {
          // If not, download it
          console.log(`Downloading image: ${student.profileImage}`);
          await utils.run.command(`curl -o "${publicPath}" "${student.profileImage}"`);
          await fs.copyFile(publicPath, cachePath); // Copy to cache for future builds
        }
      }
    }
  },

  onPostBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';

    try {
      await utils.run.command(`mkdir -p "${cacheDir}"`);

      try {
        console.log('Copying new images to cache');
        await utils.run.command(`cp "${publicDir}"/*.jpg "${cacheDir}/"`);
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
