# blog

My personal blog, which stored all of my stories in the software engineering industry.

## Setup your local development

Install Hugo

```
brew install hugo
```

Clone with submodules (the Hextra theme is a git submodule):

```
git submodule update --init
```

To build the website

```
hugo
```

## Structure

- `content/engineering/` - software engineering knowledge base (rendered with Hextra's docs sidebar).
- `content/blog/` - blog posts (personal stories).
- `content/tools/` + `apps/*` - small browser-only tools (React, no backend, data in localStorage).

## Working on a tool app

Each tool lives in `apps/<name>` as its own Vite + React project and builds into `static/tools/<name>/`, which Hugo serves as a static page.

```
npm install
npm run dev --workspace=apps/vocab   # local dev server
npm run build:tools                  # build all tool apps into static/tools/*
```

New tools should import `apps/shared/theme.css` from `main.jsx` (keeps colors/dark-mode consistent with the Hextra theme - see `apps/vocab` for the pattern) and copy the theme-detection `<script>` in `index.html`'s `<head>` so the tool opens in the same light/dark mode as the rest of the site.