// src/config/navigation.ts
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
    ]
  };
  