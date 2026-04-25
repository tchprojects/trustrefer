import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  effectiveDate?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export async function LegalLayout({
  title,
  subtitle,
  effectiveDate,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:py-16">
        {/* Page header */}
        <div className="mb-10 border-b border-[#1f1f1f] pb-8">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-[#555]">{subtitle}</p>}
          {(effectiveDate || lastUpdated) && (
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#444]">
              {effectiveDate && <span>Effective: {effectiveDate}</span>}
              {lastUpdated && <span>Last updated: {lastUpdated}</span>}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm leading-relaxed text-[#888]">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* Reusable section wrapper */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-white">{heading}</h2>
      {children}
    </section>
  );
}

/* Reusable sub-section wrapper */
export function LegalSubSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 pl-0">
      <h3 className="text-sm font-semibold text-[#bbb]">{heading}</h3>
      {children}
    </div>
  );
}

/* Reusable bullet list */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/* Info callout box */
export function LegalCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0a0a0a] px-4 py-3 text-xs text-[#666]">
      {children}
    </div>
  );
}
