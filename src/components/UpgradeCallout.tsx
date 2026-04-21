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
  const schemaCheck = aiSection?.checks.find(
    (c) => c.label === 'Schema markup',
  );

  const structureSection = sections.find((s) => s.name === 'Content Structure');
  const contentChecks = structureSection?.checks ?? [];
  const hasStructureIssues = contentChecks.some(
    (c) => c.status === 'needs-work' || c.status === 'missing',
  );

  const imageSection = sections.find((s) => s.name === 'Images');
  const altCheck = imageSection?.checks.find(
    (c) => c.label === 'Alt text coverage',
  );

  if (faqCheck?.status !== 'good') {
    bullets.push(
      'Auto-generate FAQ sections that AI search engines love to cite',
    );
  }

  if (schemaCheck?.status !== 'good') {
    bullets.push(
      'Get ready-to-use schema markup code for your specific page type',
    );
  }

  if (hasStructureIssues) {
    bullets.push(
      'AI-powered content rewrite that improves your heading structure and clarity',
    );
  }

  if (altCheck?.status !== 'good') {
    bullets.push(
      'Smart alt text suggestions based on your actual image context',
    );
  }

  bullets.push('Score your pages against your top competitors');
  bullets.push('Check up to 10 pages at once across your whole site');

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
          Content Checker Pro uses AI to rewrite your content, generate FAQs,
          suggest schema markup, and score your pages against competitors.
        </p>
      )}

      <div className="mt-5 inline-block rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-sm">
        Content Checker Pro — Coming Soon
      </div>
      <p className="mt-2 text-xs text-stone-400">
        One-time purchase. No subscription. Bring your own AI key.
      </p>
    </div>
  );
}
