# Michigan Robotics website

The website for the University of Michigan Robotics Department at [robotics.umich.edu](https://robotics.umich.edu). Built with [Astro](https://astro.build), Tailwind CSS, and MDX.

## Getting started

Requires Node.js 22+ (According to the Astro docs only even-numbered Node versions are supported, e.g 22.x, 24.x, etc).

```bash
npm install
npm run dev
```

The dev server fetches college news before starting. To just build:

```bash
npm run build
npm run preview
```

API credentials for Google Sheets and other integrations are stored as environment variables (not committed).

## How it works

The site is statically generated and deployed to Netlify. A nightly GitHub Actions workflow triggers a fresh build so dynamic data stays current. Pushing to the main branch also triggers a deploy.

### Content

- **News articles** live in `src/content/news/`, organized by year
- **Academic pages** live in `src/content/academics/` as MDX
- **Research focus areas** are in `src/content/focus-areas/`
- **Course materials** are in `src/content/courses/`

Future work: Non-technical editors will be able to manage academic content through [Pages CMS](https://pagescms.org), configured in `.pages.yml`.

### People and profiles

Faculty, staff, and student data is managed in Google Sheets and pulled in via API at build time. Faculty and staff each get a generated profile page under `/people/` with their photo, research interests, and contact info. Students are listed on a single searchable directory page. Profile images are cached locally by a Netlify build plugin to avoid re-fetching on every deploy.

**ROBODEX** is a filterable student resource directory at `/academics/student-services/robodex/`. Students can filter by program (undergrad, master's, PhD) and topic (academic support, career, research, etc.) or search by keyword to find relevant resources, forms, and guides.

### Dynamic data

Several other data sources are pulled in at build time:

- **Events** from the U-M events calendar (events.umich.edu)
- **College news** aggregated from the College of Engineering RSS feed
- **Other external news** can be added manually as stubs
- **Social media posts** from Instagram, YouTube, and Twitter/X

### Authentication

Some pages are behind Netlify Edge Functions for U-M authentication:

- `/intranet/*` -- internal department resources
- `/academics/courses/course-offerings/current-590-690` -- restricted course listings

## Other features

- Auto-generated Open Graph images for news articles (via Satori)
- RSS feed at `/rss.xml` and auto-generated sitemap
- Image optimization and caching with Sharp and custom Netlify plugins
- Searchable and sortable tables for alumni, honors & awards, projects & datasets, and course listings
- Real-time filtering on seminar and speaker series pages
- Online course materials for several freely accessible robotics courses
- Dark mode
- Responsive design with U-M brand colors
- Hidden ASCII game

## Project structure

```
src/
  components/   Astro components
  content/      Markdown/MDX content collections
  layouts/      Page layouts
  lib/          Data fetching and utilities
  pages/        Astro page routes
  styles/       Global styles
public/         Static assets
netlify/        Edge functions and build plugins
```

### Key pages

- `/` -- homepage with news carousel, events, and social feed
- `/about` -- department info, facilities, partnerships, values
- `/academics` -- undergrad and grad programs, courses, student services
- `/research` -- focus areas, projects and datasets
- `/people` -- faculty, staff, student, and emeritus profiles (generated from Google Sheets)
- `/academics/student-services/robodex` -- filterable student resource directory
- `/news` -- articles with category filtering and pagination
- `/events` -- seminar series and speaker events
