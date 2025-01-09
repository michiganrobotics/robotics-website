import { mockWordPressData, mockURIs } from './mockWordPressData';

const IS_DEV = import.meta.env.DEV;
const API_URL = import.meta.env.PUBLIC_WORDPRESS_API_URL;

export async function navQuery() {
  if (IS_DEV) {
    return mockWordPressData;
  }
  // Add error handling
  if (!API_URL) {
    console.error('WordPress API URL is not defined');
    return {
      menus: { nodes: [] },
      generalSettings: {}
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query NavQuery {
            menus {
              nodes {
                name
                menuItems(where: {parentId: 0}) {
                  nodes {
                    uri
                    url
                    order
                    label
                    childItems {
                      nodes {
                        uri
                        url
                        order
                        label
                        childItems {
                          nodes {
                            uri
                            url
                            order
                            label
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            generalSettings {
              title
              url
              description
            }
          }
        `
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching nav data:', error);
    return {
      menus: { nodes: [] },
      generalSettings: {}
    };
  }
}

export async function homePagePostsQuery(){
    if (IS_DEV) {
        return { posts: mockWordPressData.posts };
    }
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            query: `{
                posts(first:25) {
                  nodes {
                    date
                    uri
                    title
                    commentCount
                    excerpt
                    featuredImage {
                      node {
                        srcSet
                        sourceUrl
                        altText
                        mediaDetails {
                          height
                          width
                        }
                      }
                    }
                  }
                }
              }
            `
        })
    });
    const{ data } = await response.json();
    return data;
}


export async function getNodeByURI(uri){
    if (IS_DEV) {
        return { nodeByUri: mockWordPressData.nodeByUri };
    }
    const response = await fetch(import.meta.env.WORDPRESS_API_URL, {
        method: 'post', 
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            query: `query GetNodeByURI($uri: String!) {
                nodeByUri(uri: $uri) {
                  __typename
                  isContentNode
                  isTermNode
                  ... on Post {
                    id
                    title
                    date
                    uri
                    excerpt
                    content
                    featuredImage {
                      node {
                        srcSet
                        sourceUrl
                        altText
                        mediaDetails {
                          height
                          width
                        }
                      }
                    }
                     author {
                      node {
                        name
                        }
                    }  
                  }
                  ... on Page {
                    id
                    title
                    uri
                    date
                    content
                    parentId
                    featuredImage {
                      node {
                        mediaItemUrl
                        srcSet
                        sourceUrl
                        altText
                        mediaDetails {
                          height
                          width
                        }
                      }
                    }
                    children(first: 6, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
                      nodes{
                        id
                        uri
                         ... on NodeWithTitle {
                          title
                        }
                      }
                    }  
                  }
                }
              }
            `,
            variables: {
                uri: uri
            }
        })
    });
    const{ data } = await response.json();
    return data;
}

export async function getAllUris(){
  if (IS_DEV) {
    return mockURIs;
  }
  // initial posts fetching
  let afterCursor = '';
  let allPosts = [];
  let allPages = [];

  do {
    const responsePosts = await fetch(import.meta.env.WORDPRESS_API_URL, {
      method: 'post', 
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
          query: `
          query GetAllUris($afterCursor: String) {
            posts(first: 100, after: $afterCursor) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                uri
              }
            }
          }
          `,
          variables: {
            afterCursor
          }
      })
    });

    const { data: dataPosts } = await responsePosts.json();
    allPosts = [...allPosts, ...dataPosts.posts.nodes];
    afterCursor = dataPosts.posts.pageInfo.hasNextPage ? dataPosts.posts.pageInfo.endCursor : '';
  } while (afterCursor);

  // initial pages fetching
  afterCursor = ''; // reset cursor for pages

  do {
    const responsePages = await fetch(import.meta.env.WORDPRESS_API_URL, {
      method: 'post', 
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
          query: `
          query GetAllUris($afterCursor: String) {
            pages(first: 100, after: $afterCursor) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                uri
              }
            }
          }
          `,
          variables: {
            afterCursor
          }
      })
    });

    const { data: dataPages } = await responsePages.json();
    allPages = [...allPages, ...dataPages.pages.nodes];
    afterCursor = dataPages.pages.pageInfo.hasNextPage ? dataPages.pages.pageInfo.endCursor : '';
  } while (afterCursor);

  let allUris = [...allPosts, ...allPages];

  const uris = allUris
    .filter(node => node.uri !== null)
    .map(node => {
      let trimmedURI = node.uri.substring(1);
      trimmedURI = trimmedURI.substring(0, trimmedURI.length - 1)
      return {params: {
        uri: trimmedURI
      }}
    })
    .filter(({ params }) => params.uri !== ''); // Filtering out the home page URI
  return uris;
}

function truncateDescription(description, maxLength = 250) {
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
      description: truncateDescription(event.description)
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
  const response = await fetch('https://news.engin.umich.edu/category/research/robotics/feed');
  const xmlData = await response.text();
  const parser = new XMLParser();
  const parsedData = parser.parse(xmlData);

  const newsItems = parsedData.rss.channel.item.slice(0, 4);

  const truncatedData = newsItems.map(newsItem => ({
    COLLEGE_TITLE: newsItem.title,
    COLLEGE_LINK: newsItem.link,
    COLLEGE_PUB_DATE: newsItem.pubDate
  }));
  return truncatedData;
}