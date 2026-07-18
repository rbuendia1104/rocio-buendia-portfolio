# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static one-page marketing/portfolio site for Rocío Luz Buendía Sulca (environmental chemical engineer). Plain HTML/CSS/vanilla JS — no framework, no build step, no package.json. Deployed on Vercel via GitHub, auto-redeploying on every push to `main`.

- Live site: https://rocio-buendia-portfolio.vercel.app
- Repo: https://github.com/rbuendia1104/rocio-buendia-portfolio
- Intended custom domain (not yet connected): rociobuendia.com

## Commands

There is no build/lint/test tooling — edit the files directly and reload the browser.

**Local dev server** (needed because opening `index.html` via `file://` does not load the CSS/JS correctly in some browsers/tools):
```
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```
Serves the current directory at `http://localhost:8974/`. It's a minimal `HttpListener` static file server (see `serve.ps1`) — it does **not** support HTTP Range requests, so `<video>` scrubbing/preload won't work locally even though it works fine once deployed on Vercel.

**Deploy**: `git push origin main` — Vercel auto-deploys from GitHub on every push. There is no separate deploy command.

## Architecture

**Single page, single HTML file.** All content lives in `index.html` as stacked `<section>` elements (`#top` hero, `#sobre-mi`, `#galeria`, `#servicios`, `#naturaleza`, `#contacto`), plus two standalone `.water-divider` decorative bands and a fixed-position `#assistant` widget appended after `<footer>`. Sections alternate `class="section"` / `class="section section--tint"` for background rhythm — keep that alternation when adding/removing sections.

**Three independent vanilla-JS files, loaded in order, each self-guarding with `if (!el) return`:**
- `js/script.js` — footer year, mobile nav toggle, and the scroll-reveal `IntersectionObserver` that drives the `.reveal` → `.reveal.is-visible` fade-in used throughout the page.
- `js/assistant.js` — "Rochi", a client-side-only FAQ chatbot (no API calls). Keyword-matches user input against a `KB` array (accent-stripped via `String.normalize('NFD')`) and returns a canned HTML answer, or a WhatsApp/email fallback if nothing scores above zero. To add an FAQ entry, add `{keywords: [...], answer: '...'}` to `KB`.
- `js/contact-form.js` — contact form submit handler. `ENDPOINT` is currently an **empty string by design**: until it's set to a deployed Google Apps Script `/exec` URL, submitting shows a "not connected yet" message instead of erroring. See "Contact form backend" below before wiring this up.

**Inline SVG, not raster images, for all decorative graphics** (mountains/river/fish illustrations in `#naturaleza`, the water-drop divider). Shared `<defs>` (gradients, blur filters, the `#waterDrop` symbol) live in a hidden `<svg>` right after `<body>` — reuse those defs rather than redefining gradients per-illustration. A `feTurbulence` noise filter was deliberately removed from these illustrations after it caused the preview browser to hang; don't reintroduce heavy SVG filters without checking render cost.

**Color system**: all colors are CSS custom properties on `:root` in `css/styles.css` (`--navy-*`, `--blue-*`, `--sky-100`, `--yellow-*`, `--water-*`, `--emerald-*` for the assistant widget specifically). A dark-mode override block re-defines the same variable names under `@media (prefers-color-scheme: dark)`. When restyling, change the variable values, not individual component rules.

**Real photos**, not stock/generated images: `img/rocio.jpg` (profile) and `img/galeria/*.jpg` (13 field photos) were extracted from client-provided Word docs and resized/compressed. `video/agua-de-reuso.mp4` is a real client video. Don't replace these with placeholders.

## Contact form backend (Google Apps Script)

There is intentionally no third-party form service (FormSubmit was tried and removed) and no public database — the client only asked for a write-only path, never a readable one. The design is documented in full inside `google-apps-script.gs` (copy-paste target for Google Sheets → Extensions → Apps Script → deploy as Web App): each submission appends a row to a private Google Sheet the client owns, then emails her the **entire updated contact table** (not just the new row) via `MailApp`. To activate: get the deployed `/exec` URL from the client and paste it into `ENDPOINT` in `js/contact-form.js`.

## Rebuilding the Claude Artifact (single-file mirror)

This project is also published as a self-contained Claude Artifact for quick sharing — a single HTML file with CSS/JS inlined and images (except the video, which is too large) embedded as base64 data URIs. It is **not auto-synced**; after any change to `index.html`/`css/styles.css`/`js/*.js`, it must be rebuilt manually via a PowerShell script that:
1. Strips `<!DOCTYPE>`/`<html>`/`<head>`/`<body>` tags from `index.html`.
2. Inlines `css/styles.css` into a `<style>` block and each `js/*.js` file into `<script>` blocks.
3. Base64-inlines every `img/**/*.{jpg,png}` reference (video is swapped for a text note instead, since ~4MB base64 is too much for a single-file artifact).

No Node/npm/pandoc/LibreOffice is available in this environment — this inlining is done with `System.IO.File` + `[Convert]::ToBase64String` in PowerShell, not a JS bundler.
