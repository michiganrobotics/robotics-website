import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface CollegeNewsItem {
  title: string;
  date: string;
  description: string;
  link: string;
  image?: {
    src: string;
    alt: string;
  };
  categories?: string[];
  tags?: string[];
}

export async function GET() {
  // Get news from MDX files
  const newsItems = await getCollection('news');
  
  // Get college news from JSON files
  const collegeNewsPath = join(process.cwd(), 'src/content/college-news');
  const collegeNewsFiles = await readdir(collegeNewsPath);
  const jsonFiles = collegeNewsFiles.filter(file => file.endsWith('.json'));
  
  const collegeNewsItems: CollegeNewsItem[] = [];
  for (const file of jsonFiles) {
    try {
      const content = await readFile(join(collegeNewsPath, file), 'utf-8');
      const item: CollegeNewsItem = JSON.parse(content);
      collegeNewsItems.push(item);
    } catch (error) {
      console.error(`Error reading college news file ${file}:`, error);
    }
  }

  // Combine and transform all items
  const allItems = [
    // Transform news items (MDX)
    ...newsItems.map(item => {
      let imageUrl: string | null = null;
      
      if (item.data.image?.src) {
        const imageSrc = item.data.image.src;
        
        // Handle different image source types
        if (typeof imageSrc === 'string') {
          imageUrl = imageSrc.startsWith('http') 
            ? imageSrc 
            : `https://robotics.umich.edu/news/${item.data.date.split('-')[0]}/${imageSrc}`;
        } else if (imageSrc && typeof imageSrc === 'object') {
          // Handle Astro Image objects - they may have various structures
          const srcValue = (imageSrc as any)?.src || String(imageSrc);
          if (typeof srcValue === 'string') {
            imageUrl = srcValue.startsWith('http') 
              ? srcValue 
              : `https://robotics.umich.edu${srcValue.replace(/\?.*$/, '')}`; // Remove query params for RSS
          }
        }
      }
      
      // Extract slug from item.id (remove directory structure)
      const slug = item.id.split('/').pop()?.replace(/\.mdx$/, '') || item.id;
      
      return {
        title: item.data.title,
        pubDate: new Date(item.data.date),
        description: item.data.excerpt || item.data.seoDescription || '',
        link: `https://robotics.umich.edu/news/${item.data.date.split('-')[0]}/${slug}/`,
        categories: item.data.categories || [],
        customData: `
          ${imageUrl ? `<enclosure url="${imageUrl}" type="image/jpeg" />` : ''}
          ${item.data.author ? `<dc:creator><![CDATA[${item.data.author}]]></dc:creator>` : ''}
        `.trim(),
      };
    }),
    // Transform college news items (JSON)
    ...collegeNewsItems.map(item => ({
      title: item.title,
      pubDate: new Date(item.date),
      description: item.description,
      link: item.link,
      categories: item.categories || [],
      customData: `
        ${item.image ? `<enclosure url="${item.image.src}" type="image/jpeg" />` : ''}
        <dc:creator><![CDATA[Michigan Engineering]]></dc:creator>
      `.trim(),
    }))
  ];

  // Sort by date (newest first)
  allItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: 'Michigan Robotics News',
    description: 'Latest news and updates from the University of Michigan Robotics Department',
    site: 'https://robotics.umich.edu',
    items: allItems,
    customData: `
      <language>en-us</language>
      <managingEditor>robotics-web@umich.edu (Michigan Robotics)</managingEditor>
      <webMaster>robotics-web@umich.edu (Michigan Robotics)</webMaster>
      <copyright>Copyright ${new Date().getFullYear()} University of Michigan</copyright>
      <category>Science</category>
      <category>Technology</category>
      <category>Education</category>
      <ttl>60</ttl>
      <image>
        <url>https://robotics.umich.edu/images/favicons/favicon-96x96.png</url>
        <title>Michigan Robotics News</title>
        <link>https://robotics.umich.edu</link>
        <width>96</width>
        <height>96</height>
      </image>
    `,
    xmlns: {
      dc: 'http://purl.org/dc/elements/1.1/',
    },
  });
}