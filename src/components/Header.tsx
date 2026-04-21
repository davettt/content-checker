export function Header() {
  return (
    <header className="text-center">
      <div className="mx-auto mb-4 flex items-center justify-center gap-3">
        <img src="/favicon.svg" alt="" className="h-10 w-10" />
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Content Checker
        </h1>
      </div>
      <p className="mx-auto max-w-lg text-lg text-stone-600">
        Check if your website content is working hard for you — in search
        engines and AI answers.
      </p>
      <p className="mt-2 text-xs text-stone-400">
        A{' '}
        <a
          href="https://www.davidtiong.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-stone-500"
        >
          David Tiong
        </a>{' '}
        vibe-coded tool — 20+ years of digital expertise, built into software
      </p>
    </header>
  );
}
