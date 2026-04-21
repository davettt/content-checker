export type CheckStatus = 'good' | 'needs-work' | 'missing' | 'error';

export interface CheckResult {
  status: CheckStatus;
  label: string;
  value: string | number | null;
  detail: string;
  fix: string;
  points: number;
  maxPoints: number;
}

export interface SectionResult {
  name: string;
  icon: string;
  checks: CheckResult[];
  score: number;
  maxScore: number;
}

export interface AnalysisResult {
  url: string;
  fetchedAt: string;
  sections: SectionResult[];
  overallScore: number;
  maxScore: number;
  pageTitle: string | null;
}

export interface ParsedPage {
  title: string | null;
  metaDescription: string | null;
  canonical: string | null;
  metaRobots: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  headings: { level: number; text: string }[];
  images: { src: string; alt: string | null }[];
  internalLinks: { href: string; text: string }[];
  externalLinks: { href: string; text: string }[];
  schemaMarkup: { type: string; raw: string }[];
  bodyText: string;
  paragraphs: string[];
  url: string;
}
