import type { SectionResult } from '../types';
import { OverallScore } from './OverallScore';
import { ScoreCard } from './ScoreCard';
import { UpgradeCallout } from './UpgradeCallout';

interface ResultsPanelProps {
  sections: SectionResult[];
  url: string;
  pageTitle: string | null;
}

export function ResultsPanel({ sections, url, pageTitle }: ResultsPanelProps) {
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
