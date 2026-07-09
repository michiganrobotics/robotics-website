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
      return await devFallbackEvents();
    }

    let data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      data = await devFallbackEvents();
      if (data.length === 0) return [];
    }
    const truncatedData = await Promise.all(data.map(async (event) => {
      let imageUrl = event.styled_images?.event_feature_large || "/social/default-event.jpg";

      // Resolve redirects for remote images (Astro won't follow them)
      if (imageUrl.startsWith("http")) {
        try {
          const head = await fetch(imageUrl, { method: "HEAD", redirect: "follow" });
          imageUrl = head.url;
        } catch {
          imageUrl = "/social/default-event.jpg";
        }
      }

      return {
        ...event,
        description: truncateDescription(event.description),
        styled_images: {
          ...event.styled_images,
          event_feature_large: imageUrl
        }
      };
    }));

    // Update cache
    eventsCache = truncatedData;
    eventsCacheTimestamp = Date.now();

    return truncatedData;
  } catch (error) {
    console.error('Error fetching events:', error);
    return await devFallbackEvents();
  }
}

async function devFallbackEvents() {
  if (!import.meta.env.DEV) return [];
  try {
    // Read at runtime via fs rather than an ESM import so the bundler never
    // tries to resolve this gitignored, dev-only fixture during production builds.
    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const fixturePath = fileURLToPath(new URL('./fixtures/dev-events.json', import.meta.url));
    const fixture = JSON.parse(await readFile(fixturePath, 'utf8'));
    console.log('[dev] Using fixture past events because live feed is empty');
    return fixture;
  } catch {
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

// The browse page is the source of truth for current openings. The RSS
// advanced-search feed only lists *recently posted* jobs — items age out of it
// within about a day even while the posting stays open — so it can only serve
// as a fallback if the browse page markup changes.
const CAREERS_BROWSE_URL = 'https://careers.umich.edu/browse-jobs/departments/210308';

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

async function fetchCareersBrowsePage() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(CAREERS_BROWSE_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.warn(`Careers browse page returned non-200 status ${response.status}`);
      return null;
    }

    const html = await response.text();
    // The listing is a Drupal view table; every posting row links to /job_detail/.
    const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
      .map(m => m[1])
      .filter(row => row.includes('/job_detail/'));

    if (rows.length === 0) {
      // Distinguish "no openings" (view markup still present) from a layout
      // change that broke our parsing, which should fall through to the feed.
      if (html.includes('view-title-table-column') || html.includes('view-empty')) {
        return [];
      }
      console.warn('Careers browse page had no recognizable job listing markup');
      return null;
    }

    return rows.map(row => {
      const link = row.match(/href="(\/job_detail\/[^"]+)"/)?.[1];
      const title = row.match(/href="\/job_detail\/[^"]*"[^>]*>([^<]+)</)?.[1];
      const posted = row.match(/datetime="([^"]+)"/)?.[1];
      if (!link || !title) return null;
      return {
        title: decodeHtmlEntities(title.trim()),
        link: `https://careers.umich.edu${link}`,
        pubDate: posted || '',
      };
    }).filter(Boolean);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Careers browse page request timed out after 5 seconds');
    } else {
      console.error('Error fetching careers browse page:', error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

const CAREERS_FEED_URLS = [
  'https://careers.umich.edu/search/feed/advanced?career_interest=All&department=CoE%20Robotics&field_job_modes_of_work_target_id=All&job_id=&keyword=&position=All&regular_temporary=All&title=&work_location=All',
  'https://careers.umich.edu/search/feed/advanced?career_interest=All&department=210308&field_job_modes_of_work_target_id=All&job_id=&keyword=&position=All&regular_temporary=All&title=&work_location=All',
];

// A department feed with more items than this almost certainly means the
// department filter was ignored and we got university-wide postings.
const CAREERS_FEED_MAX_ITEMS = 25;

async function fetchCareersFeedItems(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.warn(`Careers feed returned non-200 status ${response.status} for ${url}`);
      return null;
    }

    const xmlData = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ""
    });
    const parsedData = parser.parse(xmlData);

    if (!parsedData?.rss?.channel) {
      const contentType = response.headers.get('content-type') || 'unknown';
      console.warn(`Careers feed response is not RSS (content-type: ${contentType}) for ${url}. First 300 chars:`, xmlData.slice(0, 300));
      return null;
    }

    let items = parsedData.rss.channel.item;
    if (!items) {
      console.warn(`Careers feed parsed OK but contains zero items for ${url}`);
      return [];
    }
    // fast-xml-parser returns a bare object when the feed has a single item
    if (!Array.isArray(items)) items = [items];

    if (items.length > CAREERS_FEED_MAX_ITEMS) {
      console.warn(`Careers feed returned ${items.length} items for ${url} — department filter likely ignored, discarding`);
      return null;
    }

    return items.map(item => ({
      // Strip the trailing posting ID, e.g. "Research Administrator (279803)"
      title: String(item.title).replace(/\s*\(\d+\)\s*$/, ''),
      link: item.link,
      pubDate: item.pubDate,
    })).filter(item => item.title && item.link);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`Careers feed request timed out after 5 seconds for ${url}`);
    } else {
      console.error(`Error fetching careers feed ${url}:`, error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function careersFeedQuery() {
  const fromBrowse = await fetchCareersBrowsePage();
  if (fromBrowse !== null) {
    console.log(`Careers: ${fromBrowse.length} opening(s) from browse page`);
    return fromBrowse;
  }

  for (const url of CAREERS_FEED_URLS) {
    const items = await fetchCareersFeedItems(url);
    if (items && items.length > 0) {
      console.log(`Careers feed fallback: ${items.length} opening(s) from ${url}`);
      return items;
    }
  }
  console.warn('Careers: browse page unusable and no openings from any feed URL — jobs page will show the empty state');
  return [];
}