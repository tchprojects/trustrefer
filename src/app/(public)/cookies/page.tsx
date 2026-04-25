import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalLayout,
  LegalSection,
  LegalList,
} from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy — TrustRefer",
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      effectiveDate="01 May 2026"
      lastUpdated="01 May 2026"
    >
      <LegalSection heading="What are cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a website. They allow the
          website to recognise your device, remember your preferences, and collect information about
          how you interact with the site. Similar technologies, such as local storage and session
          tokens, work in a comparable way.
        </p>
      </LegalSection>

      <LegalSection heading="The cookies we use">
        <div className="space-y-4">
          {/* Essential */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-green-950/50 px-2 py-0.5 text-[10px] font-medium text-green-400">
                Essential
              </span>
              <span className="text-xs font-medium text-white">Always active</span>
            </div>
            <p className="text-xs">
              These cookies are necessary for the platform to function. They enable core features such
              as user authentication, session management, and security controls. You cannot opt out of
              essential cookies while using the Service.
            </p>
            <p className="text-xs text-[#555]">
              Examples: session tokens that keep you logged in, security tokens to protect against
              cross-site request forgery.
            </p>
          </div>

          {/* Analytics */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-yellow-950/50 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
                Analytics
              </span>
              <span className="text-xs font-medium text-white">Performance cookies</span>
            </div>
            <p className="text-xs">
              We use analytics tools to understand how visitors use TrustRefer — for example, which
              pages are visited most often, how users navigate the platform, and which referral links
              are clicked. This helps us improve the Service.
            </p>
            <p className="text-xs text-[#555]">
              This data is collected in aggregate where possible and may include your IP address,
              browser type, and pages visited.
            </p>
          </div>

          {/* Functionality */}
          <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-950/50 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                Functionality
              </span>
              <span className="text-xs font-medium text-white">Preference cookies</span>
            </div>
            <p className="text-xs">
              These cookies remember your preferences and settings so you do not need to re-enter them
              on each visit. This may include your preferred view, consent choices, or other
              customisations you have made.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection heading="Third-party cookies">
        <p>
          Some third-party services we use (such as analytics providers) may set their own cookies.
          These are governed by the respective provider&apos;s privacy policy, not ours. We aim to
          use only providers that comply with applicable UK and EU data protection standards.
        </p>
      </LegalSection>

      <LegalSection heading="How to manage cookies">
        <p>
          You can control and delete cookies through your browser settings. Most browsers allow you
          to:
        </p>
        <LegalList
          items={[
            "see what cookies are stored and delete them individually",
            "block third-party cookies",
            "block cookies from specific websites",
            "block all cookies",
            "delete all cookies when you close your browser",
          ]}
        />
        <p>
          Please note that disabling certain cookies may affect the functionality of TrustRefer,
          including the ability to stay logged in.
        </p>
        <p>For guidance on managing cookies in your browser:</p>
        <div className="flex flex-wrap gap-3 text-xs">
          {[
            {
              name: "Google Chrome",
              href: "https://support.google.com/chrome/answer/95647",
            },
            {
              name: "Mozilla Firefox",
              href: "https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences",
            },
            {
              name: "Safari",
              href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac",
            },
            {
              name: "Microsoft Edge",
              href: "https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge",
            },
          ].map(({ name, href }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-1.5 text-[#888] transition-colors hover:border-white/20 hover:text-white"
            >
              {name}
            </a>
          ))}
        </div>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>
          We may update this Cookie Policy as we change the technologies we use. The &ldquo;Last
          updated&rdquo; date at the top will reflect any changes.
        </p>
      </LegalSection>

      <LegalSection heading="More information">
        <p>
          For questions about our use of cookies or personal data more broadly, please see our{" "}
          <Link
            href="/privacy"
            className="text-white underline underline-offset-2 hover:no-underline"
          >
            Privacy Policy
          </Link>{" "}
          or contact us via the{" "}
          <Link href="/report" className="text-white underline underline-offset-2 hover:no-underline">
            contact form
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
