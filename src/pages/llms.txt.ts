import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/config';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ?? new URL(siteConfig.url)).toString().replace(/\/$/, '');
  const recentPosts = (await getCollection('blog'))
    .sort((a, b) => b.data.dateCreated.getTime() - a.data.dateCreated.getTime())
    .slice(0, 10);

  const articles = recentPosts
    .map((post) => {
      const slug = post.id.replace(/\.(md|mdx)$/, '');
      const url = post.data.canonical_url ?? `${baseUrl}/blog/${slug}/`;
      return `- [${post.data.title}](${url}): ${post.data.description}`;
    })
    .join('\n');

  const text = `# Lewis Kori

> ${siteConfig.description}

Lewis Kori is a software engineer, product builder and business operator based in Nairobi, Kenya. He writes from first-hand experience building digital products, leading technical work, advising founders and operating technology businesses for an international audience.

## Core pages

- [About](${baseUrl}/about/): Background, working principles and areas of expertise.
- [Projects](${baseUrl}/projects/): Products, platforms and ventures Lewis has helped build.
- [Advisory](${baseUrl}/advisory/): Product, technology and business advisory work.
- [Operating Notes](${baseUrl}/operating-notes/): Principles for building and operating durable companies.
- [Articles](${baseUrl}/blog/): Writing about software engineering, product development, AI and company building.
- [Photography](${baseUrl}/photography/): Travel journals and visual stories.

## Recent writing

${articles}

## Feeds and contact

- [RSS feed](${baseUrl}/rss.xml)
- [Contact](${baseUrl}/contact/)
- [GitHub](https://github.com/lewis-kori)
- [LinkedIn](https://linkedin.com/in/lewis-kihiu-aba63011b/)
`;

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
