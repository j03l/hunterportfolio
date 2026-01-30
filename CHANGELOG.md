# Changelog

### 2.2.0 (2026-01-30)

#### New Components
- Added `ScrollToTop` component with animated scroll-triggered spinning arrow and smooth scroll to top functionality
- Added `MobileNav` component with iOS-style bottom sheet navigation menu with backdrop blur effect
- Added `RelatedPosts` component that displays related blog posts based on tag similarity
- Added `Callout` component for styled admonitions/alerts (info, warning, success, danger types) in blog posts

#### MDX Support and Code Highlighting
- Added MDX support via `@astrojs/mdx` integration for interactive blog content
- Integrated Astro Expressive Code for enhanced syntax highlighting with GitHub Dark theme
- Converted `typescript-patterns.md` to `typescript-patterns.mdx` demonstrating MDX capabilities with Callout components
- Added code block breakout styling for wider code blocks on larger screens

#### Blog Enhancements
- Added reading time display to blog posts and blog cards
- Added reading progress indicator bar at top of blog posts
- Added resources section for helpful links at end of blog posts
- Added "Back to Blog" footer navigation in blog post layout
- Updated blog content schema to include `readTime` and `resources` fields

#### Layout and UX Improvements
- Added named grid lines layout system for blog content with content/popout/feature/full width options
- Optimized font loading with non-render-blocking strategy (preload + media print technique)
- Added `viewport-fit=cover` for proper safe area handling on notched devices
- Changed main page wrapper from `<section>` to semantic `<main>` element
- Added background color to html element to prevent white flash on page load

#### Styling Updates
- Added styled horizontal rule (`<hr>`) with decorative yellow dot in blog prose
- Added comprehensive callout/admonition styles with dark mode support
- Improved inline code styling (excluding code blocks)
- Added `overflow-hidden` to BlogCard, Projects card for proper clipping
- Added extra bottom padding to footer for mobile navigation clearance
- Improved text color consistency on CV page date ranges
- Added larger tap targets for footer navigation links

#### Configuration
- Updated Cloudflare adapter with `imageService: "compile"` option
- Added Vite server allowed hosts configuration

### 2.1.0 (2026-01-30)

#### Dark Mode Support
- Added comprehensive dark mode support across the entire site
- Dark mode automatically follows browser/OS preference via `prefers-color-scheme`
- Updated Hero section with separate light/dark gradient overlays and programming symbol patterns
- Updated all text colors with appropriate dark mode variants
- Added dark mode support for skill tags, project cards, and section backgrounds
- Configured dark accent colors (yellow-400 for dark, yellow-500 for light)

#### Navigation Enhancements
- Added active indicator (yellow underline) showing current page/section in header navigation
- Added Blog and CV links to the main navigation
- Navigation now correctly highlights the current page across blog posts and CV pages
- Improved header scroll behavior with dark mode backdrop support

#### New Pages and Features
- Added Blog section with index page and individual post pages
- Added CV page
- Added 404 error page
- Added RSS feed support (`/rss.xml`)
- Added project detail pages with case study layout
- Added style guide page for reference

#### Content Architecture
- Introduced content collections for blog posts and projects
- Projects component now integrates with content collection
- Added BlogCard component for consistent blog post previews
- Added BaseLayout, BlogPost, and ProjectLayout layouts

#### Component Improvements
- Made section headings sticky on large screens (About, Projects)
- Added animated icon transitions on project cards (spinning arrow, globe icon for external links)
- Internal project links now show "View Case Study" call-to-action
- Updated Footer and other components with dark mode styles

#### Configuration
- Added `site` URL to Astro config for proper RSS and sitemap generation
- Added SEO dependencies (astro-seo, astro-seo-schema, @astrojs/rss)
- Added optional `accentColorDark` to config for dark mode theming

### 2.0.0

- Complete rewrite of the template using Astro and Tailwind

### 1.2.2

- Updated dependencies and gulpfile

### 1.2.1

- Updated dependencies and gulpfile
- Added `no-image` optional class for projects without images (see above for
  usage)

### 1.2.0

- Added support for optional "Show More Projects" that hides some projects by
  default if included
- Added optional sections to display certifications, languages, etc.

### 1.1.3

- Added default favicon to be used or changed
- Added `sticky` class to make header fixed
- Updated docs to add image section

### 1.1.2

- Added `no-scroll` class option to header navigation anchor if you want to link
  to external site
- Changed contact form input / textarea colours to be based off `$base-color`
- Changed main background to 100vh so it doesn't overflow if viewport height <
  700px

### 1.1.1

- Made input placeholder text more readable
- Removed timeline line when no JS
- Added some basic styling to timeline when no JS

### 1.1.0

- Fixed menu toggle on mobile devices
- Fixed z-index / scrolling issue with mobile menu
- Mobile menu now closes once a nav element is hit
