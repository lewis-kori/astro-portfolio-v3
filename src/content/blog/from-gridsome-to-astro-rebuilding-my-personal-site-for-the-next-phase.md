---
title: "From Gridsome to Astro: Rebuilding My Personal Site for the Next Phase"
author: Lewis Kori
description: "Why I migrated my personal site from Gridsome to Astro, moved from Netlify to Cloudflare, and open-sourced the entire codebase."
cover_image: https://res.cloudinary.com/lewiskori/image/upload/v1769197704/blog/Gemini_Generated_Image_1_cbfaby.png
dateCreated: 2026-01-23
tags: [astro, personal-website, performance, cloudflare, writing]
---

Six years ago, I rebuilt my personal website using Gridsome and Vue.js. At the time, it felt modern, fast, and perfectly aligned with how I wanted to publish technical writing.

That rebuild became this article:  
👉 *[Building my new site with Gridsome & Vue.js](/blog/building-my-new-site-with-gridsome-vue-js/)*

Fast forward to today, that same site still exists at **[v2.lewiskori.com](https://v2.lewiskori.com)**, but it had started to feel like a time capsule. The tooling had aged, the ecosystem had slowed down, and more importantly, my own work and interests had expanded far beyond what the site was originally designed to represent.

So I decided to rebuild again.  
This time with **[Astro](https://astro.build/)**, hosted on **[Cloudflare Pages](https://pages.cloudflare.com/)**, with a stronger content model, better performance, and a structure that reflects where I am today as an engineer and advisor.

This post is about why I made that move, what changed, and what I learned along the way.

---

## Why Move Away from Gridsome?

To be clear, Gridsome served me well. It gave me:

- Static site generation with Vue
- Markdown-based content
- A smooth authoring experience for the time

But today:

- The ecosystem is largely **inactive**
- Plugin maintenance has slowed significantly
- Modern web tooling has moved on

In short, it became **harder to evolve the site than to rebuild it**.

For a personal site that I actually want to use as a thinking space, that is not a good place to be.

---

## Why Astro Felt Like the Right Fit

Astro hit a very specific sweet spot for what I wanted:

- **Content-first architecture** (Markdown, MDX, collections)
- Minimal client-side JavaScript by default
- Framework-agnostic components when needed
- Excellent performance out of the box

But more than features, Astro feels aligned with how the web is trending again:  
static where possible, dynamic only where necessary.

That matches how I write and publish. Most of my content does not need hydration, interactivity, or heavy client logic.

It just needs to load instantly and read well.

---

## Multiple Themes: Light, Dark, and Sepia

One of the things I really wanted in this rebuild was **intentional reading modes**.

The new site supports:

- Light mode
- Dark mode
- Sepia mode (surprisingly great for long-form reading)

Theme preference is persisted, and switching is instant.

This seems like a small detail, but it changes how comfortable long sessions on the site feel, especially for essays and technical deep dives.

---

## A Broader Representation of My Work

Previously, the site was mostly:

- Blog posts
- A simple “About” section

That no longer reflects what I actually do.

The new structure includes:

- **[Advisory](/advisory)** – work with startups and private equity-backed firms
- **[Projects](/projects)** – long-running technical efforts and experiments
- **[Resources](/resources)** – books I am reading, tools I use, desk setup, and stack
- **[Operating Notes](/operating-notes)** – practical reflections on building companies and systems

This was intentional.

I wanted the site to capture not just what I build, but **how I think about building**.

---

## Better Content Discovery: Series and Tags

As my writing has improved, so has the structure of my content.

Now:

- Posts can belong to **series**
- Tags are actually useful for navigation
- Related content is easier to surface

This makes the site more usable for:

- New readers
- People landing from search
- Anyone following a specific topic

It also forces me to be more disciplined about how I publish.

---

## Moving from Netlify to Cloudflare Pages

This move was both practical and strategic.

### Practically:

- GitHub-based CI/CD is still there
- Builds are fast
- Edge delivery is excellent

### Strategically:

Cloudflare [has acquired Astro](https://astro.build/blog/joining-cloudflare/), which gives me far more confidence in:

- Long-term platform stability
- Investment in performance tooling
- Tight integration with edge services

It is rare to see hosting, CDN, and framework alignment at this level, and it made the decision straightforward.

---

## Performance: Actually, Genuinely Fast

Astro already helps here, but I was deliberate about:

- Zero unnecessary hydration
- Minimal client-side scripts
- Aggressive static generation

The result is a site that is, frankly, boring in how fast it loads. Which is exactly what I want.

The [Lighthouse test scores speak for themselves](https://pagespeed.web.dev/analysis/https-lewiskori-com/oaofktzutt?form_factor=mobile)

![Lighthouse performance results showing near-perfect mobile scores across performance, accessibility, best practices, and SEO](https://res.cloudinary.com/lewiskori/image/upload/fl_preserve_transparency/v1769158137/blog/Screenshot_2026-01-23_at_11.46.09_AM_uwos0a.jpg?_s=public-apps)

- Performance is consistently near perfect
- No layout shift
- Immediate content paint

This matters, not just for SEO, but for reading comfort.

---

## Newsletter Support with Beehiiv

Writing is something [I am taking seriously again](/blog/why-i-haven-t-blogged-in-years-and-how-i-m-overcoming-the-fear).

The new site integrates directly with [Beehiiv](https://www.beehiiv.com?via=Lewis-Kori) for newsletter subscriptions, which allows me to:

- Publish long-form essays
- Reach readers outside of social platforms
- Own the distribution channel

This also aligns with my decision over the last year to step away from algorithm-driven platforms and focus on slower, more intentional publishing.

---

## Open Sourcing the Entire Codebase

This part matters to me.

The full site is now open source.

Not because the code is groundbreaking, but because:

- Personal sites are great learning material
- People often ask how certain layouts or systems work
- Transparency aligns with how I learned early in my career

If something in the site helps another developer ship their own, that is a win.

The [Open Source Code is available on my Github](https://github.com/lewis-kori/astro-portfolio-v3)

And a special thank you to [Evans Robbie ](https://github.com/EvansRobbie)for all the help with the frontend styling.

---

## What This Rebuild Actually Represents

On the surface, this is a framework migration.

In reality, it reflects something deeper:

- I write differently now
- I work across engineering, business, and strategy
- I care more about clarity than cleverness

This site is not just a portfolio anymore.  
It is an operating system for how I think, learn, and share.

Astro just happened to be the best tool to support that.

---

## What’s Next

Now that the foundation feels solid, the focus shifts to:

- Writing more consistently
- Publishing deeper technical and business essays
- Sharing practical experiences from advisory and operating work

The stack is finally out of the way.

Now the real work, the thinking and the writing, can take center stage again.

---

If you are curious, the previous version of the site still lives here:  
👉 **https://v2.lewiskori.com**

And the new one is live at:  
👉 **https://lewiskori.com**

Here is to rebuilding, again, but this time with much clearer intent.
