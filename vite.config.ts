import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'dev-fetch-proxy',
      configureServer(server) {
        server.middlewares.use('/api/fetch', async (req, res) => {
          const url = new URL(req.url ?? '', 'http://localhost');
          const targetUrl = url.searchParams.get('url');

          if (!targetUrl) {
            res.statusCode = 400;
            res.end('Missing "url" parameter');
            return;
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

            const html = await response.text();
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(html);
          } catch (err) {
            res.statusCode = 502;
            const message =
              err instanceof Error ? err.message : 'Failed to fetch';
            res.end(`Could not fetch the page: ${message}`);
          }
        });
      },
    },
  ],
});
