import type { ParsedPage, SectionResult } from '../types';
import { OverallScore } from './OverallScore';
import { ScoreCard } from './ScoreCard';
import { UpgradeCallout } from './UpgradeCallout';

interface ResultsPanelProps {
  sections: SectionResult[];
  url: string;
  pageTitle: string | null;
  pageInfo: Pick<
    ParsedPage,
    | 'title'
    | 'metaDescription'
    | 'canonical'
    | 'ogTitle'
    | 'ogDescription'
    | 'ogImage'
  > | null;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + '...';
}

export function ResultsPanel({
  sections,
  url,
  pageTitle,
  pageInfo,
}: ResultsPanelProps) {
  return (
    <div className="mx-auto mt-6 max-w-2xl">
      <div className="mb-2 text-center">
        <p className="text-sm text-stone-500">
          Results for{' '}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-stone-700 underline"
          >
            {pageTitle ?? url}
          </a>
        </p>
      </div>

      {pageInfo && (
        <div className="mt-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-medium tracking-wide text-stone-400 uppercase">
            Page snapshot
          </h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="font-medium text-stone-700">Title</dt>
              <dd className="text-stone-500">
                {pageInfo.title ?? (
                  <span className="text-red-400 italic">Not set</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-stone-700">Meta description</dt>
              <dd className="text-stone-500">
                {pageInfo.metaDescription ? (
                  truncate(pageInfo.metaDescription, 160)
                ) : (
                  <span className="text-red-400 italic">Not set</span>
                )}
              </dd>
            </div>
            <div className="flex gap-6">
              <div>
                <dt className="font-medium text-stone-700">Canonical</dt>
                <dd className="text-stone-500">
                  {pageInfo.canonical ? (
                    truncate(pageInfo.canonical, 60)
                  ) : (
                    <span className="text-amber-500 italic">Not set</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-stone-700">Open Graph</dt>
                <dd className="text-stone-500">
                  {[
                    pageInfo.ogTitle && 'title',
                    pageInfo.ogDescription && 'description',
                    pageInfo.ogImage && 'image',
                  ]
                    .filter(Boolean)
                    .join(', ') || (
                    <span className="text-amber-500 italic">Not set</span>
                  )}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      )}

      <OverallScore sections={sections} />

      <div className="mt-6 space-y-4">
        {sections.map((section) => (
          <ScoreCard key={section.name} section={section} />
        ))}
      </div>

      <div className="mt-8">
        <UpgradeCallout sections={sections} />
      </div>

      <footer className="mt-8 pb-8 text-center text-sm text-stone-500">
        <p>
          Content Checker analyses publicly visible HTML. Results are based on
          rule-based checks, not AI.
        </p>
        <p className="mt-2 text-xs text-stone-400">
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://www.davidtiong.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-stone-500"
          >
            David Tiong
          </a>
        </p>
      </footer>
    </div>
  );
}
