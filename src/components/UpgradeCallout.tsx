import type { SectionResult } from '../types';

interface UpgradeCalloutProps {
  sections?: SectionResult[];
}

function getContextualBullets(sections: SectionResult[]): string[] {
  const bullets: string[] = [];

  const aiSection = sections.find((s) => s.name === 'AI & Search Readiness');
  const faqCheck = aiSection?.checks.find(
    (c) => c.label === 'FAQ-style content',
  );

  const structureSection = sections.find((s) => s.name === 'Content Structure');
  const contentChecks = structureSection?.checks ?? [];
  const hasStructureIssues = contentChecks.some(
    (c) => c.status === 'needs-work' || c.status === 'missing',
  );

  if (faqCheck?.status !== 'good') {
    bullets.push(
      'AI identifies missing questions your audience is searching for',
    );
  }

  if (hasStructureIssues) {
    bullets.push(
      'Detailed AI analysis with specific, actionable recommendations',
    );
  }

  bullets.push('Score your pages against your top competitors');
  bullets.push('Manage multi-page projects and export branded PDF reports');

  return bullets.slice(0, 4);
}

export function UpgradeCallout({ sections }: UpgradeCalloutProps) {
  const hasResults = sections && sections.length > 0;
  const bullets = hasResults ? getContextualBullets(sections) : [];

  return (
    <div className="rounded-xl border border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100 p-6 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-stone-900">
        {hasResults
          ? 'Want to fix these issues faster?'
          : 'Want deeper analysis?'}
      </h3>

      {hasResults && bullets.length > 0 ? (
        <ul className="mx-auto mt-3 max-w-md space-y-2 text-left text-sm text-stone-600">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-0.5 text-stone-400">+</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">
          Content Checker Pro uses AI to analyse your content, identify missing
          questions, and score your pages against competitors — with branded PDF
          reports.
        </p>
      )}

      <a
        href="https://tiongcreative.com.au/content-checker-pro/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-stone-800"
      >
        Content Checker Pro —{' '}
        <span className="line-through opacity-60">$99</span> $49 AUD
      </a>
      <p className="mt-2 text-xs text-stone-400">
        Half price launch offer — ends July 2026. One-time purchase, no
        subscription.
      </p>
    </div>
  );
}
