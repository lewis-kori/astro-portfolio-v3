# Updating photography and travel journals

Trips now use the same content-collection approach as the blog. Each journal is an MDX file in `src/content/photoJournals/`. MDX lets you write ordinary Markdown and insert photo grids, individual photographs, or videos between any paragraphs.

Collection-level titles and covers remain in `src/data/photography.ts`. Loose photostream images also live there.

## Add a journal

Duplicate an existing `.mdx` file and change its filename. The filename becomes the final URL segment. For example:

```text
src/content/photoJournals/tokyo-at-night.mdx
→ /photography/asia/tokyo-at-night
```

Every file begins with frontmatter:

```yaml
---
title: Tokyo at Night
subtitle: Neon, quiet corners and the last train home.
description: A night photography journal from Tokyo.
collection: asia
place: Tokyo, Japan
days: 5
nights: 4
startDate: 2026-04-02
endDate: 2026-04-07
dateModified: 2026-04-10
author: Lewis Kori
tags: [Tokyo, Japan, Asia, Night Photography]
cover:
  src: /photography/asia/tokyo/cover.webp
  alt: Tokyo street glowing at night
  location: Tokyo, Japan
  camera: DJI Osmo Pocket 4P
  lens: Built-in wide camera
  aspect: wide
galleryImages:
  - /photography/asia/tokyo/frame-01.webp
  - /photography/asia/tokyo/frame-02.webp
seoTitle: Tokyo Night Photography Journal – Lewis Kori
seoDescription: Photographs and field notes from five nights in Tokyo.
canonicalUrl: https://lewiskori.com/photography/asia/tokyo-at-night
noindex: false
---
```

`startDate` and `endDate` are optional:

- Omit both for an undated placeholder.
- Use only `startDate` for a single-day or open-ended entry.
- Use both for a date range.
- Use `dateLabel` when you want text such as `Coming soon` or `Summer notes`.

Set `noindex: true` while a placeholder should stay out of search results.

## Write between images

After the frontmatter and component imports, write normal Markdown:

```mdx
import PhotoGrid from '@/components/photography/PhotoGrid.astro';
import JournalPhoto from '@/components/photography/JournalPhoto.astro';
import JournalVideo from '@/components/photography/JournalVideo.astro';

Opening paragraph for the journal.

## The first morning

Write as many paragraphs, lists, links and headings as you need.

<PhotoGrid photos={[/* photos */]} />

Continue writing directly below the gallery.
```

## Create a mosaic grid

The mosaic layout recreates the uneven two-column editorial grid from the reference screenshot. It alternates 7/5 and 5/7 column widths while preserving a clean shared baseline.

```mdx
<PhotoGrid
  layout="mosaic"
  caption="An afternoon by the water."
  photos={[
    {
      src: '/photography/zanzibar/beach-01.webp',
      alt: 'A small crab beneath a beach chair',
      title: 'Beach companion',
      takenAt: 'August 9, 2026',
      camera: 'DJI Osmo Pocket 4P',
      lens: 'Built-in wide camera',
      location: 'Zanzibar, Tanzania',
    },
    {
      src: '/photography/zanzibar/drink-01.webp',
      alt: 'A cold drink beside the beach',
      camera: 'Google Pixel 9',
      lens: 'Main wide camera',
      location: 'Zanzibar, Tanzania',
    },
    // Add as many photos as you need.
  ]}
/>
```

Use `layout="equal"` when every image should occupy the same width.

## Add one image

```mdx
<JournalPhoto
  width="wide"
  src="/photography/zanzibar/sunset.webp"
  alt="Sunset over the Indian Ocean"
  caption="The final light of the day."
  takenAt="August 9, 2026"
  camera="DJI Osmo Pocket 4P"
  lens="Built-in wide camera"
  location="Zanzibar, Tanzania"
  aspect="wide"
/>
```

`width` accepts `content`, `wide`, or `full`.

## Add video

Place MP4 or WebM files under `public/photography/` and use:

```mdx
<JournalVideo
  src="/photography/zanzibar/stone-town-walk.mp4"
  poster="/photography/zanzibar/stone-town-walk-poster.webp"
  title="Walking through Stone Town"
  caption="A short film made with the DJI Osmo Pocket 4P."
/>
```

## SEO controls

Each journal supports:

- Custom page title and meta description
- Canonical URL
- Open Graph and Twitter preview image
- Author, tags, published and modified dates
- Optional `noindex`
- Breadcrumb structured data
- `BlogPosting` structured data
- `ImageGallery` structured data generated from `galleryImages`
- Location-aware schema through `place`

Only include real, visible images in `galleryImages`. Placeholder journals should remain `noindex: true` until their content is ready.

## Viewer controls

Every `JournalPhoto` and every image inside `PhotoGrid` automatically joins the page viewer. Visitors can use previous/next buttons, keyboard arrow keys, or horizontal touch gestures. Photo metadata appears in the collapsible overlay.
