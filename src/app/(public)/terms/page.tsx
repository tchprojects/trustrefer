import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalLayout,
  LegalSection,
  LegalList,
  LegalCallout,
} from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Use — TrustRefer",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Use"
      effectiveDate="01 May 2026"
      lastUpdated="01 May 2026"
    >
      <p>
        These Terms of Use govern your access to and use of the TrustRefer website and platform (the
        &ldquo;Service&rdquo;), operated by Bajaj IT Services Ltd (&ldquo;TrustRefer&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), a company registered in England and
        Wales, company number 09115792.
      </p>
      <p>
        By accessing or using TrustRefer, you agree to be bound by these Terms. If you do not agree,
        please do not use the Service.
      </p>

      <LegalSection heading="1. Who can use TrustRefer">
        <p>
          TrustRefer is available to users aged 18 and over. By using the Service, you confirm that
          you meet this requirement. You must not use TrustRefer on behalf of any organisation without
          authority to bind that organisation to these Terms.
        </p>
      </LegalSection>

      <LegalSection heading="2. Your account">
        <p>
          You are responsible for maintaining the security and confidentiality of your account
          credentials. You must not share your account with others or allow anyone else to access it
          on your behalf.
        </p>
        <p>
          You are responsible for all activity that takes place under your account. If you believe
          your account has been compromised, please notify us immediately via the{" "}
          <Link href="/report" className="text-white underline underline-offset-2 hover:no-underline">
            contact form
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="3. Submitting referral links">
        <p>
          TrustRefer allows registered users to submit referral links for products and services. By
          submitting a link, you confirm that:
        </p>
        <LegalList
          items={[
            "the link and any associated description or reward claim is accurate, truthful, and not misleading",
            "you have the right to share the link under the terms of the relevant provider",
            "the submission does not infringe any third-party intellectual property rights",
            "the submission is not spam, not misleading, not abusive, and not otherwise unlawful",
            "you will promptly update or remove your submission if the underlying offer expires, changes materially, or you become aware it is no longer accurate",
          ]}
        />
        <p>
          You must not submit links that promote illegal goods or services, contain malware, violate
          any applicable law, or breach any third party&apos;s terms of service.
        </p>
      </LegalSection>

      <LegalSection heading="4. Accuracy and responsibility">
        <p>
          You are solely responsible for the content you submit to TrustRefer. TrustRefer does not
          independently verify submitted links, descriptions, or reward claims. We do not guarantee
          that any submission is accurate, current, or suitable for your circumstances.
        </p>
        <p>
          Votes, popularity scores, and community rankings on TrustRefer reflect user engagement only.
          They do not constitute verification, endorsement, or any guarantee of quality, accuracy, or
          availability.
        </p>
      </LegalSection>

      <LegalSection heading="5. Our moderation rights">
        <p>
          TrustRefer reserves the right at any time, in our sole discretion, to:
        </p>
        <LegalList
          items={[
            "review, approve, reject, or remove any submitted content",
            "edit or request correction of any submission",
            "suspend or permanently remove a user account",
            "restrict access to any part of the Service",
          ]}
        />
        <p>
          We may exercise these rights without prior notice and without liability to you. We are not
          obliged to give reasons for moderation decisions, though we will try to do so where
          reasonable.
        </p>
      </LegalSection>

      <LegalSection heading="6. Third-party websites and content">
        <p>
          TrustRefer hosts links to third-party websites. We do not control those websites and are
          not responsible for their content, availability, accuracy, security, privacy practices,
          pricing, terms, or any product or service they offer.
        </p>
        <p>
          Clicking a referral link will take you away from TrustRefer to an external website. Your
          use of that website is governed by its own terms and conditions. TrustRefer is not a party
          to any transaction or relationship between you and a third-party provider.
        </p>
        <p>Inclusion of a link on TrustRefer does not constitute endorsement or recommendation.</p>
      </LegalSection>

      <LegalSection heading="7. Prohibited conduct">
        <p>You must not use TrustRefer to:</p>
        <LegalList
          items={[
            "submit false, misleading, or fraudulent content",
            "impersonate any person or organisation",
            "harvest, scrape, or systematically collect data from the platform without our prior written consent",
            "interfere with or disrupt the platform's operation or security",
            "circumvent any access controls or technical measures",
            "use the platform for any commercial purpose not expressly permitted by these Terms",
            "engage in any conduct that is unlawful, harmful, abusive, defamatory, or otherwise objectionable",
          ]}
        />
      </LegalSection>

      <LegalSection heading="8. Intellectual property">
        <p>
          All intellectual property in the TrustRefer platform, including its design, code, branding,
          and original content, belongs to Bajaj IT Services Ltd or its licensors. Nothing in these
          Terms grants you any rights to use our intellectual property except as strictly necessary to
          use the Service in the normal way.
        </p>
      </LegalSection>

      <LegalSection heading="9. Disclaimer and limitation of liability">
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without
          warranties of any kind. TrustRefer does not warrant that the Service will be uninterrupted,
          error-free, or secure.
        </p>
        <p>
          To the fullest extent permitted by law, TrustRefer&apos;s total liability to you for any
          claim arising out of or in connection with these Terms or your use of the Service shall not
          exceed the greater of (a) the amount you have paid to us in the 12 months preceding the
          claim or (b) £50.
        </p>
        <LegalCallout>
          Nothing in these Terms limits liability for death or personal injury caused by negligence,
          fraud, or any other liability that cannot be excluded under applicable law.
        </LegalCallout>
      </LegalSection>

      <LegalSection heading="10. Changes to these Terms">
        <p>
          We may update these Terms from time to time. When we do, we will update the &ldquo;Last
          updated&rdquo; date above. If the changes are material, we will endeavour to notify
          registered users. Your continued use of the Service after any changes constitutes acceptance
          of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection heading="11. Governing law">
        <p>
          These Terms are governed by the laws of England and Wales. Any disputes arising out of or
          in connection with these Terms shall be subject to the exclusive jurisdiction of the courts
          of England and Wales.
        </p>
      </LegalSection>

      <LegalSection heading="12. Contact">
        <p>
          If you have any questions about these Terms, please contact us via the{" "}
          <Link href="/report" className="text-white underline underline-offset-2 hover:no-underline">
            contact form
          </Link>{" "}
          or submit a query through your account.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
