import type { ParsedPage } from '../types';

export async function fetchAndParse(url: string): Promise<ParsedPage> {
  const proxyUrl = `/api/fetch?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch page (${response.status})`);
  }

  const html = await response.text();
  return parseHtml(html, url);
}

function parseHtml(html: string, url: string): ParsedPage {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const baseUrl = new URL(url);

  const title = doc.querySelector('title')?.textContent?.trim() ?? null;

  const metaDescription =
    doc
      .querySelector('meta[name="description"]')
      ?.getAttribute('content')
      ?.trim() ?? null;

  const canonical =
    doc.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() ??
    null;

  const metaRobots =
    doc.querySelector('meta[name="robots"]')?.getAttribute('content')?.trim() ??
    null;

  const ogTitle =
    doc
      .querySelector('meta[property="og:title"]')
      ?.getAttribute('content')
      ?.trim() ?? null;
  const ogDescription =
    doc
      .querySelector('meta[property="og:description"]')
      ?.getAttribute('content')
      ?.trim() ?? null;
  const ogImage =
    doc
      .querySelector('meta[property="og:image"]')
      ?.getAttribute('content')
      ?.trim() ?? null;

  const hiddenClasses = [
    'visually-hidden',
    'sr-only',
    'screen-reader-only',
    'hidden',
    'hide',
  ];

  const headings: ParsedPage['headings'] = [];
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    // Skip headings inside nav/footer (those are structural, not content)
    // Note: header is intentionally excluded — many sites (Framer, WordPress, etc.) put the page H1 inside <header>
    if (el.closest('nav, footer')) return;

    // Skip visually hidden headings
    const cls = el.getAttribute('class') ?? '';
    if (hiddenClasses.some((h) => cls.includes(h))) return;

    const level = parseInt(el.tagName[1]!, 10);
    const text = el.textContent?.trim() ?? '';
    if (text) {
      headings.push({ level, text });
    }
  });

  const images: ParsedPage['images'] = [];
  doc.querySelectorAll('img').forEach((el) => {
    const src = el.getAttribute('src') ?? '';
    const alt = el.getAttribute('alt');
    images.push({ src, alt });
  });

  const internalLinks: ParsedPage['internalLinks'] = [];
  const externalLinks: ParsedPage['externalLinks'] = [];
  doc.querySelectorAll('a[href]').forEach((el) => {
    const href = el.getAttribute('href') ?? '';
    const text = el.textContent?.trim() ?? '';
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return;
    }
    try {
      const linkUrl = new URL(href, url);
      if (linkUrl.hostname === baseUrl.hostname) {
        internalLinks.push({ href, text });
      } else {
        externalLinks.push({ href, text });
      }
    } catch {
      internalLinks.push({ href, text });
    }
  });

  const schemaMarkup: ParsedPage['schemaMarkup'] = [];
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
    const raw = el.textContent?.trim() ?? '';
    try {
      const parsed: unknown = JSON.parse(raw);
      const obj = parsed as Record<string, unknown>;

      // Handle @graph arrays (multiple schemas in one block)
      if (Array.isArray(obj['@graph'])) {
        for (const item of obj['@graph'] as Record<string, unknown>[]) {
          const type = String(item['@type'] ?? 'Unknown');
          schemaMarkup.push({ type, raw });
        }
      } else {
        const schemaType = obj['@type'] ?? 'Unknown';
        schemaMarkup.push({
          type: String(schemaType),
          raw,
        });
      }
    } catch {
      schemaMarkup.push({ type: 'Invalid JSON-LD', raw });
    }
  });

  const bodyEl = doc.querySelector('body');
  const clonedBody = bodyEl?.cloneNode(true) as HTMLElement | null;
  if (clonedBody) {
    clonedBody
      .querySelectorAll('script, style, nav, footer, header')
      .forEach((el) => el.remove());
  }
  const bodyText = clonedBody?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

  const paragraphs: string[] = [];
  (clonedBody ?? bodyEl)?.querySelectorAll('p').forEach((el) => {
    const text = el.textContent?.trim() ?? '';
    if (text.length > 10) {
      paragraphs.push(text);
    }
  });

  return {
    title,
    metaDescription,
    canonical,
    metaRobots,
    ogTitle,
    ogDescription,
    ogImage,
    headings,
    images,
    internalLinks,
    externalLinks,
    schemaMarkup,
    bodyText,
    paragraphs,
    url,
  };
}
