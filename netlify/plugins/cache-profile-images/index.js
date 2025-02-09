const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const https = require('https');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
require('dotenv').config();

// Google Sheets setup
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1'),
  scopes: SCOPES,
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, jwt);

// Image handling functions
async function cacheGoogleDriveImage(url, fileName) {
  if (!url) return null;

  const cacheDir = path.join(process.cwd(), '.netlify/cache/cached-profiles');
  const publicDir = path.join(process.cwd(), 'src/images/cached-profiles');
  const cachePath = path.join(cacheDir, `${fileName}.jpg`);
  const publicPath = path.join(publicDir, `${fileName}.jpg`);

  try {
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.mkdir(publicDir, { recursive: true });

    await new Promise((resolve, reject) => {
      const request = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        followAllRedirects: true,
      }, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            https.get(redirectUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0',
              },
            }, (redirectResponse) => {
              const writeStream = fsSync.createWriteStream(publicPath);
              redirectResponse.pipe(writeStream);
              writeStream.on('finish', () => {
                writeStream.close();
                resolve(true);
              });
            }).on('error', reject);
            return;
          }
        }

        const writeStream = fsSync.createWriteStream(publicPath);
        response.pipe(writeStream);
        writeStream.on('finish', () => {
          writeStream.close();
          resolve(true);
        });
      }).on('error', reject);

      request.end();
    });

    await fs.copyFile(publicPath, cachePath);
    return `/src/images/cached-profiles/${fileName}.jpg`;
  } catch (error) {
    console.error('Error caching image:', error);
    return null;
  }
}

async function getGoogleDriveDirectImageUrl(url, studentName) {
  if (!url) return null;
  
  if (url.includes('drive.google.com/file/d/')) {
    const fileId = url.match(/\/d\/([^/]+)/)?.[1];
    
    if (fileId) {
      const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
      const safeFileName = studentName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return await cacheGoogleDriveImage(thumbnailUrl, safeFileName);
    }
  }
  
  return url;
}

async function getStudentData() {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Students'];
  const rows = await sheet.getRows();
  
  const students = await Promise.all(rows.map(async row => {
    const profileImage = await getGoogleDriveDirectImageUrl(
      row.get('profileImage'),
      row.get('preferredFullName')
    );

    const preferredFullName = row.get('preferredFullName') || row.get('lastName') || 'Unknown Student';
    const lastName = row.get('lastName') || preferredFullName.split(' ').pop() || preferredFullName;

    return {
      preferredFullName,
      lastName,
      profileImage,
    };
  }));

  return students.filter(student => 
    student.preferredFullName && 
    student.lastName
  );
}

// Netlify plugin
module.exports = {
  onPreBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    // Create directories if they don't exist
    await utils.run.command(`mkdir -p ${cacheDir} ${publicDir}`);
    
    // Restore cached images first
    if (await utils.cache.has(cacheDir)) {
      console.log('Found cached profile images');
      await utils.cache.restore(cacheDir);
      
      try {
        console.log('Copying cached images to src directory');
        await utils.run.command(`cp ${cacheDir}/*.jpg ${publicDir}/ || true`);
      } catch (error) {
        console.log('No cached images to copy');
      }
    } else {
      console.log('No cached profile images found');
    }

    // Prefetch new/updated images
    try {
      console.log('Pre-fetching student profile images...');
      await getStudentData();
      console.log('Successfully pre-fetched student profile images');
    } catch (error) {
      console.error('Error pre-fetching images:', error);
      utils.build.failBuild('Failed to prefetch profile images');
    }
  },
  
  onPostBuild: async ({ utils }) => {
    const cacheDir = '.netlify/cache/cached-profiles';
    const publicDir = 'src/images/cached-profiles';
    
    try {
      await utils.run.command(`mkdir -p ${cacheDir}`);
      
      try {
        console.log('Copying new images to cache');
        await utils.run.command(`cp ${publicDir}/*.jpg ${cacheDir}/ || true`);
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