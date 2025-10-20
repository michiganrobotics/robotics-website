# Website Documentation

Site has a github action to automatically build at 3am EST, incorporating any new changes to the various spreadsheets, events, or College news.

Site can also be updated manually by pushing to the main branch, which triggers a build on Netlify.

## Site Structure

### Pages

#### Main Pages
- `/` - Homepage
- `/about` - About page with information about the organization
- `/404` - Custom 404 error page

### Academic Pages
- `/academic/` - Academic landing page
- Pages can be created under /src/pages/academic as .astro files OR /src/content/academic as .md or .mdx files

#### Research
- `/research` - Main research landing page
- `/research/projects-and-datasets` - Projects and datasets overview
- `/research/focus-areas` - Research focus areas landing page
- `/research/focus-areas/[slug]` - Dynamic pages for individual research focus areas

#### News
- `/news` - News landing page
- `/news/[year]/[slug]` - News article page
- `/news/[category]/[...page]` - Category news pages with pagination
- `/news/[year]/[slug]/og-image.png` - Open Graph image generator for news articles

### Page Functionality

#### Homepage (`/index.astro`)
- Main landing page
- Populates the news carousel with the latest 3 news articles
- Draws from events.umich.edu
- Draws social posts from social profiles

#### About Page (`/about/index.astro`)
- Organization information
- Mission and values
- Contact details

#### Research Pages
1. Main Research Page (`/research/index.astro`)
   - Overview of research activities
   - Links to focus areas and projects

2. Projects and Datasets (`/research/projects-and-datasets.astro`)
   - Listing of research projects
   - Available datasets
   - Research resources

3. Focus Areas
   - Landing Page (`/research/focus-areas/index.astro`)
     - Overview of all research focus areas
   - Individual Focus Area Pages (`/research/focus-areas/[slug].astro`)
     - Dynamic pages for each focus area
     - Detailed information about specific research domains

#### Profile Pages
- Faculty, staff, student profiles from Google Sheets
- `/people/[type]/[slug]` - Dynamic profile pages for faculty, staff, and students




## Additional Resources

- [Astro Documentation](https://docs.astro.build)
