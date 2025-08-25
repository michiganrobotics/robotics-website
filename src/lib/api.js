function truncateDescription(description, maxLength = 200) {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + '...';
}

let eventsCache = null;
let eventsCacheTimestamp = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export async function eventsQuery() {
  // Return cached data if it exists and is still valid
  if (eventsCache && eventsCacheTimestamp && (Date.now() - eventsCacheTimestamp < CACHE_DURATION)) {
    return eventsCache;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch('https://events.umich.edu/group/3998/json?filter=show:new&v=2', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('Events API returned non-200 status:', response.status);
      return [];
    }

    const data = await response.json();
    const truncatedData = data.map(event => ({
      ...event,
      description: truncateDescription(event.description),
      styled_images: {
        ...event.styled_images,
        event_feature_large: event.styled_images?.event_feature_large || "/social/default-event.jpg"
      }
    }));

    // Update cache
    eventsCache = truncatedData;
    eventsCacheTimestamp = Date.now();

    return truncatedData;
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return empty array if fetch fails
    return [];
  }
}

import { XMLParser } from 'fast-xml-parser';

export async function collegeNewsQuery() {
  try {
    console.log('Fetching college news feed...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('Timeout reached, aborting request...');
      controller.abort();
    }, 5000); // 5 second timeout
    
    const response = await fetch('https://news.engin.umich.edu/category/research/robotics/feed', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 403) {
        console.warn('Feed access blocked (403). Using existing data if available.');
      } else {
        console.error('Feed response not OK:', response.status, response.statusText);
      }
      return [];
    }

    const xmlData = await response.text();
    console.log('Received XML data, length:', xmlData.length);
    
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ""
    });
    const parsedData = parser.parse(xmlData);
    console.log('Parsed RSS data:', parsedData?.rss?.channel?.title);

    if (!parsedData?.rss?.channel?.item) {
      console.error('No items found in feed');
      return [];
    }

    const newsItems = parsedData.rss.channel.item.slice(0, 4);
    console.log(`Processing ${newsItems.length} news items`);

    const truncatedData = newsItems.map(newsItem => {
      // Find all images in content
      const content = newsItem["content:encoded"] || '';
      const imgMatches = [...content.matchAll(/<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"[^>]*/g)];
      
      // Find first image that's not a profile photo
      const mainImage = imgMatches.find(match => {
        const alt = match[2].toLowerCase();
        return !alt.includes('portrait') && !alt.includes('headshot') && !alt.includes('profile');
      });
      
      const imageUrl = mainImage ? mainImage[1] : null;
      const imageAlt = mainImage ? mainImage[2] : '';

      // Clean up description by removing HTML and "The post appeared first on" text
      const cleanDescription = newsItem.description
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/The post .* appeared first on .*\./, '') // Remove footer text
        .trim();

      return {
        COLLEGE_TITLE: newsItem.title,
        COLLEGE_LINK: newsItem.link,
        COLLEGE_PUB_DATE: newsItem.pubDate,
        COLLEGE_DESCRIPTION: truncateDescription(cleanDescription || ''),
        COLLEGE_IMAGE: imageUrl,
        COLLEGE_IMAGE_ALT: imageAlt
      };
    });

    console.log(`Processed ${truncatedData.length} items`);
    return truncatedData;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Request timed out after 5 seconds');
    } else {
      console.error('Error in collegeNewsQuery:', error);
    }
    return [];
  }
}