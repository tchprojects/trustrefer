import type { Metadata } from "next";
import {
  LegalLayout,
  LegalSection,
  LegalList,
} from "@/components/legal/LegalLayout";
import { ReportForm } from "@/components/legal/ReportForm";

export const metadata: Metadata = {
  title: "Report a Link — TrustRefer",
};

export default function ReportPage() {
  return (
    <LegalLayout
      title="Report a Link"
      subtitle="Help us keep TrustRefer accurate and trustworthy."
    >
      <p>
        We rely on our community to keep TrustRefer accurate and trustworthy. If you&apos;ve spotted
        a referral link that&apos;s out of date, misleading, broken, or otherwise problematic, please
        let us know using the form below.
      </p>
      <p>
        We review all reports and will take appropriate action, which may include contacting the
        submitter, removing the link, or updating its status.
      </p>

      <LegalSection heading="What can I report?">
        <LegalList
          items={[
            <><strong className="text-[#bbb]">Expired or outdated offer</strong> — the referral bonus, discount, or reward described no longer appears to be valid or has changed significantly.</>,
            <><strong className="text-[#bbb]">Inaccurate or misleading information</strong> — the description, reward claim, or other details are incorrect, exaggerated, or misleading.</>,
            <><strong className="text-[#bbb]">Broken link</strong> — the link does not work, leads to a 404 page, or redirects to an unrelated destination.</>,
            <><strong className="text-[#bbb]">Spam or low-quality submission</strong> — the link appears to be spam, has been submitted multiple times, or adds no genuine value.</>,
            <><strong className="text-[#bbb]">Inappropriate or abusive content</strong> — the link or description contains offensive, abusive, or otherwise inappropriate material.</>,
            <><strong className="text-[#bbb]">Other</strong> — something else is wrong that doesn&apos;t fit the categories above.</>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="Submit a report">
        <ReportForm />
      </LegalSection>

      <LegalSection heading="What happens next?">
        <LegalList
          items={[
            "Your report is logged and reviewed by the TrustRefer moderation team.",
            "We may contact the submitter to request a correction or removal.",
            "If a link is found to be inaccurate, broken, or in breach of our Terms of Use, we will update or remove it.",
            "We may not be able to respond individually to every report, but we review all submissions.",
          ]}
        />
        <p>Thank you for helping keep TrustRefer useful and honest.</p>
      </LegalSection>
    </LegalLayout>
  );
}
