import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/config';

export const prerender = true;

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };

    return entities[character];
  });

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site ?? new URL(siteConfig.url)).toString().replace(/\/$/, '');
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.dateCreated.getTime() - a.data.dateCreated.getTime(),
  );
  const mostRecentDate = posts.reduce(
    (latest, post) => {
      const postDate = post.data.dateModified ?? post.data.dateCreated;
      return postDate > latest ? postDate : latest;
    },
    new Date(0),
  );

  const items = posts
    .map((post) => {
      const slug = post.id.replace(/\.(md|mdx)$/, '');
      const localUrl = `${baseUrl}/blog/${slug}/`;
      const canonicalUrl = post.data.canonical_url ?? localUrl;

      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(canonicalUrl)}</link>
      <guid isPermaLink="true">${escapeXml(canonicalUrl)}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${post.data.dateCreated.toUTCString()}</pubDate>
      <dc:creator>${escapeXml(post.data.author)}</dc:creator>
      ${post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Articles</title>
    <link>${baseUrl}/blog/</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${mostRecentDate.toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
