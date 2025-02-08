import { collegeNewsQuery } from './api';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface CollegeNewsItem {
  COLLEGE_TITLE: string;
  COLLEGE_PUB_DATE: string;
  COLLEGE_DESCRIPTION: string;
  COLLEGE_LINK: string;
  COLLEGE_IMAGE?: string;
}

interface NewsData {
  title: string;
  date: string;
  description: string;
  link: string;
  image?: {
    src: string;
    alt: string;
  };
  categories: string[];
  tags: string[];
  featured: boolean;
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&#038;': '&',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };
  return text.replace(/&#038;|&amp;|&lt;|&gt;|&quot;|&#039;/g, match => entities[match]);
}

export async function fetchAndSaveCollegeNews() {
  try {
    // Fetch college news items
    const newsItems = await collegeNewsQuery();
    
    // Create content directory if it doesn't exist
    const contentDir = path.join(__dirname, '../../src/content/college-news');
    await fs.mkdir(contentDir, { recursive: true });

    // Process each news item
    for (const item of newsItems as CollegeNewsItem[]) {
      // Create a slug from the title
      const decodedTitle = decodeHtmlEntities(item.COLLEGE_TITLE);
      const slug = decodedTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Format the new data
      const newData = {
        title: decodedTitle,
        date: new Date(item.COLLEGE_PUB_DATE).toISOString(),
        description: item.COLLEGE_DESCRIPTION,
        link: item.COLLEGE_LINK,
        ...(item.COLLEGE_IMAGE && {
          image: {
            src: item.COLLEGE_IMAGE,
            alt: decodedTitle
          }
        })
      };

      // Check if file exists and read existing data
      const filePath = path.join(contentDir, `${slug}.json`);
      let existingData: Partial<NewsData> = {};
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        existingData = JSON.parse(fileContent) as NewsData;
      } catch (error) {
        // Silently continue if file doesn't exist
      }

      // Merge existing data with new data, preserving categories and tags
      const mergedData = {
        ...newData,
        categories: existingData?.categories || [],
        tags: existingData?.tags || [],
        featured: existingData?.featured ?? true
      };

      await fs.writeFile(filePath, JSON.stringify(mergedData, null, 2));
    }
  } catch (error) {
    console.error('Error fetching college news:', error);
    process.exit(1);
  }
}

// Run the script
fetchAndSaveCollegeNews(); 