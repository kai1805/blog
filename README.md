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