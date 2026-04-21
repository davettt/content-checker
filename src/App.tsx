import { useState } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { ResultsPanel } from './components/ResultsPanel';
import { UpgradeCallout } from './components/UpgradeCallout';
import { fetchAndParse } from './services/fetchPage';
import { analyseAll } from './services/analyser';
import type { SectionResult } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<SectionResult[] | null>(null);
  const [checkedUrl, setCheckedUrl] = useState('');
  const [pageTitle, setPageTitle] = useState<string | null>(null);

  async function handleCheck(url: string) {
    setLoading(true);
    setError(null);
    setSections(null);

    try {
      const page = await fetchAndParse(url);
      const results = analyseAll(page);
      setSections(results);
      setCheckedUrl(url);
      setPageTitle(page.title);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please check the URL and try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-12">
      <Header />
      <UrlInput onSubmit={handleCheck} loading={loading} />

      {error && (
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {sections && (
        <ResultsPanel
          sections={sections}
          url={checkedUrl}
          pageTitle={pageTitle}
        />
      )}

      {!sections && !loading && !error && (
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-white p-4 text-center">
              <p className="text-2xl">19</p>
              <p className="mt-1 text-xs text-stone-500">Content checks</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-4 text-center">
              <p className="text-2xl">5</p>
              <p className="mt-1 text-xs text-stone-500">Categories</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-4 text-center">
              <p className="text-2xl">Free</p>
              <p className="mt-1 text-xs text-stone-500">No signup needed</p>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-stone-500">
            <p>
              Checks your page title, meta tags, headings, images, links, schema
              markup, and AI search readiness. All analysis runs in your browser
              — no data is stored.
            </p>
          </div>

          <div className="mt-12">
            <UpgradeCallout />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
