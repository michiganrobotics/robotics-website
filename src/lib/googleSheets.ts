import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

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
  photoURL: string;
}

interface DataSet {
  datasetName:string;
  datasetDescription: string;
  datasetOwner: string;
  datasetLink: string;
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

export async function getFacultyData(): Promise<FacultyMember[]> {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Faculty'];
  const rows = await sheet.getRows();
  
  return rows.map(row => ({
    slug: createSlug(row.get('lastName')),
    fullName: row.get('fullName'),
    preferredName: row.get('preferredName'),
    firstName: row.get('firstName'),
    lastName: row.get('lastName'),
    title: row.get('title'),
    affiliation: row.get('affiliation'),
    photoURL: row.get('photoURL'),
    email: row.get('email'),
    researchInterests: row.get('researchInterests'),
    googleScholar: row.get('googleScholar'),
    labWebsite: row.get('labWebsite'),
    website: row.get('website'),
  }));
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function getDatasets(): Promise<DataSet[]> {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle['Datasets'];
  const rows = await sheet.getRows();
  
  return rows.map(row => ({
    datasetName: row.get('datasetName'),
    datasetDescription: row.get('datasetDescription'),
    datasetOwner: row.get('datasetOwner'),
    datasetLink: row.get('datasetLink'),
  }));
}

export async function getCourseList(): Promise<CourseList[]> {
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
}
