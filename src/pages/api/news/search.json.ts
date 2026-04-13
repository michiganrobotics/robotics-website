import { getCollection } from 'astro:content';

export async function GET() {
  const [allPosts, allCollegePosts] = await Promise.all([
    getCollection('news'),
    getCollection('collegeNews'),
  ]);

  const searchableNews = [
    ...allPosts.map((post) => ({
      title: post.data.title,
      date: post.data.date,
      url: `/news/${new Date(post.data.date).getFullYear()}/${post.id.split('/')[1]}/`,
      category: post.data.categories?.[0] || 'Uncategorized',
      categories: post.data.categories || [],
      tags: post.data.tags || [],
      excerpt: post.data.excerpt || post.data.seoDescription || '',
      type: 'robotics',
    })),
    ...allCollegePosts.map((post) => ({
      title: post.data.title,
      date: post.data.date,
      url: post.data.link,
      category: post.data.categories?.[0] || 'College News',
      categories: post.data.categories || [],
      tags: post.data.tags || [],
      excerpt: post.data.description || '',
      type: 'college',
    })),
  ];

  return new Response(JSON.stringify(searchableNews), {
    headers: { 'Content-Type': 'application/json' },
  });
}
