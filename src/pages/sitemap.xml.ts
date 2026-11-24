import type { APIRoute } from 'astro';

// Liste automatiquement les pages .astro de src/pages (index.astro → /, foo.astro → /foo/).
const paths = Object.keys(import.meta.glob('./**/*.astro')).map((f) =>
  f.replace(/^\.\//, '/').replace(/index\.astro$/, '').replace(/\.astro$/, '/'),
);

export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
      .map((p) => `  <url><loc>${new URL(p, site)}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
