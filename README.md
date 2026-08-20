# blog

My personal blog, which stored all of my stories in the software engineering industry.

## Setup your local development

Install Hugo

```
brew install hugo
```

Install hugo-book theme as a git submodule, then add the theme data into your configuration file.

```
git submodule add https://github.com/alex-shpak/hugo-book themes/hugo-book
echo 'theme = "hugo-book"' >> hugo.toml
```

To build the website

```
hugo
```

## Structure

- `content/engineering/` - software engineering knowledge base (rendered as the docs sidebar).
- `content/posts/` - blog posts (personal stories).
- `content/tools/` + `apps/*` - small browser-only tools (React, no backend, data in localStorage).

## Working on a tool app

Each tool lives in `apps/<name>` as its own Vite + React project and builds into `static/tools/<name>/`, which Hugo serves as a static page.

```
npm install
npm run dev --workspace=apps/vocab   # local dev server
npm run build:tools                  # build all tool apps into static/tools/*
```