// src/config/navigation.ts
// edit this file to add new menu items on main nav across pages or subnav of a specific page

interface MenuItem {
  label: string;
  uri: string;
  id?: string;
  childItems: {
    nodes: MenuItem[];
  };
}

interface SubNavItem {
  title: string;
  href: string;
  external?: boolean;
  anchor?: boolean;
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
                  label: "Degree Requirements",
                  uri: "/academics/undergraduate/degree-requirements",
                  id: "academics-undergraduate-requirements",
                  childItems: { nodes: [] }
                },
                {
                  label: "Advising", 
                  uri: "/academics/undergraduate/advising",
                  id: "academics-undergraduate-advising",
                  childItems: { nodes: [] }
                },
                {
                  label: "SURE",
                  uri: "/academics/undergraduate/sure",
                  id: "academics-undergraduate-sure",
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
                  uri: "/academics/graduate/advising",
                  id: "academics-graduate-advising",
                  childItems: { nodes: [] }
                },
                {
                  label: "SUGS",
                  uri: "/academics/graduate/sugs",
                  id: "academics-graduate-sugs",
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
            label: "Student Services",
            uri: "/academics/student-services",
            id: "academics-student-services",
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
            uri: "/research/projects-and-datasets",
            id: "research-projects-and-datasets",
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
            label: "Students",
            uri: "/people/students",
            id: "people-students",
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
      label: "News",
      uri: "/news",
      id: "news",
      childItems: { nodes: [] }
    },
    {
      label: "Events",
      uri: "/events",
      id: "events",
      childItems: { nodes: [
        {
          label: "Pathways & Careers Series",
          uri: "/events/robotics-pathways-speaker-series",
          id: "events-robotics-pathways-speaker-series",
          childItems: { nodes: [] }
        },
        {
          label: "Robotics Seminar Series",
          uri: "/events/robotics-seminar-series",
          id: "events-robotics-seminar-series",
          childItems: { nodes: [] }
        }
      ] }
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
            label: "Facilities",
            uri: "/about/facilities",
            id: "about-facilities",
            childItems: { nodes: [] }
          },
          {
            label: "Partnerships",
            uri: "/about/partnerships",
            id: "about-partnerships",
            childItems: { nodes: [] }
          },
          {
            label: "Faculty Jobs",
            uri: "/about/faculty-jobs",
            id: "about-faculty-jobs",
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
      uri: item.uri || '/'
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
export const subNavConfig: Record<string, SubNavItem[]> = {
    // Match WordPress slugs exactly to edit their subnav menus
    // Only match exact 'research' path, not children
    'research$': [
      { title: "Focus Areas", href: "/research/focus-areas" },
      { title: "Open-Source Projects & Datasets", href: "/research/projects-and-datasets" }
    ],
    'research/focus-areas': [
      { title: "Open-Source Projects & Datasets", href: "/research/projects-and-datasets" }
    ],
    'research/projects-and-datasets': [
      { title: "Focus Areas", href: "/research/focus-areas" }
    ],
    'academics$': [
      { title: "Undergraduate", href: "/academics/undergraduate" },
      { title: "Graduate", href: "/academics/graduate" },
      { title: "Courses", href: "/academics/courses" },
      { title: "Student Services", href: "/academics/student-services" }
    ],
    'academics/student-services': [
      { title: "Robodex", href: "/academics/student-services/robodex" },
      { title: "RGSC", href: "/academics/student-services/robotics-graduate-student-council" },
      { title: "RUSC", href: "/academics/student-services/robotics-undergraduate-student-council" },
      { title: "Student resources", href: "/academics/student-services#student-resources", anchor: true },
      { title: "Staff", href: "/academics/student-services#student-services-staff", anchor: true },
      { title: "Communicate to our students", href: "/academics/student-services#communicate-to-our-students", anchor: true }
    ],
    'academics/student-services/registering-for-classes': [
      { title: "Add a class", href: "/academics/student-services/registering-for-classes#add-a-class", anchor: true },
      { title: "Drop a class", href: "/academics/student-services/registering-for-classes#drop-a-class", anchor: true },
      { title: "Waitlists", href: "/academics/student-services/registering-for-classes#waitlist", anchor: true },
      { title: "Independent Study", href: "/academics/student-services/registering-for-classes#enroll-in-an-independent-study-rob-590690990995", anchor: true },
      { title: "Visit or Audit Classes", href: "/academics/student-services/registering-for-classes#visitaudit-a-course", anchor: true }
    ],
    'academics/courses': [
      { title: "Current Term Courses", href: "/academics/courses/course-offerings" },
      { title: "Complete Course List", href: "/academics/courses/complete-course-list" },
      { title: "Free Online Courses", href: "/academics/courses/online-courses" },
      { title: "Course Guide", href: "https://docs.google.com/spreadsheets/d/1qXqC4uJqZYVOadw0eIn9LAWEu_8lLwX65nOFFohlj4Y/edit?usp=sharing", external: true },
      { title: "Course Override Requests", href: "/academics/courses#course-override-requests", anchor: true }
    ],
    'academics/courses/course-offerings': [
      { title: "Complete Course List", href: "/academics/courses/complete-course-list" },
      { title: "Free Online Courses", href: "/academics/courses/online-courses" },
      { title: "Course Guide", href: "https://docs.google.com/spreadsheets/d/1qXqC4uJqZYVOadw0eIn9LAWEu_8lLwX65nOFFohlj4Y/edit?usp=sharing", external: true }
    ],
    'academics/courses/complete-course-list': [
      { title: "Current Term Courses", href: "/academics/courses/course-offerings" },
      { title: "Course Guide", href: "https://docs.google.com/spreadsheets/d/1qXqC4uJqZYVOadw0eIn9LAWEu_8lLwX65nOFFohlj4Y/edit?usp=sharing", external: true }
    ],
    'academics/courses/online-courses': [
      { title: "Current Term Courses", href: "/academics/courses/course-offerings" },
      { title: "Complete Course List", href: "/academics/courses/complete-course-list" },
    ],
    'academics/graduate': [
      { title: "Admissions", href: "/academics/graduate/admissions" },
      { title: "Degree Requirements", href: "/academics/graduate/degree-requirements" },
      { title: "Advising", href: "/academics/graduate/advising" }
    ],
    'academics/graduate/admissions': [
      { title: "Apply", href: "https://rackham.umich.edu/admissions/applying/", external: true },
      { title: "Application Requirements", href: "/academics/graduate/admissions#application-requirements", anchor: true },
      { title: "Deadlines", href: "/academics/graduate/admissions#application-deadlines", anchor: true },
      { title: "Common Questions", href: "/academics/graduate/admissions#common-questions", anchor: true },
      { title: "Contact", href: "/academics/graduate/admissions#contact", anchor: true },
      { title: "Degree Requirements", href: "/academics/graduate/degree-requirements" },
      { title: "Graduate Advising", href: "/academics/graduate/advising" },
      { title: "SUGS", href: "/academics/graduate/sugs" }
    ],
    'academics/graduate/degree-requirements': [
      { title: "Credit Requirements", href: "/academics/graduate/degree-requirements#credit-requirements", anchor: true },
      { title: "1st Year Students", href: "/academics/graduate/degree-requirements#1st-year-students-", anchor: true },
      { title: "Grade Requirements", href: "/academics/graduate/degree-requirements#grade-requirements", anchor: true },
      { title: "Graduate Advising", href: "/academics/graduate/advising" },
      { title: "Admissions", href: "/academics/graduate/admissions" }
    ],
    'academics/graduate/advising': [
      { title: "Degree Requirements", href: "/academics/graduate/degree-requirements" },
      { title: "Admissions", href: "/academics/graduate/admissions" }
    ],
    'academics/undergraduate': [
      { title: "Advising", href: "/academics/undergraduate/advising" },
      { title: "Degree Requirements", href: "/academics/undergraduate/degree-requirements" },
      { title: "Current Course Offerings", href: "/academics/courses/course-offerings" },
      { title: "Pathways Speaker Series", href: "/events/robotics-pathways-speaker-series" }
    ],
    'academics/undergraduate/degree-requirements': [
      { title: "Advising", href: "/academics/undergraduate/advising" },
      { title: "Program Guide", href: "http://robotics.umich.edu/undergrad-guide", external: true }
    ],
    'academics/undergraduate/advising': [
      { title: "Degree Requirements", href: "/academics/undergraduate/degree-requirements" },
      { title: "Tips & Advice", href: "/academics/undergraduate/advising#general-advising-tips-for-robotics-majors", anchor: true },
      { title: "Sample Schedules", href: "/academics/undergraduate/advising#sample--editable-schedules", anchor: true },
      { title: "Petitions", href: "/academics/undergraduate/advising#departmental-petitions", anchor: true },
      { title: "Get Involved", href: "/academics/undergraduate/advising#join-our-community", anchor: true },
      { title: "Program Guide", href: "http://robotics.umich.edu/undergrad-guide", external: true }
    ],
    'academics/graduate/sugs': [
      { title: "Graduate Admissions", href: "/academics/graduate/admissions" },
      { title: "Degree Requirements", href: "/academics/graduate/degree-requirements" },
      { title: "Graduate Advising", href: "/academics/graduate/advising" },
      { title: "SUGS Deadlines", href: "/academics/graduate/sugs#application-deadlines", anchor: true }
    ],
    'academics/undergraduate/sure': [
      { title: "SURE Projects", href: "/academics/undergraduate/sure#robotics-sure-projects", anchor: true },
      { title: "Advising", href: "/academics/undergraduate/advising" },
      { title: "Degree Requirements", href: "/academics/undergraduate/degree-requirements" }
    ],
    'people$': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Staff", href: "/people/staff" },
      { title: "Students", href: "/people/students" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/faculty': [
      { title: "Emeritus Faculty", href: "/people/faculty/emeritus" },
      { title: "Affiliate Faculty", href: "/people/faculty/affiliate" },
      { title: "Staff", href: "/people/staff" },
      { title: "Students", href: "/people/students" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/faculty/emeritus': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Affiliate Faculty", href: "/people/faculty/affiliate" },
      { title: "Staff", href: "/people/staff" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/faculty/affiliate': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Emeritus Faculty", href: "/people/faculty/emeritus" },
      { title: "Staff", href: "/people/staff" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/staff': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Students", href: "/people/students" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/students': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Staff", href: "/people/staff" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/alumni': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Staff", href: "/people/staff" },
      { title: "Students", href: "/people/students" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/student-teams': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Staff", href: "/people/staff" },
      { title: "Students", href: "/people/students" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Advisory Board", href: "/people/advisory-board" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/advisory-board': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Staff", href: "/people/staff" },
      { title: "Students", href: "/people/students" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Honors and Awards", href: "/people/honors-and-awards"}
    ],
    'people/honors-and-awards': [
      { title: "Faculty", href: "/people/faculty" },
      { title: "Staff", href: "/people/staff" },
      { title: "Students", href: "/people/students" },
      { title: "Student Teams", href: "/people/student-teams" },
      { title: "Alumni", href: "/people/alumni" },
      { title: "Advisory Board", href: "/people/advisory-board"}
    ],
    'about$': [
      { title: "Values", href: "/about/values" },
      { title: "Facilities", href: "/about/facilities" },
      { title: "Faculty Jobs", href: "/about/faculty-jobs" },
      { title: "Contact", href: "/about/contact"}
    ],
    'about/values': [
      { title: "Facilities", href: "/about/facilities" },
      { title: "Faculty Jobs", href: "/about/faculty-jobs" },
      { title: "Contact", href: "/about/contact"}
    ],
    'about/facilities': [
      { title: "Ford Robotics Building", href: "/about/facilities/ford-robotics-building" },
      { title: "M-Air Net", href: "/about/facilities/m-air-net" },
      { title: "Makerspace", href: "https://teamprojects.engin.umich.edu/makerspace-about/", external: true },
      { title: "Mcity", href: "https://mcity.umich.edu", external: true },
      { title: "Other U-M Facilities", href: "https://www.engin.umich.edu/research/labs-facilities/", external: true }
    ],
    'about/facilities/ford-robotics-building': [
      { title: "M-Air Net", href: "/about/facilities/m-air-net" },      
      { title: "Makerspace", href: "https://teamprojects.engin.umich.edu/makerspace-about/", external: true },
      { title: "Mcity", href: "https://mcity.umich.edu", external: true },
      { title: "Other U-M Facilities", href: "https://www.engin.umich.edu/research/labs-facilities/", external: true },
      { title: "Tours", href: "/about/facilities/ford-robotics-building#tours", anchor: true }
    ],
    'about/facilities/m-air-net': [
      { title: "Ford Robotics Building", href: "/about/facilities/ford-robotics-building" },
      { title: "Makerspace", href: "https://teamprojects.engin.umich.edu/makerspace-about/", external: true },
      { title: "Mcity", href: "https://mcity.umich.edu", external: true },
      { title: "Other U-M Facilities", href: "https://www.engin.umich.edu/research/labs-facilities/", external: true }
    ],
    'about/faculty-jobs': [
      { title: "Values", href: "/about/values" },
      { title: "Facilities", href: "/about/facilities" },
      { title: "Contact", href: "/about/contact"}
    ],
    'about/contact': [
      { title: "Values", href: "/about/values" },
      { title: "Facilities", href: "/about/facilities" },
      { title: "Faculty Jobs", href: "/about/faculty-jobs"}
    ],
    'events$': [
      { title: "Pathways & Careers Series", href: "/events/robotics-pathways-speaker-series" },
      { title: "Robotics Seminar Series", href: "/events/robotics-seminar-series" },
      { title: "Events on Happening @ Michigan", href: "https://events.umich.edu/group/3998", external: true }
    ],
    'events/robotics-pathways-speaker-series': [
      { title: "Robotics Seminar Series", href: "/events/robotics-seminar-series" },
      { title: "Events on Happening @ Michigan", href: "https://events.umich.edu/group/3998", external: true }
    ],
    'events/robotics-seminar-series': [
      { title: "Pathways & Careers Series", href: "/events/robotics-pathways-speaker-series" },
      { title: "Events on Happening @ Michigan", href: "https://events.umich.edu/group/3998", external: true }
    ]
  };
  