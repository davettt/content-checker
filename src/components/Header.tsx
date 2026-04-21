export function Header() {
  return (
    <header className="text-center">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Content Checker
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        by{' '}
        <a
          href="https://davidtiong.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-stone-700"
        >
          davidtiong.com
        </a>
      </p>
      <p className="mx-auto mt-4 max-w-lg text-lg text-stone-600">
        Check if your website content is working hard for you — in search
        engines and AI answers.
      </p>
    </header>
  );
}
