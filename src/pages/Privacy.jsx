import React from "react";
import PageHeader from "@/components/PageHeader";
import LegalDoc from "@/components/LegalDoc";
import Seo from "@/components/Seo";

const sections = [
  {
    h: "Who we are",
    body: [
      "PilotHobb is a digital pilot logbook operated by Linkzone Global FZCO (“PilotHobb”, “we”, “us”). This policy explains what personal information we collect, why, and the choices you have.",
    ],
  },
  {
    h: "Information we collect",
    body: ["We collect only what we need to run your logbook:"],
    list: [
      "Account details — your name, email address, and password (stored encrypted).",
      "Logbook data you enter — flights, aircraft, hours, licences, medicals, endorsements and related records.",
      "Uploaded files — documents or photos you attach to your records.",
      "Usage and device data — basic technical information (app version, device type, error logs) used to keep the service reliable.",
    ],
  },
  {
    h: "How we use your information",
    body: ["We use your information to:"],
    list: [
      "Provide the logbook, calculate totals and currency, and generate exports.",
      "Secure your account and prevent fraud or abuse.",
      "Respond to support requests and send essential service notices.",
      "Improve reliability and features through aggregated, non-identifying analytics.",
    ],
  },
  {
    h: "Your data is yours",
    body: [
      "Your logbook belongs to you. You can export it to PDF or CSV at any time, and you can request deletion of your account and associated data. We do not sell your personal information.",
    ],
  },
  {
    h: "Sharing",
    body: [
      "We share personal data only with service providers that help us operate PilotHobb (for example, cloud hosting), under contracts that require them to protect it. We may disclose information if required by law.",
    ],
  },
  {
    h: "Security & retention",
    body: [
      "We use industry-standard measures including encryption in transit and at rest, and access controls. We retain your data for as long as your account is active, and remove it within a reasonable period after you delete your account, except where retention is legally required.",
    ],
  },
  {
    h: "Your rights",
    body: [
      "Depending on where you live, you may have rights to access, correct, export, or delete your personal data, and to object to certain processing. To exercise any of these, contact us at hello@pilothobb.com.",
    ],
  },
  {
    h: "Your rights under POPIA (South Africa) and UAE PDPL",
    body: [
      "We hold your profile details, your flight records, the documents you upload, and payment references. We never store card numbers — card payments are processed by Tap.",
      "Our lawful basis for processing this data is performance of our contract with you (providing the logbook service).",
      "You can access, correct, and delete your data at any time. Account and data deletion is available in-app via Settings → Delete account.",
      "Your data is hosted on Base44 infrastructure. We do not sell your personal data.",
      "To make a request under POPIA or the UAE PDPL, contact us at hello@pilothobb.com.",
    ],
  },
  {
    h: "Children",
    body: [
      "PilotHobb is intended for pilots and is not directed to children under 16. We do not knowingly collect data from children.",
    ],
  },
  {
    h: "Changes",
    body: [
      "We may update this policy from time to time. Material changes will be announced in the app or by email, and the “last updated” date above will change.",
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <Seo
        path="/privacy"
        title="Privacy Policy | PilotHobb"
        description="How PilotHobb, the digital pilot logbook, collects, uses and protects your personal information — and how you stay in control of your data."
      />
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Plain-language summary of how we handle your data." />
      <LegalDoc
        updated="10 August 2026"
        intro="This is a starting template and should be reviewed by your legal counsel before launch to ensure it reflects your actual data practices and applicable law."
        sections={sections}
      />
    </>
  );
}
