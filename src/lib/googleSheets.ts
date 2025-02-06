import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import https from 'https';

dotenv.config();

// Define cached function locally
const cached = <T>(fn: () => Promise<T>) => {
  let cache: { data: T; timestamp: number } | null = null;
  const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  return async () => {
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return cache.data;
    }

    const data = await fn();
    cache = { data, timestamp: Date.now() };
    return data;
  };
};

const SCOPES: string[] = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1'),
  scopes: SCOPES,
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, jwt);

interface FacultyMember {
  slug: string;
  fullName: string;
  preferredName: string;
  firstName: string;
  lastName: string;
  title: string;
  affiliation: string;
  UMID: string;
  email: string;
  additionalTitle1: string;
  additionalTitle2: string;
  department1: string;
  department2: string;
  researchInterests: string;
  googleScholar: string;
  labWebsite: string;
  website: string;
  office: string;
}

interface ProjectDataset {
  projectName:string;
  projectDescription: string;
  projectOwner: string;
  projectLink: string;
}

interface CourseList {
  courseID: string;
  courseSubject: string;
  courseNumber: string;
  courseTitle: string;
  homeDepartment: string;
  undergradRequirement: string;
  gradRequirement: string;
  credits: string;
  semestersOffered: string;
  crossListing: string;
  courseNote: string;
  courseLink: string;
}

interface StaffMember {
  slug: string; 
  fullName: string;
  preferredName: string;
  firstName: string;
  lastName: string;
  title: string;
  affiliation: string;
  UMID: string;
  office: string;
  profileSummary: string;
  email: string;
  phone: string;
  studentServices: boolean;
}

interface Awards {
  awardRecipient: string;
  awardYear: string;
  award: string;
  awardOrganization: string;
}

interface AdvisoryBoard {
  firstName: string;
  lastName: string;
  fullName: string;
  title1: string;
  organization1: string;
  title2: string;
  organization2: string;
}

interface Alumni {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  website: string;
  title: string;
  graduationYear: string;
  degree: string;
}

interface AffiliateFaculty {
  fullName: string;
  preferredName: string;
  firstName: string;
  lastName: string;
  affiliation: string;
  email: string;
  department1: string;
  department2: string;
  researchInterests: string;
  googleScholar: string;
  website: string;
}

interface Student {
  preferredFullName: string;
  lastName: string;
  degree: 'PhD' | 'MS' | 'BS';
  researchGroup: string;
  advisors: string;
  researchInterests: string;
  email: string;
  website?: string;
  googleScholar?: string;
  github?: string;
  jobSeekingStatus?: 'not currently seeking' | 'seeking internship' | 'seeking employment';
  linkedin?: string;
  outreachAmbassador?: boolean;
  profileImage?: string;
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    // Replace parentheses with hyphens
    .replace(/\(/g, '-')
    .replace(/\)/g, '-')
    // Replace accented characters with non-accented equivalents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace non-alphanumeric chars with hyphens and clean up extra hyphens
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Change from function to export const
export const getProfileImagePath = (person: { UMID?: string, firstName?: string, lastName?: string }): string => {
  if (!person) {
    console.error('No person object provided to getProfileImagePath');
    return '/src/images/profile-images/robot-profile.jpg';
  }

  const baseImagePath = '/src/images/profile-images/';
  
  // Try UMID first if available
  if (person.UMID && typeof person.UMID === 'string' && person.UMID.trim()) {
    return `${baseImagePath}${person.UMID.trim()}.jpg`;
  }
  
  // Try firstname-lastname if available
  if (person.firstName && person.lastName && 
      typeof person.firstName === 'string' && typeof person.lastName === 'string' &&
      person.firstName.trim() && person.lastName.trim()) {
    const fileName = `${person.firstName.trim().toLowerCase()}-${person.lastName.trim().toLowerCase()}.jpg`;
    return `${baseImagePath}${fileName}`;
  }
  
  console.warn('Using fallback image for:', person);
  return `${baseImagePath}robot-profile.jpg`;
};

export const getFacultyData = cached(async () => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Faculty'];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    slug: createSlug(row.get('fullName')),
    fullName: row.get('fullName'),
    preferredName: row.get('preferredName'),
    firstName: row.get('firstName'),
    lastName: row.get('lastName'),
    title: row.get('title'),
    affiliation: row.get('affiliation'),
    UMID: row.get('UMID'),
    email: row.get('email'),
    additionalTitle1: row.get('additionalTitle1'),
    additionalTitle2: row.get('additionalTitle2'),
    department1: row.get('department1'),
    department2: row.get('department2'),
    researchInterests: row.get('researchInterests'),
    googleScholar: row.get('googleScholar'),
    labWebsite: row.get('labWebsite'),
    website: row.get('website'),
    office: row.get('office'),
  }));
});

export const getEmeritusFacultyData = cached(async () => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Emeritus'];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    slug: createSlug(row.get('fullName')),
    fullName: row.get('fullName'),
    preferredName: row.get('preferredName'),
    firstName: row.get('firstName'),
    lastName: row.get('lastName'),
    title: row.get('title'),
    affiliation: row.get('affiliation'),
    UMID: row.get('UMID'),
    email: row.get('email'),
    additionalTitle1: row.get('additionalTitle1'),
    additionalTitle2: row.get('additionalTitle2'),
    department1: row.get('department1'),
    department2: row.get('department2'),
    researchInterests: row.get('researchInterests'),
    googleScholar: row.get('googleScholar'),
    labWebsite: row.get('labWebsite'),
    website: row.get('website'),
    office: row.get('office'),
  }));
});

export const getProjectsDatasets = cached(async () => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['ProjectsDatasets'];
  const rows = await sheet.getRows();
  
  return rows.map(row => ({
    projectName: row.get('projectName'),
    projectDescription: row.get('projectDescription'),
    projectOwner: row.get('projectOwner'),
    projectLink: row.get('projectLink'),
  }));
});

export const getAwards = cached(async (): Promise<Awards[]> => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Awards'];
  const rows = await sheet.getRows();
  
  return rows.map(row => ({
    UMID: row.get('UMID'),
    // Keep recipients as a single string, but clean up any extra whitespace
    awardRecipient: row.get('awardRecipient').split('\n')
      .map(r => r.trim())
      .filter(r => r) // Remove empty lines
      .join('\n'),
    awardYear: row.get('awardYear'),
    award: row.get('award'),
    awardOrganization: row.get('awardOrganization'),
  }));
});

export const getCourseList = cached(async (): Promise<CourseList[]> => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Courses'];
  const rows = await sheet.getRows();
  
  return rows.map(row => ({
    courseID: row.get('courseID'),
    courseSubject: row.get('courseSubject'),
    courseNumber: row.get('courseNumber'),
    courseTitle: row.get('courseTitle'),
    homeDepartment: row.get('homeDepartment'),
    undergradRequirement: row.get('undergradRequirement'),
    gradRequirement: row.get('gradRequirement'),
    credits: row.get('credits'),
    semestersOffered: row.get('semestersOffered'),
    crossListing: row.get('crossListing'),
    courseNote: row.get('courseNote'),
    courseLink: row.get('courseLink'),
  }));
});

export const getStaffData = cached(async (): Promise<StaffMember[]> => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Staff'];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    slug: createSlug(row.get('fullName')),
    fullName: row.get('fullName'),
    preferredName: row.get('preferredName'),
    firstName: row.get('firstName'),
    lastName: row.get('lastName'),
    title: row.get('title'),
    affiliation: row.get('affiliation'),
    UMID: row.get('UMID'),
    office: row.get('office'),
    profileSummary: row.get('profileSummary')?.replace(/(<([^>]+)>)/gi, ''),
    email: row.get('email'),
    phone: row.get('phone'),
    studentServices: row.get('studentServices') === 'TRUE',
  }));
});

export const getAdvisoryBoard = cached(async (): Promise<AdvisoryBoard[]> => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['AdvisoryBoard'];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    firstName: row.get('firstName'),
    lastName: row.get('lastName'),
    fullName: row.get('fullName'),
    title1: row.get('title1'),
    organization1: row.get('organization1'),
    title2: row.get('title2'),
    organization2: row.get('organization2'),
  }));
});

export const getAlumni = cached(async (): Promise<Alumni[]> => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Alumni'];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    firstName: row.get('firstName'),
    lastName: row.get('lastName'),
    fullName: row.get('fullName'),
    email: row.get('email'),
    website: row.get('website'),
    title: row.get('title'),
    graduationYear: row.get('graduationYear'),
    degree: row.get('degree'),
  }));
});

export const getAffiliateFacultyData = cached(async (): Promise<AffiliateFaculty[]> => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Affiliate'];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    fullName: row.get('fullName'),
    preferredName: row.get('preferredName'),
    firstName: row.get('firstName'),
    lastName: row.get('lastName'),
    affiliation: row.get('affiliation'),
    email: row.get('email'),
    department1: row.get('department1'),
    department2: row.get('department2'),
    researchInterests: row.get('researchInterests'),
    googleScholar: row.get('googleScholar'),
    website: row.get('website'),
  }));
});

// Add this function to download and cache images
async function cacheGoogleDriveImage(url: string, fileName: string): Promise<string | null> {
  if (!url) return null;

  // Use .netlify/cache directory which Netlify persists between builds
  const cacheDir = path.join(process.cwd(), '.netlify/cache/cached-profiles');
  const publicDir = path.join(process.cwd(), 'src/images/cached-profiles');
  const cachePath = path.join(cacheDir, `${fileName}.jpg`);
  const publicPath = path.join(publicDir, `${fileName}.jpg`);
  
  try {
    // Create both directories if they don't exist
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.mkdir(publicDir, { recursive: true });

    // Check if image exists in cache
    try {
      await fs.access(cachePath);
      console.log(`Found cached image for ${fileName}`);
      // Copy from cache to public directory
      await fs.copyFile(cachePath, publicPath);
      return `/src/images/cached-profiles/${fileName}.jpg`;
    } catch {
      // Image not in cache, download it
      console.log(`Downloading and caching image for ${fileName} from ${url}`);
      
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
                const cacheStream = fsSync.createWriteStream(cachePath);
                redirectResponse.pipe(cacheStream);
                cacheStream.on('finish', async () => {
                  cacheStream.close();
                  // Copy to public directory after successful download
                  await fs.copyFile(cachePath, publicPath);
                  resolve(true);
                });
              }).on('error', reject);
              return;
            }
          }

          const cacheStream = fsSync.createWriteStream(cachePath);
          response.pipe(cacheStream);
          cacheStream.on('finish', async () => {
            cacheStream.close();
            // Copy to public directory after successful download
            await fs.copyFile(cachePath, publicPath);
            resolve(true);
          });
        }).on('error', reject);

        request.end();
      });

      return `/src/images/cached-profiles/${fileName}.jpg`;
    }
  } catch (error) {
    console.error(`Failed to process image for ${fileName}:`, error);
    return null;
  }
}

// Modify the getGoogleDriveDirectImageUrl function
async function getGoogleDriveDirectImageUrl(url: string, studentName: string): Promise<string | null> {
  if (!url) return null;
  
  // Match both /view?usp=sharing and /view?usp=share_link formats
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

export const getStudentData = cached(async (): Promise<Student[]> => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Students'];
  const rows = await sheet.getRows();
  
  // Process all images in parallel
  const students = await Promise.all(rows.map(async row => {
    const profileImage = await getGoogleDriveDirectImageUrl(
      row.get('profileImage'),
      row.get('preferredFullName')
    );

    // Ensure we have at least a name to work with
    const preferredFullName = row.get('preferredFullName') || row.get('lastName') || 'Unknown Student';
    const lastName = row.get('lastName') || preferredFullName.split(' ').pop() || preferredFullName;

    return {
      preferredFullName,
      lastName,
      degree: row.get('degree') as 'PhD' | 'MS' | 'BS',
      researchGroup: row.get('researchGroup') || '',
      advisors: row.get('advisors') || '',
      researchInterests: row.get('researchInterests') || '',
      email: row.get('email') || '',
      website: row.get('website'),
      googleScholar: row.get('googleScholar'),
      github: row.get('github'),
      jobSeekingStatus: row.get('jobSeekingStatus'),
      linkedin: row.get('linkedin'),
      outreachAmbassador: row.get('outreachAmbassador') === 'TRUE',
      profileImage,
    };
  }));

  // Filter out any invalid entries
  return students.filter(student => 
    student.preferredFullName && 
    student.lastName && 
    student.degree
  );
});
