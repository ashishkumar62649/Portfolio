<div align="center">

# Ashish Kumar — Portfolio

**AI & Data Science @ IIT Guwahati**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Live Site](https://ashishkumar62649.github.io/Portfolio) · [LinkedIn](https://linkedin.com/in/ashishkumar62649) · [GitHub](https://github.com/ashishkumar62649) · [Instagram](https://instagram.com/ashishkumar62649)

</div>

---

## About

A minimal, content-driven portfolio built with React and Tailwind CSS. Designed to be fast, easy to update, and deployable anywhere — Vercel, Netlify, or GitHub Pages.

All portfolio content lives in JSON data files. Update text, projects, experience, skills, or links by editing a JSON file — no code changes required.

## Features

- **Theme System** — Dark, Light, Cyberpunk, Retro, and IBM themes
- **Animated Preloader** — Boot-sequence loading screen
- **Image Trail** — Cursor-following photo effect on desktop
- **GitHub Heatmap** — Live contribution graph
- **Open Source Section** — Pull request history with merge status
- **Responsive** — Mobile-first layout, works on all screen sizes
- **Contact Form** — FormSubmit integration, no backend needed

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript 6.0 |
| Build | Vite 8.1 |
| Styling | Tailwind CSS 4.3 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Deployment | GitHub Pages / Vercel / Netlify |

## Getting Started

```bash
# Clone
git clone https://github.com/ashishkumar62649/Portfolio.git
cd Portfolio

# Install
npm install

# Dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Editing Content

All content is in `src/data/*.json`:

| File | What it controls |
|------|-----------------|
| `profile.json` | Name, email, bio, avatar, resume links |
| `experience.json` | Work experience entries |
| `projects.json` | Featured & archive projects |
| `blogs.json` | Blog posts |
| `skills.json` | Skills list with icons |
| `education.json` | Education & certifications |
| `socials.json` | Social profile links |
| `config.json` | UI labels, section headers, videos |
| `trail-images.ts` | Project thumbnail images |

详细的编辑说明见 [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md).

## Project Structure

```
├── public/
│   ├── images/          # Avatar, banner, profile pics
│   ├── img/             # Project thumbnails
│   └── video/           # Background videos
├── src/
│   ├── components/      # React components
│   ├── data/            # JSON content files
│   ├── lib/             # Utilities
│   ├── utils/           # Text helpers
│   ├── App.tsx          # Main app
│   ├── main.tsx         # Entry point
│   └── index.css        # Theme variables
├── index.html
└── package.json
```

## Deployment

**Vercel / Netlify:**
1. Push to GitHub
2. Import repo on Vercel/Netlify
3. Framework: Vite, Build command: `npm run build`, Output: `dist`
4. Deploy

**GitHub Pages:**
```bash
npm run build
# Push dist/ to gh-pages branch
```

## License

Feel free to use this repository for your own portfolio. The only requirement: **give credit** by linking back to [ashishkumar62649.github.io/Portfolio](https://ashishkumar62649.github.io/Portfolio) in your README or footer.

```
Portfolio design and code by Ashish Kumar — https://ashishkumar62649.github.io/Portfolio
```
