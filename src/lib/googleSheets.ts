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