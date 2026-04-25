import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalLayout,
  LegalSection,
  LegalSubSection,
  LegalList,
  LegalCallout,
} from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — TrustRefer",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      effectiveDate="01 May 2026"
      lastUpdated="01 May 2026"
    >
      <p>
        This Privacy Policy explains how Bajaj IT Services Ltd (&ldquo;TrustRefer&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses, stores, and shares
        personal data when you use our website and platform at trustrefer.co.uk (the
        &ldquo;Service&rdquo;).
      </p>
      <p>
        We are committed to handling your personal data responsibly and in compliance with the UK
        General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
      </p>

      <LegalSection heading="1. Who we are">
        <div className="rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] px-4 py-3 space-y-1">
          <p className="font-medium text-[#999]">Data controller</p>
          <p>Bajaj IT Services Ltd</p>
          <p>Company number: 09115792</p>
        </div>
        <p>
          For privacy-related queries, please use the form on our{" "}
          <Link href="/report" className="text-white underline underline-offset-2 hover:no-underline">
            contact page
          </Link>{" "}
          or submit a request through your account settings.
        </p>
      </LegalSection>

      <LegalSection heading="2. What data we collect">
        <LegalSubSection heading="a) Account and profile information">
          <p>
            When you register for an account, we collect your name, email address, and any profile
            information you choose to provide. We may also store your membership tier and account
            preferences.
          </p>
        </LegalSubSection>

        <LegalSubSection heading="b) Referral submissions">
          <p>
            When you submit a referral link, we collect the submitted URL, brand name, category, any
            description or notes you provide, and metadata such as submission timestamp and status.
          </p>
        </LegalSubSection>

        <LegalSubSection heading="c) Analytics and usage data">
          <p>
            We collect data about how you interact with the platform, including pages visited, referral
            links clicked, click timestamps, and approximate geolocation inferred from IP address. This
            helps us understand platform usage and improve the Service.
          </p>
        </LegalSubSection>

        <LegalSubSection heading="d) Technical data">
          <p>
            We automatically collect your IP address, browser type, device type, operating system, and
            session data when you use the Service.
          </p>
        </LegalSubSection>

        <LegalSubSection heading="e) Communications and support">
          <p>
            If you contact us via a form or support channel, we retain the content of your message and
            any information you provide so we can respond to and resolve your query.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection heading="3. How we use your data">
        <div className="overflow-x-auto rounded-lg border border-[#1f1f1f]">
          <table className="w-full text-xs">
            <thead className="border-b border-[#1f1f1f]">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-[#555]">Purpose</th>
                <th className="px-4 py-2.5 text-left font-medium text-[#555]">Lawful basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111]">
              {[
                ["Providing and managing your account", "Performance of contract"],
                ["Displaying your submitted referral links", "Performance of contract"],
                ["Processing and moderating submissions", "Legitimate interests"],
                ["Tracking link clicks and platform analytics", "Legitimate interests"],
                ["Improving the Service and user experience", "Legitimate interests"],
                ["Sending service-related communications", "Performance of contract / legitimate interests"],
                ["Detecting and preventing abuse or fraud", "Legitimate interests / legal obligation"],
                ["Complying with legal obligations", "Legal obligation"],
              ].map(([purpose, basis]) => (
                <tr key={purpose} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 text-[#888]">{purpose}</td>
                  <td className="px-4 py-2.5 text-[#666]">{basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection heading="4. Cookies">
        <p>
          We use cookies and similar tracking technologies on TrustRefer. For full details, please see
          our{" "}
          <Link
            href="/cookies"
            className="text-white underline underline-offset-2 hover:no-underline"
          >
            Cookie Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="5. Sharing your data">
        <p>We do not sell your personal data. We may share it with:</p>

        <LegalSubSection heading="Service providers">
          <p>
            We work with third-party providers (for example, hosting infrastructure, analytics tools,
            and email delivery services) who process data on our behalf under appropriate data
            processing agreements.
          </p>
        </LegalSubSection>

        <LegalSubSection heading="Legal and regulatory authorities">
          <p>
            We may disclose data where required by law, court order, or regulatory requirement, or
            where necessary to protect the rights and safety of TrustRefer or others.
          </p>
        </LegalSubSection>

        <LegalSubSection heading="Business transfers">
          <p>
            In the event of a merger, acquisition, or sale of assets, your data may be transferred to
            a successor entity. We will notify users where required by law.
          </p>
        </LegalSubSection>

        <p>We do not share your personal data with third-party advertisers or data brokers.</p>
      </LegalSection>

      <LegalSection heading="6. Data retention">
        <p>
          We retain your personal data for as long as your account is active and for a reasonable
          period thereafter, or as long as necessary to fulfil the purposes described in this policy.
          Account data is typically deleted or anonymised within 12 months of account closure unless a
          longer retention period is required by law.
        </p>
        <p>
          Click and analytics data may be retained in aggregated or anonymised form for longer periods.
        </p>
      </LegalSection>

      <LegalSection heading="7. International transfers">
        <p>
          Where we use service providers that process data outside the UK, we ensure that appropriate
          safeguards are in place in accordance with UK GDPR requirements, such as UK International
          Data Transfer Agreements or equivalent adequacy mechanisms.
        </p>
      </LegalSection>

      <LegalSection heading="8. Your rights">
        <p>Under UK data protection law, you have the following rights:</p>
        <LegalList
          items={[
            <><strong className="text-[#bbb]">Access</strong> — you can request a copy of the personal data we hold about you</>,
            <><strong className="text-[#bbb]">Rectification</strong> — you can ask us to correct inaccurate data</>,
            <><strong className="text-[#bbb]">Erasure</strong> — you can request deletion of your data in certain circumstances</>,
            <><strong className="text-[#bbb]">Restriction</strong> — you can ask us to restrict processing in certain circumstances</>,
            <><strong className="text-[#bbb]">Portability</strong> — you can request your data in a portable format where applicable</>,
            <><strong className="text-[#bbb]">Objection</strong> — you can object to processing based on legitimate interests</>,
            <><strong className="text-[#bbb]">Withdrawal of consent</strong> — where processing is based on consent, you may withdraw it at any time</>,
          ]}
        />
        <p>
          To exercise any of these rights, please submit a request via your account settings or
          through the{" "}
          <Link href="/report" className="text-white underline underline-offset-2 hover:no-underline">
            contact form
          </Link>
          .
        </p>
        <LegalCallout>
          You also have the right to lodge a complaint with the Information Commissioner&apos;s Office
          (ICO) at{" "}
          <a
            href="https://ico.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-2 hover:no-underline"
          >
            ico.org.uk
          </a>{" "}
          if you believe your data has been handled unlawfully.
        </LegalCallout>
      </LegalSection>

      <LegalSection heading="9. Security">
        <p>
          We take reasonable technical and organisational measures to protect your personal data
          against unauthorised access, loss, or misuse. However, no system is entirely secure and we
          cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="10. Children">
        <p>
          TrustRefer is not intended for use by anyone under the age of 18. We do not knowingly
          collect personal data from children. If you believe a child has provided us with personal
          data, please contact us and we will take steps to delete it.
        </p>
      </LegalSection>

      <LegalSection heading="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at
          the top of this page will reflect any changes. For significant changes, we will endeavour to
          notify registered users via the platform.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
