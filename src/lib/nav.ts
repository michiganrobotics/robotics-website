// src/config/navigation.ts

export const mainNav = [
  {
    label: "About",
    uri: "/about", 
    childItems: {
      nodes: [
        {
          label: "Overview",
          uri: "/about",
          childItems: { nodes: [] }
        },
        {
          label: "People", 
          uri: "/about/people",
          childItems: { nodes: [] }
        }
      ]
    }
  },
  {
    label: "Research",
    uri: "/research",
    childItems: {
      nodes: [
        {
          label: "Focus Areas",
          uri: "/research/focus-areas",
          childItems: { nodes: [] }
        },
        {
          label: "Projects & Datasets",
          uri: "/research/datasets", 
          childItems: { nodes: [] }
        }
      ]
    }
  },
  {
    label: "Academics",
    uri: "/academics",
    childItems: {
      nodes: [
        {
          label: "Courses",
          uri: "/academics/courses",
          childItems: {
            nodes: [
              {
                label: "Current Term",
                uri: "/academics/courses/current-term",
                childItems: { nodes: [] }
              },
              {
                label: "Complete List",
                uri: "/academics/courses/complete-course-list",
                childItems: { nodes: [] }
              }
            ]
          }
        }
      ]
    }
  }
];



export const subNavConfig = {
    // Match WordPress slugs exactly to edit their subnav menus
    // Only match exact 'research' path, not children
    'research$': [
      { title: "Focus Areas", href: "/research/focus-areas" },
      { title: "Open-Source Projects & Datasets", href: "/research/datasets" }
    ],
    'academics/courses': [
      { title: "Current Term Courses", href: "/academics/courses/current-term" },
      { title: "Complete Course List", href: "/academics/courses/complete-course-list" },
      { title: "Online Courses", href: "/academics/courses/online-courses" }
    ],
    'people/faculty': [
      { title: "Affiliate Faculty", href: "/people/faculty/affiliate" },
      { title: "Emeritus Faculty", href: "/people/faculty/emeritus" },
      { title: "Staff", href: "/people/staff" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ]
  };
  