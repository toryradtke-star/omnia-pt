# Omnia Physical Therapy — Sanity Studio

Content Studio backing the Omnia Physical Therapy site. Split out from the
front-end so editors get a stable Studio deploy independent of site releases.

**Front-end:** `toryradtke-star/omnia-pt-web` · **Live site:** https://omniatherapies.com

## Stack

Sanity 5 · React 19 · TypeScript · styled-components

## Running it

```bash
npm install
npm run dev     # Studio at http://localhost:3333
```

The Studio `appId` and Sanity version are pinned deliberately — an unpinned
Studio picks up upstream changes on redeploy, which is the wrong tradeoff for a
client-facing editing surface.
