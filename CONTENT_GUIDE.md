# Content Editing Guide

Edit `src/data/*.json` files to change site content. No code changes needed.

## Files

| File | What it controls |
|---|---|
| `profile.json` | Name, email, avatar, banner, status, summary |
| `experience.json` | Work experience entries |
| `projects.json` | Project cards (title, links, tags, images) |
| `blogs.json` | Blog post entries (title, description, URL, date) |
| `contributions.json` | Open source contributions (PRs, commits, repos) |
| `skills.json` | Skills data (main skills + extras) |
| `education.json` | Education + certifications |
| `socials.json` | Social profile links |
| `config.json` | Videos, section headers, UI labels, tech tag mappings |
| `types.ts` | TypeScript interfaces (edit if you add new fields) |

## Trail images

Project thumbnail images: `src/data/trail-images.ts` (287 entries).

## How to add a project

1. Open `projects.json`
2. Copy an existing entry and paste it at the top of the `featured` or `archive` array
3. Update the fields: `title`, `description`, `tech`, `links`, `image` (set to `undefined` for default)
4. Add the image filename to `trail-images.ts` if you want a custom thumbnail

## How to add an experience

1. Open `experience.json`
2. Copy an existing entry
3. Update `company`, `role`, `duration`, `description` (array of strings), `tech`, `links`

## How to add a blog post

1. Open `blogs.json`
2. Copy an existing entry
3. Update `title`, `description`, `URL`, `date`

## How to add a skill

1. Open `skills.json`
2. Add a new entry to `skills` or `extraSkills` array with `{ "name": "...", "slug": "..." }`
3. The slug must match a valid `tech` value (check existing entries for reference)

## How to change section labels

Edit `config.json` → `sectionHeaders`, `socialsSection`, `viewHeaders`, or `contactForm`.

## How to change the resume

Replace `public/Ashish_Kumar_Resume.pdf` and `public/Ashish_Kumar_Resume.docx` with your files (keep the same filenames or update `App.tsx` references).

## How to change theme colors

Edit CSS custom properties in `src/index.css` (`:root` and `[data-theme="..."]` blocks).
