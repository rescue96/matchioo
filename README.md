# Matchioo

Matchioo is a Next.js website for a ceremonial-grade matcha cafe. It presents
the brand, matcha drinks, menu, testimonials, team, events, locations, and
frequently asked questions in a responsive, Framer-authored experience.

## How the app works

The site has three routes:

- `/` - the main Matchioo experience
- `/privacy` - the privacy page
- `/404` - the not-found page

Each page is assembled from React components in `src/views/` and
`src/sections/`. The original page metadata, responsive configuration, and
runtime fragments are stored in `src/manifest.json`; images, fonts, and other
self-hosted assets are in `public/assets/`.

The custom route handlers return complete HTML documents rather than standard
Next.js page markup. In development, they render the React components on every
request, so edits appear after a refresh. During a production build, the
`prerender` script renders each page once into `.rendered/`, and the route
handlers serve those generated files. This preserves the original Framer
markup and client-side behavior while keeping the page sections editable as
normal React code.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser. The `predev` script automatically
prepares the rendered page files before Next.js starts.

## Production build

Create and run a production build locally:

```bash
npm run build
npm run start
```

The build runs the prerender step automatically through `prebuild`.

## Configuration

Set `SITE_URL` to the public domain before deployment so canonical and Open
Graph URLs point to the deployed site:

```bash
SITE_URL=https://your-domain.com
```

`NEXT_PUBLIC_SITE_URL` is also supported. On Vercel, the production domain is
used automatically when `SITE_URL` is not set.

## Useful scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Prerender pages and create a production build |
| `npm run start` | Serve the production build |
| `npm run prerender` | Generate the `.rendered/` HTML files |
| `npm run localize-assets` | Localize the source assets |

## Where to edit

- `src/sections/home/` - sections for the main page
- `src/sections/privacy/` - privacy page sections
- `src/sections/404/` - not-found page sections
- `src/views/` - page-level composition
- `public/assets/` - local images, fonts, and media


