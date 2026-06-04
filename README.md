# EMMA Aerospace Consulting LLP - Static Marketing Site

This project is a production-ready, dependency-free static website built with:

- `index.html` — main single-page marketing site
- `styles.css` — shared styles for all pages
- `signature.html` — internal HTML email-signature generator
- `article.html` — single-article template

No build step, package manager, or framework is required.

## Local Preview

Open `index.html` directly in a browser, or serve the folder with any static server.

Example with Python:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Deployment

Deploy as a plain static site to any static host:

- GitHub Pages
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- Any Nginx/Apache static directory

Upload all files to the site root (`index.html`, `styles.css`, `signature.html`, `article.html`).
The subpages are reachable at `/signature.html` and `/article.html`.

## Editing Content

All page copy is in `index.html` and is organized by section comments and semantic blocks:

- Header / Navigation
- Hero
- About (positioning, approach, and the four core capability blocks)
- Strategic Outcomes (Relevance / Presence / Belonging)
- Services
- Leadership
- Expertise
- Contact
- Footer

Styling tokens (colors, spacing, radius) are at the top of `styles.css` under `:root` for quick theme adjustments.

## Email Signature Generator (`signature.html`)

A standalone, internal tool for producing on-brand HTML email signatures.

- Edit **Full name**, **Position**, and the **email handle** (the domain `@emmaconsulting.space`
  is fixed). Default: Gabor Magyari, Managing Partner, `gabor.magyari@emmaconsulting.space`.
- The preview renders on a white "paper" surface, matching how it appears in an email client.
- **Copy signature** places a rich-HTML version on the clipboard — paste directly into Gmail,
  Outlook, or Apple Mail signature settings.
- **Copy HTML** copies the raw, inline-styled source for manual installation.
- The signature markup is intentionally table-based with inline styles, web-safe fonts, and solid
  colors (no external images or CSS gradients) for maximum email-client compatibility.

## Single Article Page (`article.html`)

A ready-to-fill long-form template.

- Replace the category, headline, and meta line in the article header (marked with `TODO`).
- Replace everything inside `<article class="article-body">` with the real content.
- Supported, pre-styled elements: `h2`/`h3`, `p`, `ul`/`ol`, `blockquote`, `figure`/`figcaption`,
  and a `.article-lead` opener.
- Delete the visible `.editor-note` block once the article is published.
