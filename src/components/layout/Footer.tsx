import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f] py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-xs text-[#888]">
            © {new Date().getFullYear()} TrustRefer. All rights reserved.
          </p>
          <nav className="flex items-center gap-4 text-xs text-[#888]">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <span className="text-[#333]">·</span>
            <Link href="/report" className="transition-colors hover:text-white">
              Report an issue
            </Link>
            <span className="text-[#333]">·</span>
            <Link href="/support" className="transition-colors hover:text-white">
              Support
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
