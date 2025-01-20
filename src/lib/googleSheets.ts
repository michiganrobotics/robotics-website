import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

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
  const baseImagePath = '/src/images/profile-images/';
  
  // Try UMID first if available
  if (person.UMID) {
    return `${baseImagePath}${person.UMID}.jpg`;
  }
  
  // Try firstname-lastname if available
  if (person.firstName && person.lastName) {
    return `${baseImagePath}${person.firstName.toLowerCase()}-${person.lastName.toLowerCase()}.jpg`;
  }
  
  // Randomly choose between the two fallback images
  return `${baseImagePath}${Math.random() < 0.5 ? 'robot-profile.jpg' : 'robot-profile2.jpg'}`;
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
    awardRecipient: row.get('awardRecipient'),
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

export const getStudentData = cached(async (): Promise<Student[]> => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Students'];
  const rows = await sheet.getRows();
  return rows.map(row => ({
    preferredFullName: row.get('preferredFullName'),
    lastName: row.get('lastName'),
    degree: row.get('degree'),
    researchGroup: row.get('researchGroup'),
    advisors: row.get('advisors'),
    researchInterests: row.get('researchInterests'),
    email: row.get('email'),
    website: row.get('website'),
    googleScholar: row.get('googleScholar'),
    github: row.get('github'),
    jobSeekingStatus: row.get('jobSeekingStatus'),
    linkedin: row.get('linkedin'),
    outreachAmbassador: row.get('outreachAmbassador') === 'TRUE',
  }));
});
