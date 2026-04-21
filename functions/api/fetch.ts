type Env = Record<string, unknown>;

const BLOCKED_PATTERNS = [
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /localhost/i,
];

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count++;
  return entry.count > 10;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const clientIp = context.request.headers.get('cf-connecting-ip') ?? 'unknown';

  if (isRateLimited(clientIp)) {
    return new Response('Rate limited. Try again in a minute.', {
      status: 429,
    });
  }

  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing "url" parameter', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return new Response('Only HTTP/HTTPS URLs are allowed', { status: 400 });
  }

  if (BLOCKED_PATTERNS.some((p) => p.test(parsed.hostname))) {
    return new Response('Private/local URLs are not allowed', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ContentChecker/1.0; +https://contentchecker.davidtiong.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html') && !contentType.includes('xhtml')) {
      return new Response('URL did not return HTML content', { status: 400 });
    }

    const html = await response.text();

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch URL';
    return new Response(`Could not fetch the page: ${message}`, {
      status: 502,
    });
  }
};
