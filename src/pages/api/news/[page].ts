import type { GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';

const PAGE_SIZE = 12;
const SKIP_COUNT = 16; // Articles already shown on the news page

export const getStaticPaths: GetStaticPaths = async () => {
  const [allPosts, collegeNewsItems] = await Promise.all([
    getCollection('news'),
    getCollection('collegeNews', ({ data }) => data.featured !== false),
  ]);

  // Process images and format news items
  const formattedNews = await Promise.all(
    allPosts.map(async (item) => {
      let image = null;
      if (item.data.image?.src) {
        const processed = await getImage({
          src: item.data.image.src,
          width: 540,
          height: 360,
        });
        image = { src: processed.src, alt: item.data.image.alt };
      }
      return {
        title: item.data.title,
        date: item.data.date,
        url: `/news/${new Date(item.data.date).getFullYear()}/${item.id.split('/')[1]}/`,
        isCollege: false,
        image,
      };
    })
  );

  const formattedCollegeNews = await Promise.all(
    collegeNewsItems.map(async (item) => {
      let image = null;
      if (item.data.image?.src) {
        const processed = await getImage({
          src: item.data.image.src,
          width: 540,
          height: 360,
        });
        image = { src: processed.src, alt: item.data.image.alt };
      }
      return {
        title: item.data.title,
        date: item.data.date,
        url: item.data.link,
        isCollege: true,
        image,
      };
    })
  );

  const allSorted = [...formattedNews, ...formattedCollegeNews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Skip articles already displayed on the news page
  const remaining = allSorted.slice(SKIP_COUNT);
  const totalPages = Math.ceil(remaining.length / PAGE_SIZE);

  return Array.from({ length: totalPages }, (_, i) => {
    const pageNum = i + 1;
    const start = i * PAGE_SIZE;
    const articles = remaining.slice(start, start + PAGE_SIZE);

    return {
      params: { page: String(pageNum) },
      props: {
        articles,
        hasMore: pageNum < totalPages,
      },
    };
  });
};

export function GET({ props }: { props: { articles: any[]; hasMore: boolean } }) {
  return new Response(JSON.stringify(props), {
    headers: { 'Content-Type': 'application/json' },
  });
}
