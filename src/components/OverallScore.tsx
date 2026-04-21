import type { SectionResult } from '../types';

interface OverallScoreProps {
  sections: SectionResult[];
}

function getScoreLabel(pct: number): { label: string; color: string } {
  if (pct >= 80)
    return { label: 'Great foundation', color: 'text-emerald-600' };
  if (pct >= 60)
    return { label: 'Good start, room to improve', color: 'text-amber-600' };
  if (pct >= 40) return { label: 'Needs attention', color: 'text-orange-600' };
  return { label: 'Significant improvements needed', color: 'text-red-600' };
}

function getBarColor(pct: number): string {
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 60) return 'bg-amber-500';
  if (pct >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export function OverallScore({ sections }: OverallScoreProps) {
  const totalScore = sections.reduce((sum, s) => sum + s.score, 0);
  const totalMax = sections.reduce((sum, s) => sum + s.maxScore, 0);
  const pct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  const { label, color } = getScoreLabel(pct);

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium tracking-wide text-stone-500 uppercase">
            Content Score
          </h2>
          <p className={`mt-1 text-4xl font-bold ${color}`}>{pct}/100</p>
          <p className="mt-1 text-sm text-stone-500">{label}</p>
        </div>
        <div className="text-right">
          {sections.map((s) => {
            const sPct =
              s.maxScore > 0 ? Math.round((s.score / s.maxScore) * 100) : 0;
            return (
              <div
                key={s.name}
                className="flex items-center justify-end gap-2 text-xs text-stone-500"
              >
                <span>{s.name}</span>
                <span className="font-mono">{sPct}%</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
