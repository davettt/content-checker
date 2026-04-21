import type { ParsedPage, SectionResult, CheckResult } from '../types';

const GENERIC_LINK_TEXT = [
  'click here',
  'read more',
  'learn more',
  'here',
  'link',
  'more',
  'this',
  'see more',
  'see all',
  'view all',
  'browse all',
  'show more',
  'details',
  'continue',
  'go',
  'next',
  'previous',
  'back',
];

const GENERIC_LINK_PATTERNS = [
  /^more\s*[→›»>]/i,
  /^browse\s/i,
  /^see\s/i,
  /^view\s/i,
  /\s[→›»>]$/,
];

function check(
  label: string,
  status: CheckResult['status'],
  value: CheckResult['value'],
  detail: string,
  fix: string,
  points: number,
  maxPoints: number,
): CheckResult {
  return { label, status, value, detail, fix, points, maxPoints };
}

export function analyseFirstImpressions(page: ParsedPage): SectionResult {
  const checks: CheckResult[] = [];

  // Page title
  if (!page.title) {
    checks.push(
      check(
        'Page title',
        'missing',
        null,
        'Your page has no title tag. Search engines and AI assistants use this as the primary label for your page.',
        'Add a <title> tag inside your <head>. Keep it 50-60 characters, descriptive, and unique to this page.',
        0,
        8,
      ),
    );
  } else {
    const len = page.title.length;
    if (len >= 50 && len <= 60) {
      checks.push(
        check(
          'Page title',
          'good',
          `${len} characters`,
          `Your title "${page.title}" is a good length and will display well in search results.`,
          '',
          8,
          8,
        ),
      );
    } else if (len < 50) {
      checks.push(
        check(
          'Page title',
          'needs-work',
          `${len} characters`,
          `Your title "${page.title}" is a bit short. Longer titles give search engines more context about your page.`,
          'Aim for 50-60 characters. Add descriptive keywords that reflect the page content.',
          5,
          8,
        ),
      );
    } else {
      checks.push(
        check(
          'Page title',
          'needs-work',
          `${len} characters`,
          `Your title is ${len} characters — search engines may truncate it beyond 60 characters.`,
          'Trim to 50-60 characters. Put the most important words at the start.',
          5,
          8,
        ),
      );
    }
  }

  // Meta description
  if (!page.metaDescription) {
    checks.push(
      check(
        'Meta description',
        'missing',
        null,
        'No meta description found. Search engines will auto-generate one from your page content, which may not represent your page well.',
        'Add a <meta name="description" content="..."> tag. Write 150-160 characters that summarise the page and encourage clicks.',
        0,
        7,
      ),
    );
  } else {
    const len = page.metaDescription.length;
    if (len >= 120 && len <= 160) {
      checks.push(
        check(
          'Meta description',
          'good',
          `${len} characters`,
          'Your meta description is a good length and will display fully in search results.',
          '',
          7,
          7,
        ),
      );
    } else if (len < 120) {
      checks.push(
        check(
          'Meta description',
          'needs-work',
          `${len} characters`,
          'Your meta description is quite short. You have room to add more context about what this page offers.',
          'Aim for 120-160 characters. Include your main value proposition and a reason to click.',
          4,
          7,
        ),
      );
    } else {
      checks.push(
        check(
          'Meta description',
          'needs-work',
          `${len} characters`,
          `At ${len} characters, your meta description may be cut off in search results.`,
          'Trim to 150-160 characters. Front-load the most important information.',
          4,
          7,
        ),
      );
    }
  }

  // Open Graph
  const ogPresent = [page.ogTitle, page.ogDescription, page.ogImage].filter(
    Boolean,
  ).length;
  if (ogPresent === 3) {
    checks.push(
      check(
        'Open Graph tags',
        'good',
        'Title, description & image',
        'Your page has all the key Open Graph tags. When shared on social media, it will display a rich preview with title, description, and image.',
        '',
        5,
        5,
      ),
    );
  } else if (ogPresent > 0) {
    const missing = [
      !page.ogTitle && 'og:title',
      !page.ogDescription && 'og:description',
      !page.ogImage && 'og:image',
    ].filter(Boolean);
    checks.push(
      check(
        'Open Graph tags',
        'needs-work',
        `Missing: ${missing.join(', ')}`,
        `You have some Open Graph tags but are missing ${missing.join(' and ')}. Social media previews may look incomplete.`,
        `Add the missing tags: ${missing.join(', ')}. The image should be at least 1200x630 pixels.`,
        2,
        5,
      ),
    );
  } else {
    checks.push(
      check(
        'Open Graph tags',
        'missing',
        null,
        "No Open Graph tags found. When people share your page on social media, it won't show a rich preview — just a plain link.",
        'Add og:title, og:description, and og:image meta tags. This makes your content look professional when shared.',
        0,
        5,
      ),
    );
  }

  // Canonical URL
  if (page.canonical) {
    checks.push(
      check(
        'Canonical URL',
        'good',
        page.canonical,
        'A canonical URL is set, which helps search engines understand which version of this page is the primary one.',
        '',
        5,
        5,
      ),
    );
  } else {
    checks.push(
      check(
        'Canonical URL',
        'needs-work',
        null,
        'No canonical URL set. If this page is accessible at multiple URLs, search engines might treat them as duplicate content.',
        'Add <link rel="canonical" href="..."> pointing to the preferred URL for this page.',
        2,
        5,
      ),
    );
  }

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  return { name: 'First Impressions', icon: 'eye', checks, score, maxScore };
}

export function analyseContentStructure(page: ParsedPage): SectionResult {
  const checks: CheckResult[] = [];

  // H1 tag
  const h1s = page.headings.filter((h) => h.level === 1);
  if (h1s.length === 0) {
    checks.push(
      check(
        'H1 heading',
        'missing',
        null,
        'No H1 heading found. The H1 is the main title of your page — search engines and AI use it to understand what the page is about.',
        'Add exactly one H1 tag with a clear, descriptive title for the page.',
        0,
        6,
      ),
    );
  } else if (h1s.length === 1) {
    const h1Text = h1s[0]!.text;
    const h1Words = h1Text.split(/\s+/).length;
    // Flag H1s that are too short/vague (just a name or single word)
    if (h1Words <= 2 && h1Text.length < 20) {
      checks.push(
        check(
          'H1 heading',
          'needs-work',
          h1Text,
          `Your H1 "${h1Text}" is very short. A descriptive H1 helps search engines and AI understand what this page offers — not just who it's by.`,
          'Expand your H1 to include what the page is about. e.g., "David Tiong — Digital Tools & Strategy" instead of just a name.',
          3,
          6,
        ),
      );
    } else {
      checks.push(
        check(
          'H1 heading',
          'good',
          h1Text,
          `Your page has a clear H1: "${h1Text}". This tells search engines and AI what this page is primarily about.`,
          '',
          6,
          6,
        ),
      );
    }
  } else {
    checks.push(
      check(
        'H1 heading',
        'needs-work',
        `${h1s.length} found`,
        `Your page has ${h1s.length} H1 tags. Multiple H1s can confuse search engines about which is the primary topic.`,
        'Keep exactly one H1 for the main page title. Convert others to H2 or H3.',
        3,
        6,
      ),
    );
  }

  // Heading hierarchy
  let hierarchyGood = true;
  let skipDetail = '';
  for (let i = 1; i < page.headings.length; i++) {
    const prev = page.headings[i - 1]!;
    const curr = page.headings[i]!;
    if (curr.level > prev.level + 1) {
      hierarchyGood = false;
      skipDetail = `Jumped from H${prev.level} to H${curr.level} ("${curr.text}")`;
      break;
    }
  }
  if (page.headings.length === 0) {
    checks.push(
      check(
        'Heading hierarchy',
        'missing',
        null,
        'No headings found at all. Headings create structure that helps readers and search engines scan your content.',
        'Add headings (H1, H2, H3) to break up your content into logical sections.',
        0,
        5,
      ),
    );
  } else if (hierarchyGood) {
    checks.push(
      check(
        'Heading hierarchy',
        'good',
        `${page.headings.length} headings, well nested`,
        'Your headings follow a logical hierarchy (H1 → H2 → H3). This helps search engines and AI understand your content structure.',
        '',
        5,
        5,
      ),
    );
  } else {
    checks.push(
      check(
        'Heading hierarchy',
        'needs-work',
        skipDetail,
        'Your headings skip levels (e.g., H1 straight to H3). This can confuse the content hierarchy for search engines and screen readers.',
        "Ensure headings nest logically: H1 → H2 → H3. Don't skip levels for styling — use CSS instead.",
        2,
        5,
      ),
    );
  }

  // Heading count
  const h2Count = page.headings.filter((h) => h.level === 2).length;
  const h3Count = page.headings.filter((h) => h.level === 3).length;
  const subheadingCount = h2Count + h3Count;
  if (subheadingCount === 0 && page.bodyText.split(/\s+/).length > 300) {
    checks.push(
      check(
        'Subheadings',
        'needs-work',
        'None found',
        "Your page has a lot of content but no subheadings (H2, H3). This creates a wall of text that's hard to scan.",
        'Add H2 headings to break content into sections. Aim for one every 200-300 words.',
        0,
        5,
      ),
    );
  } else if (subheadingCount > 0) {
    checks.push(
      check(
        'Subheadings',
        'good',
        `${h2Count} H2s, ${h3Count} H3s`,
        'Your page uses subheadings to organise content, making it easier for readers and search engines to scan.',
        '',
        5,
        5,
      ),
    );
  } else {
    checks.push(
      check(
        'Subheadings',
        'good',
        `${h2Count} H2s, ${h3Count} H3s`,
        'Content is short enough that few subheadings are fine.',
        '',
        4,
        5,
      ),
    );
  }

  // Word count
  const wordCount = page.bodyText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 300) {
    checks.push(
      check(
        'Word count',
        'needs-work',
        `${wordCount} words`,
        'Your page has thin content. Search engines and AI generally prefer pages with enough substance to fully cover a topic.',
        'If this is a key page, aim for at least 300-500 words. Add detail that genuinely helps your visitors.',
        2,
        5,
      ),
    );
  } else if (wordCount <= 1500) {
    checks.push(
      check(
        'Word count',
        'good',
        `${wordCount} words`,
        'Good content length. Your page has enough substance for search engines to understand the topic.',
        '',
        5,
        5,
      ),
    );
  } else {
    checks.push(
      check(
        'Word count',
        'good',
        `${wordCount} words`,
        'Comprehensive content. Long-form pages can rank well if the content stays focused and valuable.',
        '',
        5,
        5,
      ),
    );
  }

  // Paragraph structure
  if (page.paragraphs.length > 0) {
    const avgLen =
      page.paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0) /
      page.paragraphs.length;
    if (avgLen > 80) {
      checks.push(
        check(
          'Paragraph length',
          'needs-work',
          `Avg ~${Math.round(avgLen)} words`,
          'Your paragraphs are quite long. On screens, shorter paragraphs are easier to read and less intimidating.',
          'Break long paragraphs into 2-4 sentence chunks. Use line breaks between ideas.',
          1,
          4,
        ),
      );
    } else {
      checks.push(
        check(
          'Paragraph length',
          'good',
          `Avg ~${Math.round(avgLen)} words`,
          'Your paragraphs are a readable length — good for on-screen reading.',
          '',
          4,
          4,
        ),
      );
    }
  } else {
    checks.push(
      check(
        'Paragraph length',
        'needs-work',
        'No <p> tags found',
        "Your page doesn't use paragraph tags. Wrapping text in <p> tags improves readability and helps search engines parse your content.",
        'Wrap text content in <p> tags for proper semantic structure.',
        1,
        4,
      ),
    );
  }

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  return {
    name: 'Content Structure',
    icon: 'layout',
    checks,
    score,
    maxScore,
  };
}

export function analyseImages(page: ParsedPage): SectionResult {
  const checks: CheckResult[] = [];
  const total = page.images.length;

  if (total === 0) {
    checks.push(
      check(
        'Images',
        'needs-work',
        'None found',
        'No images detected on this page. Images can improve engagement and help illustrate your content.',
        'Consider adding relevant images to support your content. Every image should have descriptive alt text.',
        5,
        5,
      ),
    );
    return { name: 'Images', icon: 'image', checks, score: 5, maxScore: 15 };
  }

  const withAlt = page.images.filter(
    (img) => img.alt !== null && img.alt.trim() !== '',
  );
  const withoutAlt = page.images.filter(
    (img) => img.alt === null || img.alt.trim() === '',
  );
  const pct = Math.round((withAlt.length / total) * 100);

  checks.push(
    check(
      'Total images',
      'good',
      total,
      `Found ${total} image${total !== 1 ? 's' : ''} on the page.`,
      '',
      0,
      0,
    ),
  );

  if (pct === 100) {
    checks.push(
      check(
        'Alt text coverage',
        'good',
        `${withAlt.length}/${total} (100%)`,
        'Every image has alt text. This helps accessibility, SEO, and AI understanding of your visual content.',
        '',
        10,
        10,
      ),
    );
  } else if (pct >= 70) {
    checks.push(
      check(
        'Alt text coverage',
        'needs-work',
        `${withAlt.length}/${total} (${pct}%)`,
        `${withoutAlt.length} image${withoutAlt.length !== 1 ? 's' : ''} missing alt text. Alt text is used by screen readers, search engines, and AI to understand your images.`,
        'Add descriptive alt text to every image. Describe what the image shows, not just "image" or "photo".',
        5,
        10,
      ),
    );
  } else {
    checks.push(
      check(
        'Alt text coverage',
        'missing',
        `${withAlt.length}/${total} (${pct}%)`,
        `Most images are missing alt text. This hurts accessibility, SEO, and means AI assistants can't understand your visual content.`,
        'Add descriptive alt text to every meaningful image. Decorative images can use alt="" (empty alt).',
        2,
        10,
      ),
    );
  }

  if (withoutAlt.length > 0) {
    const examples = withoutAlt
      .slice(0, 5)
      .map((img) => img.src.split('/').pop() ?? img.src)
      .join(', ');
    checks.push(
      check(
        'Images missing alt text',
        'needs-work',
        `${withoutAlt.length} image${withoutAlt.length !== 1 ? 's' : ''}`,
        `Missing alt text on: ${examples}${withoutAlt.length > 5 ? ` and ${withoutAlt.length - 5} more` : ''}`,
        'Add alt="descriptive text" to each img tag. Describe the content and purpose of the image.',
        0,
        5,
      ),
    );
  } else {
    checks.push(
      check(
        'Images missing alt text',
        'good',
        'None',
        'All images have alt text defined.',
        '',
        5,
        5,
      ),
    );
  }

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  return { name: 'Images', icon: 'image', checks, score, maxScore };
}

export function analyseLinks(page: ParsedPage): SectionResult {
  const checks: CheckResult[] = [];

  // Internal links
  const internalCount = page.internalLinks.length;
  if (internalCount === 0) {
    checks.push(
      check(
        'Internal links',
        'needs-work',
        '0',
        'No internal links found. Internal links help search engines discover your other pages and keep visitors on your site.',
        'Add links to related pages on your site. Navigation links count, but in-content links are even more valuable.',
        0,
        4,
      ),
    );
  } else if (internalCount < 3) {
    checks.push(
      check(
        'Internal links',
        'needs-work',
        `${internalCount}`,
        `Only ${internalCount} internal link${internalCount !== 1 ? 's' : ''} found. More internal links help search engines crawl your site and keep visitors engaged.`,
        'Link to related content, services, or pages naturally within your text.',
        2,
        4,
      ),
    );
  } else {
    checks.push(
      check(
        'Internal links',
        'good',
        `${internalCount}`,
        `${internalCount} internal links found — good for site navigation and search engine crawling.`,
        '',
        4,
        4,
      ),
    );
  }

  // External links
  const externalCount = page.externalLinks.length;
  checks.push(
    check(
      'External links',
      externalCount > 0 ? 'good' : 'needs-work',
      `${externalCount}`,
      externalCount > 0
        ? `${externalCount} external link${externalCount !== 1 ? 's' : ''} found. Linking to relevant external resources can boost credibility.`
        : 'No external links found. Linking to authoritative sources can improve trust and provide value to readers.',
      externalCount > 0
        ? ''
        : 'Consider linking to relevant, authoritative sources that support your content.',
      externalCount > 0 ? 3 : 1,
      3,
    ),
  );

  // Descriptive link text
  const allLinks = [...page.internalLinks, ...page.externalLinks];
  if (allLinks.length > 0) {
    const genericLinks = allLinks.filter((link) => {
      const text = link.text.toLowerCase().trim();
      if (GENERIC_LINK_TEXT.includes(text)) return true;
      if (GENERIC_LINK_PATTERNS.some((p) => p.test(text))) return true;
      return false;
    });
    const genericPct = Math.round(
      (genericLinks.length / allLinks.length) * 100,
    );
    if (genericLinks.length === 0) {
      checks.push(
        check(
          'Link text quality',
          'good',
          'All descriptive',
          'All your links use descriptive anchor text, which helps search engines and users understand where each link goes.',
          '',
          3,
          3,
        ),
      );
    } else {
      checks.push(
        check(
          'Link text quality',
          'needs-work',
          `${genericLinks.length} generic (${genericPct}%)`,
          `${genericLinks.length} link${genericLinks.length !== 1 ? 's' : ''} use generic text like "click here" or "read more". Descriptive link text helps SEO and accessibility.`,
          'Replace generic text with descriptive labels. e.g., "read more" → "read our pricing guide".',
          1,
          3,
        ),
      );
    }
  } else {
    checks.push(
      check(
        'Link text quality',
        'needs-work',
        'No links',
        'No links to evaluate.',
        'Add internal and external links to improve site navigation and SEO.',
        0,
        3,
      ),
    );
  }

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  return { name: 'Links', icon: 'link', checks, score, maxScore };
}

export function analyseAiReadiness(page: ParsedPage): SectionResult {
  const checks: CheckResult[] = [];

  // Schema markup
  const RICH_SCHEMA_TYPES = [
    'FAQPage',
    'HowTo',
    'Product',
    'Article',
    'LocalBusiness',
    'Organization',
    'SoftwareApplication',
    'Service',
    'Event',
    'Recipe',
    'Review',
    'Course',
    'JobPosting',
    'VideoObject',
  ];

  if (page.schemaMarkup.length > 0) {
    const validSchemas = page.schemaMarkup.filter(
      (s) => s.type !== 'Invalid JSON-LD',
    );
    const types = validSchemas.map((s) => s.type).join(', ');
    const hasRichSchema = validSchemas.some((s) =>
      RICH_SCHEMA_TYPES.includes(s.type),
    );

    if (validSchemas.length === 0) {
      checks.push(
        check(
          'Schema markup',
          'needs-work',
          'Invalid JSON-LD found',
          'Schema markup was found but contains invalid JSON-LD.',
          'Fix the JSON-LD syntax errors in your schema markup.',
          2,
          8,
        ),
      );
    } else if (hasRichSchema) {
      checks.push(
        check(
          'Schema markup',
          'good',
          types,
          `Found rich structured data: ${types}. This helps search engines display rich results and AI assistants cite your content.`,
          '',
          8,
          8,
        ),
      );
    } else {
      // Basic schema is present — give credit, but suggest enhancements
      // based on actual page content
      const suggestions: string[] = [];
      // Only suggest FAQPage if there are multiple actual questions (with ?)
      const questionHeadings = page.headings.filter((h) =>
        h.text.includes('?'),
      ).length;
      const bodyLower = page.bodyText.toLowerCase();
      if (questionHeadings >= 3)
        suggestions.push('FAQPage for your Q&A content');
      if (bodyLower.includes('price') || bodyLower.includes('buy'))
        suggestions.push('Product for items you sell');

      if (suggestions.length > 0) {
        checks.push(
          check(
            'Schema markup',
            'needs-work',
            `${types} (could be richer)`,
            `Found valid schema (${types}), but this page has content that could benefit from richer types.`,
            `Consider adding: ${suggestions.join(', ')}.`,
            5,
            8,
          ),
        );
      } else {
        checks.push(
          check(
            'Schema markup',
            'good',
            types,
            `Found structured data: ${types}. This is appropriate for this page and helps search engines understand your content.`,
            '',
            7,
            8,
          ),
        );
      }
    }
  } else {
    checks.push(
      check(
        'Schema markup',
        'missing',
        null,
        'No structured data (JSON-LD) found. Schema markup helps search engines display rich results and helps AI assistants understand your content.',
        'Add JSON-LD schema markup. Common types: LocalBusiness, Organization, FAQPage, Article, Product.',
        0,
        8,
      ),
    );
  }

  // FAQ-style content
  const questionPatterns = page.headings.filter(
    (h) =>
      h.text.includes('?') ||
      /^(what|how|why|when|where|who|can|do|does|is|are|will|should)\b/i.test(
        h.text,
      ),
  ).length;
  const bodyQuestions = (page.bodyText.match(/[.!?]\s+[A-Z][^.!?]*\?/g) ?? [])
    .length;
  const totalQuestions = questionPatterns + bodyQuestions;

  if (totalQuestions >= 3) {
    checks.push(
      check(
        'FAQ-style content',
        'good',
        `${totalQuestions} questions detected`,
        'Your content contains question-and-answer patterns. AI search engines love this format — it makes your content easy to cite as a direct answer.',
        '',
        7,
        7,
      ),
    );
  } else if (totalQuestions > 0) {
    checks.push(
      check(
        'FAQ-style content',
        'needs-work',
        `${totalQuestions} question${totalQuestions !== 1 ? 's' : ''} detected`,
        'Your page has some question patterns. Adding more Q&A content increases the chance AI assistants cite your page.',
        'Add a FAQ section with 3-5 questions your customers commonly ask. Use the question as a heading and answer directly below.',
        3,
        7,
      ),
    );
  } else {
    checks.push(
      check(
        'FAQ-style content',
        'missing',
        null,
        'No question-and-answer patterns detected. AI search engines (like Perplexity and ChatGPT) prefer content that directly answers questions.',
        'Add a FAQ section, or restructure some content as questions and clear answers. Think: "What would someone ask Google about this?"',
        0,
        7,
      ),
    );
  }

  // Meta robots
  if (page.metaRobots) {
    const lower = page.metaRobots.toLowerCase();
    if (lower.includes('noindex') || lower.includes('nofollow')) {
      checks.push(
        check(
          'Meta robots',
          'needs-work',
          page.metaRobots,
          `Your page has meta robots set to "${page.metaRobots}". This may be preventing search engines and AI from indexing or following links on this page.`,
          'If you want this page to appear in search results and AI answers, remove the noindex/nofollow directives.',
          0,
          5,
        ),
      );
    } else {
      checks.push(
        check(
          'Meta robots',
          'good',
          page.metaRobots,
          'Meta robots tag is set and allows indexing. Search engines and AI can access your content.',
          '',
          5,
          5,
        ),
      );
    }
  } else {
    checks.push(
      check(
        'Meta robots',
        'good',
        'Not set (defaults to index, follow)',
        'No restrictive meta robots tag found. Your page is accessible to search engines and AI by default.',
        '',
        5,
        5,
      ),
    );
  }

  // Citable answers
  const sentences = page.bodyText
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.split(/\s+/).length <= 30);
  const citableCount = sentences.length;

  if (citableCount >= 5) {
    checks.push(
      check(
        'Clear, citable statements',
        'good',
        `${citableCount} found`,
        'Your content has clear, concise statements that AI can easily quote as answers. This is great for appearing in AI-generated responses.',
        '',
        5,
        5,
      ),
    );
  } else if (citableCount > 0) {
    checks.push(
      check(
        'Clear, citable statements',
        'needs-work',
        `${citableCount} found`,
        'Your content has some citable statements, but more would help. AI assistants prefer short, direct answers they can quote.',
        'Write clear, factual sentences under 30 words that directly answer potential questions. Front-load key information.',
        2,
        5,
      ),
    );
  } else {
    checks.push(
      check(
        'Clear, citable statements',
        'needs-work',
        'Few found',
        'Your content may be too complex or long-winded for AI to quote easily. Short, direct statements rank better in AI answers.',
        'Add clear summary sentences near the top of sections. Think: "If an AI had to quote one sentence from this section, which would it pick?"',
        0,
        5,
      ),
    );
  }

  const score = checks.reduce((sum, c) => sum + c.points, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  return {
    name: 'AI & Search Readiness',
    icon: 'sparkles',
    checks,
    score,
    maxScore,
  };
}

export function analyseAll(page: ParsedPage): SectionResult[] {
  return [
    analyseFirstImpressions(page),
    analyseContentStructure(page),
    analyseImages(page),
    analyseLinks(page),
    analyseAiReadiness(page),
  ];
}
