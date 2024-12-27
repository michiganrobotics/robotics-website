// src/config/navigation.ts
// edit this file to add new menu items on main nav across pages or subnav of a specific page


const base = import.meta.env.PROD ? import.meta.env.BASE_URL : '/';

interface MenuItem {
  label: string;
  uri: string;
  id?: string;
  childItems: {
    nodes: MenuItem[];
  };
}
// edit main nav items here
export const mainNav: MenuItem[] = [
    {
      label: "Academics",
      uri: "/academics",
      id: "academics",
      childItems: {
        nodes: [
          {
            label: "Undergraduate",
            uri: "/academics/undergraduate",
            id: "academics-undergraduate",
            childItems: {
              nodes: [
                {
                  label: "Program Requirements",
                  uri: "/academics/undergraduate/program-requirements",
                  id: "academics-undergraduate-requirements",
                  childItems: { nodes: [] }
                },
                {
                  label: "Advising & Scheduling", 
                  uri: "/academics/undergraduate/scheduling",
                  id: "academics-undergraduate-scheduling",
                  childItems: { nodes: [] }
                },
                {
                  label: "Pathways Speaker Series",
                  uri: "/academics/undergraduate/robotics-pathways-speaker-series",
                  id: "academics-undergraduate-pathways",
                  childItems: { nodes: [] }
                },
                {
                  label: "SUGS",
                  uri: "/academics/undergraduate/sugs",
                  id: "academics-undergraduate-sugs",
                  childItems: { nodes: [] }
                }
              ]
            }
          },
          {
            label: "Graduate",
            uri: "/academics/graduate",
            id: "academics-graduate",
            childItems: {
              nodes: [
                {
                  label: "Admissions",
                  uri: "/academics/graduate/admissions",
                  id: "academics-graduate-admissions",
                  childItems: { nodes: [] }
                },
                {
                  label: "Degree Requirements",
                  uri: "/academics/graduate/degree-requirements",
                  id: "academics-graduate-requirements",
                  childItems: { nodes: [] }
                },
                {
                  label: "Advising",
                  uri: "/academics/graduate/graduate-advising",
                  id: "academics-graduate-advising",
                  childItems: { nodes: [] }
                }
              ]
            }
          },
          {
            label: "Courses",
            uri: "/academics/courses",
            id: "academics-courses",
            childItems: { nodes: [] }
          },
          {
            label: "Current Students",
            uri: "/academics/current-students",
            id: "academics-current-students",
            childItems: { nodes: [] }
          }
        ]
      }
    },
    {
      label: "Research",
      uri: "/research",
      id: "research",
      childItems: {
        nodes: [
          {
            label: "Focus Areas",
            uri: "/research/focus-areas",
            id: "research-focus-areas",
            childItems: { nodes: [] }
          },
          {
            label: "Projects & Datasets",
            uri: "/research/datasets",
            id: "research-datasets",
            childItems: { nodes: [] }
          }
        ]
      }
    },
    {
      label: "People",
      uri: "/people",
      id: "people",
      childItems: {
        nodes: [
          {
            label: "Faculty",
            uri: "/people/faculty",
            id: "people-faculty",
            childItems: { nodes: [] }
          },
          {
            label: "Staff",
            uri: "/people/staff",
            id: "people-staff",
            childItems: { nodes: [] }
          },
          {
            label: "Student Teams",
            uri: "/people/student-teams",
            id: "people-student-teams",
            childItems: { nodes: [] }
          },
          {
            label: "Alumni",
            uri: "/people/alumni",
            id: "people-alumni",
            childItems: { nodes: [] }
          },
          {
            label: "Advisory Board",
            uri: "/people/advisory-board",
            id: "advisory-board",
            childItems: { nodes: [] }
          },
          {
            label: "Honors & Awards",
            uri: "/people/honors-and-awards",
            id: "people-honors-awards",
            childItems: { nodes: [] }
          }
        ]
      }
    },
    {
      label: "News & Events",
      uri: "/news",
      id: "news",
      childItems: { nodes: [] }
    },
    {
      label: "About",
      uri: "/about",
      id: "about",
      childItems: {
        nodes: [
          {
            label: "Values",
            uri: "/about/values",
            id: "about-values",
            childItems: { nodes: [] }
          },
          {
            label: "Media",
            uri: "/about/media",
            id: "about-media",
            childItems: { nodes: [] }
          },
          {
            label: "Building",
            uri: "/about/ford-motor-company-robotics-building",
            id: "about-building",
            childItems: { nodes: [] }
          },
          {
            label: "M-Air",
            uri: "/about/mair",
            id: "about-mair",
            childItems: { nodes: [] }
          },
          {
            label: "Faculty Jobs",
            uri: "/about/jobs",
            id: "about-jobs",
            childItems: { nodes: [] }
          },
          {
            label: "Contact",
            uri: "/about/contact",
            id: "about-contact",
            childItems: { nodes: [] }
          }
        ]
      }
    }
  ];
export const addBaseToMenuItems = (items: any[]) => {
  return items.map(item => {
    const newItem = {
      ...item,
      uri: `${base.replace(/\/$/, '')}/${item.uri?.replace(/^\//, '')}` || '/'
    };
    
    if (item.childItems?.nodes?.length > 0) {
      newItem.childItems = {
        nodes: addBaseToMenuItems(item.childItems.nodes)
      };
    }
    
    return newItem;
  });
};

export const menuItems = addBaseToMenuItems(mainNav);

// edit subnav items here
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
      { title: "Staff", href: "/people/staff" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/staff': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/alumni': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Staff", href: "/people/staff" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/student-teams': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Staff", href: "/people/staff" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ]
  };
  