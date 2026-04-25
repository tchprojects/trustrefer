import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalLayout,
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Affiliate & Advertising Disclosure — TrustRefer",
};

export default function DisclosurePage() {
  return (
    <LegalLayout
      title="Affiliate & Advertising Disclosure"
      subtitle="Transparency about how referral links work on TrustRefer"
      effectiveDate="01 May 2026"
    >
      <p>
        Transparency is important to us. This page explains how TrustRefer and its community members
        may benefit from referral links shared on the platform.
      </p>

      <LegalSection heading="How referral links work">
        <p>
          TrustRefer is a community platform where users share referral links for products and
          services they use. A referral link is a unique URL that, when followed, may credit the
          person who shared it with a reward — for example, a cash bonus, account credit, free period,
          or discount.
        </p>
        <LegalCallout>
          <strong className="text-white">Please note:</strong> When you click a referral link on
          TrustRefer, the person who submitted that link may receive a benefit if you go on to sign up
          or make a purchase. Whether a reward is paid depends entirely on the third-party
          provider&apos;s terms and referral programme rules. TrustRefer has no influence over this.
        </LegalCallout>
      </LegalSection>

      <LegalSection heading="TrustRefer's own commercial relationships">
        <p>
          In some cases, TrustRefer itself may receive compensation or a commercial benefit in
          connection with certain links or providers featured on the platform. Where this is the case,
          we will aim to label the relevant content clearly as <strong className="text-white">Sponsored</strong> or{" "}
          <strong className="text-white">Promoted</strong> where practicable.
        </p>
        <p>
          Commercial relationships do not influence community ranking, vote scores, or the ordering of
          links, which are determined by user engagement.
        </p>
      </LegalSection>

      <LegalSection heading="What this means for you">
        <LegalList
          items={[
            "Some links on TrustRefer may financially benefit the person who posted them, TrustRefer, or both.",
            "The presence and positioning of a link does not mean TrustRefer endorses or recommends the associated product, service, or provider.",
            "You should evaluate any offer on its own merits, read the provider's terms, and make your own informed decision.",
            "TrustRefer does not verify or guarantee the accuracy of any reward claim, offer description, or eligibility criteria submitted by community members.",
          ]}
        />
      </LegalSection>

      <LegalSection heading="Our commitment">
        <p>
          We aim to be transparent about how TrustRefer works and how links on the platform may
          benefit community members or TrustRefer itself. If you have questions about a specific link
          or our commercial arrangements, please contact us via the{" "}
          <Link href="/report" className="text-white underline underline-offset-2 hover:no-underline">
            contact form
          </Link>
          .
        </p>
      </LegalSection>

      <div className="border-t border-[#1f1f1f] pt-6">
        <p className="text-xs text-[#444]">
          Related pages:{" "}
          <Link href="/disclaimer" className="text-[#666] underline underline-offset-2 hover:text-white">
            Disclaimer
          </Link>
          {" · "}
          <Link href="/terms" className="text-[#666] underline underline-offset-2 hover:text-white">
            Terms of Use
          </Link>
          {" · "}
          <Link href="/privacy" className="text-[#666] underline underline-offset-2 hover:text-white">
            Privacy Policy
          </Link>
        </p>
      </div>
    </LegalLayout>
  );
}
