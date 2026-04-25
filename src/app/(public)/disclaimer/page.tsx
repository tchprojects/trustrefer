import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalLayout,
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Disclaimer — TrustRefer",
};

export default function DisclaimerPage() {
  return (
    <LegalLayout
      title="Disclaimer"
      effectiveDate="01 May 2026"
    >
      <LegalCallout>
        TrustRefer is operated by Bajaj IT Services Ltd, a company registered in England and Wales,
        company number 09115792.
      </LegalCallout>

      <LegalSection heading="About TrustRefer">
        <p>
          TrustRefer is a community platform where registered users share referral links for products
          and services they use. Our role is to host and display those submissions. We do not sell
          products, provide financial services, or act as a broker, adviser, or intermediary for any
          third party.
        </p>
      </LegalSection>

      <LegalSection heading="User-submitted content">
        <p>
          All referral links, descriptions, reward claims, and related content published on TrustRefer
          are submitted by community members. TrustRefer does not originate, independently verify, or
          guarantee the accuracy, completeness, or currency of any submitted content.
        </p>
        <p>
          The presence of a link on TrustRefer does not mean that we have reviewed, endorsed, or
          approved the associated product, service, offer, or provider.
        </p>
      </LegalSection>

      <LegalSection heading="Third-party websites">
        <p>
          When you click a referral link on TrustRefer, you will be taken to an external website
          operated by a third party. TrustRefer has no control over those websites and accepts no
          responsibility for:
        </p>
        <LegalList
          items={[
            "their content, accuracy, or availability",
            "the products, services, or offers they describe",
            "their pricing, terms, or eligibility requirements",
            "their privacy practices or security",
            "any transactions you enter into with them",
          ]}
        />
        <p>
          You should always read the provider&apos;s own terms and conditions, eligibility criteria,
          privacy policy, and any other relevant documentation before proceeding.
        </p>
      </LegalSection>

      <LegalSection heading="Offers may change">
        <p>
          Referral offers, bonuses, discounts, and rewards are set by third-party providers, not by
          TrustRefer. They can change, expire, be withdrawn, or vary by region without notice.
          TrustRefer cannot guarantee that any offer described on the platform is still valid,
          available, or applicable to you at the time you view it.
        </p>
      </LegalSection>

      <LegalSection heading="No financial or professional advice">
        <p>
          Nothing on TrustRefer constitutes financial advice, investment advice, insurance advice, or
          any other form of regulated professional advice. If you are considering a financial product
          or service, you should seek independent advice from a suitably qualified professional.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the fullest extent permitted by applicable law, TrustRefer accepts no liability for any
          loss or damage — whether direct, indirect, consequential, or otherwise — arising from your
          use of the platform, your reliance on any content hosted on it, or your interaction with any
          third-party website or provider reached via a link on TrustRefer.
        </p>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>
          If you believe any content on TrustRefer is inaccurate, misleading, or harmful, please use
          our{" "}
          <Link href="/report" className="text-white underline underline-offset-2 hover:no-underline">
            Report a Link
          </Link>{" "}
          form or get in touch via our{" "}
          <Link href="/report" className="text-white underline underline-offset-2 hover:no-underline">
            contact page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
