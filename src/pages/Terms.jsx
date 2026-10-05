import React from "react";
import PageHeader from "@/components/PageHeader";
import LegalDoc from "@/components/LegalDoc";
import Seo from "@/components/Seo";

const sections = [
  {
    h: "Acceptance of terms",
    body: [
      "By creating an account or using PilotHobb (the “Service”), operated by Linkzone Global FZCO, you agree to these Terms of Service. If you do not agree, please do not use the Service.",
    ],
  },
  {
    h: "The Service",
    body: [
      "PilotHobb is a digital logbook for recording flight and RPAS (drone) activity, tracking currency, and exporting records. It is a record-keeping tool and does not replace official documents, regulatory advice, or the judgement of a pilot in command.",
    ],
  },
  {
    h: "Your account",
    body: [
      "You are responsible for keeping your login credentials secure and for all activity under your account. You must provide accurate information and are responsible for the accuracy of the entries you record.",
    ],
  },
  {
    h: "Acceptable use",
    body: ["You agree not to:"],
    list: [
      "Use the Service unlawfully or to store unlawful content.",
      "Attempt to disrupt, reverse-engineer, or gain unauthorised access to the Service.",
      "Resell or redistribute the Service except under an agreed partner or academy arrangement.",
    ],
  },
  {
    h: "Your content",
    body: [
      "You retain ownership of the data and files you add. You grant us a limited licence to store and process that content solely to provide the Service to you. You can export or delete your content at any time.",
    ],
  },
  {
    h: "Accuracy & compliance disclaimer",
    body: [
      "While PilotHobb is designed around how pilots log worldwide, you remain responsible for meeting the specific requirements of your aviation authority. We do not warrant that automatic calculations or exports satisfy any particular regulator, and you should verify your records before relying on them.",
    ],
  },
  {
    h: "Subscriptions & billing",
    body: [
      "Paid plans are billed in advance on the interval shown at purchase. Prices displayed before launch are indicative and may change. You can cancel at any time; access continues until the end of the current billing period, and your data remains exportable.",
    ],
  },
  {
    h: "Availability",
    body: [
      "We work to keep the Service available and reliable, but it is provided “as is” without warranty of uninterrupted operation. We may update, suspend, or discontinue features with reasonable notice.",
    ],
  },
  {
    h: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, PilotHobb and Linkzone Global FZCO are not liable for indirect or consequential losses, or for any loss arising from reliance on records or calculations that you did not independently verify.",
    ],
  },
  {
    h: "Governing law",
    body: [
      "These Terms are governed by the laws of the United Arab Emirates. The Service is provided by Linkzone Global FZCO, Dubai.",
    ],
  },
  {
    h: "Refunds",
    body: [
      "Annual plans: a 14-day refund is available if fewer than 10 flights have been logged after purchase. Monthly plans can be cancelled at any time; there is no refund for the current month.",
    ],
  },
  {
    h: "School plan billing",
    body: [
      "School plans are invoiced yearly and require a minimum of 10 seats.",
    ],
  },
  {
    h: "Contact",
    body: [
      "Questions about these terms can be sent to hello@linkzoneglobal.com.",
    ],
  },
];

export default function Terms() {
  return (
    <>
      <Seo
        path="/terms"
        title="Terms of Service | PilotHobb"
        description="The terms governing your use of PilotHobb, the digital pilot logbook for manned and RPAS (drone) flying."
      />
      <PageHeader eyebrow="Legal" title="Terms of Service" subtitle="The agreement between you and PilotHobb." />
      <LegalDoc
        updated="10 August 2026"
        intro="This is a starting template and should be reviewed by your legal counsel before launch to ensure it fits your business and jurisdiction."
        sections={sections}
      />
    </>
  );
}
