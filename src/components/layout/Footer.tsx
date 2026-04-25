import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Terms",       href: "/terms"       },
  { label: "Privacy",     href: "/privacy"     },
  { label: "Cookies",     href: "/cookies"     },
  { label: "Disclaimer",  href: "/disclaimer"  },
  { label: "Disclosure",  href: "/disclosure"  },
  { label: "Report a Link", href: "/report"    },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f] py-8">
      <div className="mx-auto max-w-4xl px-4 space-y-5">

        {/* Top row: copyright + legal nav */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#888]">
            © {new Date().getFullYear()} TrustRefer. All rights reserved.
          </p>

          <nav className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {LEGAL_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-3">
                {i > 0 && <span className="text-[#2a2a2a]">·</span>}
                <Link
                  href={link.href}
                  className="text-xs text-[#555] transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>

        {/* Inline disclaimer */}
        <div className="border-t border-[#111] pt-4">
          <p className="text-[11px] leading-relaxed text-[#444]">
            Referral links on TrustRefer are submitted by community members. TrustRefer does not
            verify, endorse, or guarantee any offer, product, or third-party website. Offers may
            change or expire without notice. Always check the provider&apos;s own terms before
            proceeding. Some links may benefit the person who posted them.{" "}
            <Link
              href="/disclaimer"
              className="text-[#555] underline underline-offset-2 transition-colors hover:text-white"
            >
              Read our full disclaimer →
            </Link>
          </p>
        </div>

      </div>
    </footer>
  );
}
