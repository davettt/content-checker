import { useState } from 'react';
import type { SectionResult } from '../types';
import { StatusBadge } from './StatusBadge';

const sectionIcons: Record<string, string> = {
  eye: '\uD83D\uDC41\uFE0F',
  layout: '\uD83D\uDCCB',
  image: '\uD83D\uDDBC\uFE0F',
  link: '\uD83D\uDD17',
  sparkles: '\u2728',
};

interface ScoreCardProps {
  section: SectionResult;
}

export function ScoreCard({ section }: ScoreCardProps) {
  const [expandedChecks, setExpandedChecks] = useState<Set<number>>(new Set());
  const pct =
    section.maxScore > 0
      ? Math.round((section.score / section.maxScore) * 100)
      : 0;

  function toggleCheck(index: number) {
    setExpandedChecks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">
            {sectionIcons[section.icon] ?? '\uD83D\uDCCA'}
          </span>
          <h3 className="font-semibold text-stone-900">{section.name}</h3>
        </div>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">
          {pct}%
        </span>
      </div>
      <ul className="divide-y divide-stone-50">
        {section.checks.map((check, i) => {
          const isExpanded = expandedChecks.has(i);
          const hasDetail = check.detail || check.fix;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => hasDetail && toggleCheck(i)}
                className={`flex w-full items-center justify-between px-5 py-3 text-left transition-colors ${hasDetail ? 'cursor-pointer hover:bg-stone-50' : 'cursor-default'}`}
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={check.status} />
                  <span className="text-sm text-stone-700">{check.label}</span>
                  {check.value !== null && (
                    <span className="text-xs text-stone-400">
                      ({String(check.value)})
                    </span>
                  )}
                </div>
                {hasDetail && (
                  <svg
                    className={`h-4 w-4 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
              {isExpanded && hasDetail && (
                <div className="bg-stone-50 px-5 pt-1 pb-4">
                  {check.detail && (
                    <p className="text-sm text-stone-600">{check.detail}</p>
                  )}
                  {check.fix && (
                    <div className="mt-2 rounded-lg border border-stone-200 bg-white px-4 py-3">
                      <p className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                        How to fix
                      </p>
                      <p className="mt-1 text-sm text-stone-700">{check.fix}</p>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
