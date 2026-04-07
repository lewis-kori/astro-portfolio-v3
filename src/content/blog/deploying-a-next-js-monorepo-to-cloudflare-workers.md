---

title: "Deploying a Next.js Monorepo to Cloudflare Workers: Lessons from the Trenches"
author: Lewis Kori
tags: ["nextjs", "cloudflare", "monorepo", "nx", "deployment", "workers", "edge computing", "devops"]
description: A real-world walkthrough of migrating a multi-app Next.js monorepo from Firebase Hosting to Cloudflare Workers. Why we did it, the gotchas nobody warned us about, and whether it was worth it.
dateCreated: 2026-04-07
sponsors: ["Scraper API"]
---

Earlier this year, I migrated my [personal site from Netlify to Cloudflare Pages](/blog/from-gridsome-to-astro-rebuilding-my-personal-site-for-the-next-phase/). The experience was smooth enough to get me thinking about what Cloudflare could do for a more demanding workload.

A real production monorepo. Multiple Next.js apps. Shared packages. Real users.

A few months later, that project is running entirely on Cloudflare Workers.

This post is the story of how we got there.

---

## The Setup

The monorepo contains three Next.js 16 apps and a set of shared packages, all managed with **Nx 22** and **pnpm workspaces**. Shared code, such as components, utilities, types, hooks, and config, lives in `packages/` and is consumed by each app via TypeScript path aliases.

The apps range from a lightweight customer-facing site to a heavier dashboard with auth middleware, i18n, and Sentry.

We were deployed on **Firebase Hosting** with Cloud Functions and a custom GitHub Actions pipeline.

It worked.
Until it didn’t.

---

## Why We Left Firebase

This was not a single decision. It was a slow accumulation of friction.

### The CI/CD pipeline became a liability

We built a fairly complex GitHub Actions workflow to build and deploy each app independently of the monorepo. Over time, it became fragile. Deploys were flaky. Build ordering introduced hidden dependencies. Silent failures made debugging painful.

At some point, the pipeline stopped feeling like infrastructure and started feeling like something we had to constantly babysit.

And it was quietly burning through our GitHub Actions minutes.

### Firebase's Next.js support had not kept up

Firebase Hosting’s native Next.js integration works reasonably well for older versions of the framework, but [support for newer App Router features, React Server Components, and server actions is limited](https://firebase.google.com/docs/hosting/frameworks/nextjs).

Every time we wanted to use something up to date, we had to check whether Firebase could handle it.

Usually, the answer was *sort of, with caveats*.

That is not a position you want to be in.

#### Cost unpredictability

Firebase pricing scales with function invocations, bandwidth, and compute. It is predictable at low traffic, but becomes harder to reason about as you grow.

For SSR workloads, it adds up faster than expected.

When I rebuilt [my personal site](https://lewiskori.com/) on **Cloudflare Pages**, I got a glimpse of a simpler model.

Git-integrated builds.
Instant global propagation.
No operational overhead.

It felt calm.

I wanted that for production.

The real question was: could Cloudflare Workers handle a full SSR monorepo?

---

## Enter @opennextjs/cloudflare

The piece that makes Next.js on Cloudflare Workers possible is [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

It takes a Next.js build output and adapts it to run as a Cloudflare Worker.

The config is minimal:

```typescript
// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

Most of the real configuration lives in `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "my-app",
  "compatibility_date": "2025-04-01",
  "compatibility_flags": [
    "nodejs_compat",
    "global_fetch_strictly_public"
  ],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "my-app"
    }
  ],
  "limits": {
    "cpu_ms": 30000
  },
  "vars": {
    "NEXT_BASE_URL": "https://api.example.com"
  }
}
```

Deploying from the monorepo root looks like this:

```bash
cd apps/my-app && npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy
```

We wrapped this in a `Makefile`, so the commands stay short and consistent across all apps.

---

## Protecting Preview Deployments with Cloudflare Access

One of the easiest wins in this migration was using **[Cloudflare Zero Trust Access](https://www.cloudflare.com/products/zero-trust/access/)** to protect non-production environments.

Previously, staging URLs were open to anyone who found them.

Not a disaster.
But not ideal.

With Cloudflare Access, you can gate any deployment behind identity. Email OTP, Google, GitHub, or any OIDC-compatible provider. No code changes required.

It sits in front of your Worker at the network level.

For us, staging environments now require authentication. Everyone else hits a login wall.

Setup took about ten minutes.

This is one of those features you do not realise you needed until you have it.

If you have not looked at Zero Trust Access for protecting internal tools or preview environments, it is worth a look. The free plan covers up to 50 users.

---

## The Gotchas Nobody Warns You About

Every migration has sharp edges. These are the ones that cost us the most time.

### 1. `compatibility_date` and `process.env`

We centralise environment variable handling through a Zod schema that calls `envSchema.parse(process.env)` at startup.

On Cloudflare Workers, variables set in `wrangler.jsonc` or through the CLI do not automatically appear in `process.env` unless your `compatibility_date` is `2025-04-01` or later.

Before that date, the `nodejs_compat_populate_process_env` flag is not auto-enabled, and `process.env` is effectively empty at runtime. Your app boots, Zod parses an empty object, and everything breaks in a way that is not immediately obvious.

Set your `compatibility_date` to `2025-04-01` or higher from the start.

### 2. No `export const runtime = 'edge'`

If you have `export const runtime = 'edge'` in any route files, remove it.

`@opennextjs/cloudflare` does not support the edge runtime directive. The adapter handles the runtime itself.

### 3. Middleware cannot use `cookies()` from `next/headers`

The `cookies()` API from `next/headers` is Node.js only. If you are using it in `middleware.ts` for auth or session handling, it will not work on Workers.

Use `req.cookies` from `NextRequest` instead:

```typescript
// Works on Workers
export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
}

// Node.js only. Won't work in Workers middleware
import { cookies } from 'next/headers';
```

This is easy to miss because `next dev` runs fine locally. The break only surfaces when you run the actual Workers preview.

### 4. The 3 MiB free plan limit

Cloudflare’s free plan has a 3 MiB gzip limit per worker. For simple apps, this is fine. For anything with heavy dependencies such as Sentry server-side, complex auth libraries, or i18n, you will likely hit it.

The paid plan at $5 per month raises the limit to 10 MiB.

For apps close to the boundary, audit your server-side bundle. For us, Sentry server instrumentation was the biggest contributor. We stripped it from the lighter apps and kept only client-side Sentry there. The heavier dashboard stays on the paid plan.

---

## Environment Variables and Secrets

Cloudflare has a clear [three-tier model for environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/), and it is worth understanding before you start:

| Type            | How to set                       | When available                                      |
| --------------- | -------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_*` | `.env` file                      | Build time. Inlined into client bundles             |
| Regular vars    | `vars` block in `wrangler.jsonc` | Runtime. Accessible via `process.env` on the server |
| Secrets         | `wrangler secret put` CLI        | Runtime. Encrypted, accessible via `process.env`    |
| Local dev vars  | `.dev.vars` file (gitignored)    | Local development only                              |

For local development, create a `.dev.vars` file in each app directory:

```bash
# apps/my-app/.dev.vars
NEXTJS_ENV=development
NEXT_BASE_URL=https://staging.api.example.com
APP_API_KEY=your-dev-key-here
```

Wrangler reads this automatically during `wrangler dev` and `wrangler preview`. Add `.dev.vars*` to your `.gitignore` so staging variants are covered too.

Secrets for production:

```bash
cd apps/my-app
npx wrangler secret put APP_API_KEY
npx wrangler secret put APP_API_KEY --env staging
```

One thing we had to fix during the migration was our env schema. It had hardcoded `.default()` values for several secrets, leftovers from earlier development. We removed those and made optional secrets actually optional in Zod, with runtime guards in the server actions that use them:

```typescript
export async function someAction() {
  const apiKey = env.APP_API_KEY;
  if (!apiKey) {
    return { error: 'APP_API_KEY is not configured' };
  }
  // ...
}
```

---

## Setting Up Staging Environments

This part tripped us up more than expected.

Cloudflare Workers Builds, their git-integrated CI/CD, creates preview URLs for non-production branches. The catch is that preview URLs share the same environment variables as production. There is no way to override them per preview.

So if your staging environment points to a different backend, preview URLs are not enough.

The solution is [wrangler environments](https://developers.cloudflare.com/workers/wrangler/environments/). Add an `env.staging` block to your `wrangler.jsonc`:

```jsonc
{
  "name": "my-app",
  "vars": {
    "NEXT_BASE_URL": "https://api.example.com"
  },
  "env": {
    "staging": {
      "vars": {
        "NEXT_BASE_URL": "https://staging.api.example.com"
      },
      "services": [
        {
          "binding": "WORKER_SELF_REFERENCE",
          "service": "my-app-staging"
        }
      ]
    }
  }
}
```

This creates a separate `my-app-staging` worker.

Important: `vars` and `services` are non-inheritable keys in Wrangler. They do not cascade from the top-level config into your environments. You must fully specify them in each `env` block, or the staging worker starts with empty vars.

Deploying to staging:

```bash
cd apps/my-app && npx opennextjs-cloudflare build && npx wrangler deploy --env staging
```

For automated staging builds via the Cloudflare dashboard, connect the same repo to both the production and staging workers, with different deploy commands:

* **Production worker**: `npx wrangler deploy`, watching your `main` branch
* **Staging worker**: `npx wrangler deploy --env staging`, watching your staging branch

In monorepo setups, also set the **root directory** to the app’s folder and configure build watch paths to include `packages/**` so builds only trigger when relevant files change.

---

## Cost Breakdown

| Resource                          | Monthly cost |
| --------------------------------- | ------------ |
| Small apps on free plan           | $0           |
| Dashboard app on Workers Paid     | $5           |
| Custom domains via Cloudflare DNS | $0           |
| **Total**                         | **$5**       |

The free plan covers 100,000 requests per day, which is plenty for most apps. The paid plan gives you 10 million requests per month and the 10 MiB bundle limit the heavier dashboard needed.

For comparison, Vercel teams start at $20 per user per month. Firebase Cloud Functions pricing scales in ways that are harder to predict. At $5 per month for global edge delivery across all our apps, we are satisfied with where we landed.

---

## Was It Worth It?

Yes. Unreservedly.

The deployment pipeline went from a custom, increasingly brittle GitHub Actions setup that chewed through CI minutes to a first-class, git-integrated workflow that just works.

Push to `main`, and the production worker updates. No YAML archaeology required.

Firebase’s Next.js limitations are gone. We can use anything current in Next.js 16 without checking whether the hosting layer can keep up.

The performance is genuinely better. Running at the edge in 300+ locations means users in Nairobi, Paris, and São Paulo all get fast responses, not just the ones nearest to a data centre we picked.

And the Cloudflare ecosystem is increasingly coherent. Workers, Pages, Access, DNS, R2. They work together in a way that makes the platform feel like an actual platform rather than a collection of services.

After running my personal site there for several months, and now production workloads, I have become a genuine believer.

If you are running a Next.js monorepo and your Firebase or Vercel setup is starting to feel like a liability, Cloudflare Workers is worth a serious look.

---

## What We’re Looking Forward To: The Next.js Adapter API

One thing I am genuinely excited about as a next step is the official [Next.js Adapter API](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath), which shipped as stable in Next.js 16.2.

For a long time, deploying Next.js anywhere other than Vercel meant reverse-engineering the build output. `@opennextjs/cloudflare` was essentially a sophisticated workaround. It worked, but it was always playing catch-up with new framework features.

The Adapter API changes that.

It gives every platform the same contract: a typed, versioned description of the application, including routes, prerenders, static assets, runtime targets, and caching rules, that an adapter can consume and map onto its own infrastructure.

Crucially, Vercel’s own adapter is built on this same public API. No private hooks. No undocumented behaviour.

The [Next.js Across Platforms blog post](https://nextjs.org/blog/nextjs-across-platforms) is worth reading for the broader context.

For Cloudflare specifically, a verified adapter built on this API is already in active development. Once it ships, the `@opennextjs/cloudflare` integration will sit on a stable, tested foundation that evolves with Next.js rather than chasing it.

For developers, that means first-class Next.js features such as Partial Prerendering, Cache Components, and on-demand revalidation should eventually work consistently on Cloudflare Workers, with documentation and testing upstream.

We are already on the platform. When the official adapter lands, migrating to it should be straightforward.
