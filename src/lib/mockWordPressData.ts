export const mockWordPressData = {
  // Navigation data
  menus: {
    nodes: [
      {
        name: "Primary",
        menuItems: {
          nodes: [
            {
              uri: "/about",
              url: "/about",
              order: 1,
              label: "About",
              childItems: {
                nodes: [
                  {
                    uri: "/about/mission",
                    url: "/about/mission",
                    order: 1,
                    label: "Mission",
                    childItems: { nodes: [] }
                  }
                ]
              }
            },
            {
              uri: "/research",
              url: "/research",
              order: 2,
              label: "Research",
              childItems: { nodes: [] }
            }
          ]
        }
      }
    ]
  },
  generalSettings: {
    title: "Michigan Robotics",
    url: "http://localhost:4321",
    description: "Mock WordPress Site"
  },

  // Homepage posts
  posts: {
    nodes: [
      {
        date: "2024-03-15",
        uri: "/news/sample-post-1",
        title: "Sample News Post 1",
        commentCount: 0,
        excerpt: "This is a sample news post excerpt...",
        featuredImage: {
          node: {
            srcSet: "",
            sourceUrl: "https://placehold.co/600x400",
            altText: "Sample image",
            mediaDetails: {
              height: 400,
              width: 600
            }
          }
        }
      },
      // Add more sample posts as needed
    ]
  },

  // Node by URI data
  nodeByUri: {
    __typename: "Post",
    isContentNode: true,
    isTermNode: false,
    id: "sample-post-1",
    title: "Sample Post",
    date: "2024-03-15",
    uri: "/sample-post-1",
    excerpt: "Sample excerpt...",
    content: "<p>This is sample content for the post...</p>",
    featuredImage: {
      node: {
        srcSet: "",
        sourceUrl: "https://placehold.co/600x400",
        altText: "Sample image",
        mediaDetails: {
          height: 400,
          width: 600
        }
      }
    },
    author: {
      node: {
        name: "Sample Author"
      }
    }
  }
};

// Mock URIs for getAllUris
export const mockURIs = [
  { params: { uri: "sample-post-1" } },
  { params: { uri: "about" } },
  { params: { uri: "research" } }
]; 