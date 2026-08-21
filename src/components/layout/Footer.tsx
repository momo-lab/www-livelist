export function Footer() {
  return (
    <>
      <footer className="bg-background text-foreground/50 border-t py-2 text-center text-sm">
        <div>
          Created by{' '}
          <a
            href="https://x.com/momolab"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-blue-600"
          >
            @momolab
          </a>
        </div>
        <div>
          <a
            href="https://momo-lab.net/privacy-policy.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-blue-600"
          >
            プライバシーポリシー
          </a>
        </div>
      </footer>
    </>
  );
}
