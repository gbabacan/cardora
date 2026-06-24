import Link from "next/link";
import Image from "next/image";
import SharedFooter from "@/app/SharedFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Cardora",
  description: "Learn how Cardora collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "June 23, 2026";
const CONTACT_EMAIL = "privacy@cardora.com";
const APP_URL = "https://cardora.com";

const sections = [
  {
    id: "overview",
    title: "1. Overview",
    content: (
      <>
        <p>
          Cardora ("we," "us," or "our") operates the Cardora digital greeting card platform (the "Service") available at{" "}
          <a href={APP_URL} className="text-[#2CB1A6] hover:underline">{APP_URL}</a>. This Privacy Policy explains what personal
          information we collect, why we collect it, how we use and protect it, and your rights regarding that information.
        </p>
        <p className="mt-3">
          By using the Service, you agree to the collection and use of information in accordance with this policy. If you do
          not agree, please do not use the Service.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content: (
      <>
        <h3 className="font-semibold text-[#0B1F2A] mt-4 mb-2">2.1 Information You Provide Directly</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Name and email address (when registering with email and password)</li>
          <li>Card and board content you create (titles, messages, uploaded images, GIFs)</li>
          <li>Recipient names and email addresses you enter for card delivery</li>
          <li>Messages and communications you send us (e.g., via the contact form)</li>
        </ul>

        <h3 className="font-semibold text-[#0B1F2A] mt-5 mb-2">2.2 Information Collected via Google Sign-In (OAuth 2.0)</h3>
        <p>
          When you choose to sign in with Google, we request access only to your <strong>basic profile information</strong> via
          Google's OAuth 2.0 service. Specifically, we receive:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Your Google account email address</li>
          <li>Your display name</li>
          <li>Your Google profile photo URL (used only as an avatar within the Service)</li>
          <li>A unique Google account identifier (used solely to authenticate your session)</li>
        </ul>
        <p className="mt-3 p-3 bg-[#E8F5F4] rounded-lg border-l-4 border-[#2CB1A6] text-sm">
          <strong>Important:</strong> We do <strong>not</strong> request access to your Gmail inbox, Google Drive, contacts,
          calendar, or any other Google service beyond the basic profile scope. We do <strong>not</strong> store your Google
          password. We do <strong>not</strong> use your Google data for advertising. We do <strong>not</strong> share your
          Google profile information with any third party.
        </p>

        <h3 className="font-semibold text-[#0B1F2A] mt-5 mb-2">2.3 Information Collected via Facebook & LinkedIn Sign-In</h3>
        <p>
          If you choose to sign in with Facebook or LinkedIn, we similarly receive only your basic public profile — name,
          email address, and profile photo — under the same restrictions described above.
        </p>

        <h3 className="font-semibold text-[#0B1F2A] mt-5 mb-2">2.4 Automatically Collected Information</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Browser type and version, operating system, and device type</li>
          <li>IP address and approximate geographic region (country/city level)</li>
          <li>Pages visited, time spent on pages, and navigation paths within the Service</li>
          <li>Referring URLs and search terms used to reach the Service</li>
          <li>Session cookies necessary to keep you logged in</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect solely to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li><strong>Provide the Service</strong> — create and manage your account, store your cards and boards, and deliver them to recipients</li>
          <li><strong>Authenticate you</strong> — verify your identity when you sign in, including via Google, Facebook, or LinkedIn OAuth</li>
          <li><strong>Send transactional emails</strong> — delivery notifications, card invites, and account-related communications (e.g., password reset)</li>
          <li><strong>Improve the Service</strong> — analyse aggregate, anonymised usage patterns to fix bugs and improve features</li>
          <li><strong>Respond to support requests</strong> — address questions or issues you submit via the contact form</li>
          <li><strong>Comply with legal obligations</strong> — retain records as required by applicable law</li>
        </ul>
        <p className="mt-3">
          We do <strong>not</strong> use your personal data for advertising, profiling, or automated decision-making that
          produces legal or similarly significant effects.
        </p>
      </>
    ),
  },
  {
    id: "data-sharing",
    title: "4. Data Sharing and Disclosure",
    content: (
      <>
        <p className="p-3 bg-[#E8F5F4] rounded-lg border-l-4 border-[#2CB1A6] text-sm font-medium">
          We do not sell, rent, trade, or otherwise share your personal information with third parties for their own
          marketing or commercial purposes — ever.
        </p>
        <p className="mt-4">We share data only in the following limited circumstances:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>
            <strong>Service providers acting on our behalf:</strong> We use Supabase (database and authentication
            infrastructure) and Resend (transactional email delivery). These sub-processors receive only the minimum data
            necessary to perform their function and are contractually prohibited from using it for any other purpose.
          </li>
          <li>
            <strong>Card recipients:</strong> When you send a card or board, the recipient's name and any message you
            compose are shared with that recipient — this is the core function of the Service and is done at your explicit
            direction.
          </li>
          <li>
            <strong>Legal requirements:</strong> We may disclose personal data if required to do so by law, court order,
            or government authority, or to protect the rights, property, or safety of Cardora, our users, or the public.
          </li>
          <li>
            <strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may
            be transferred to the successor entity, who will be bound by this Privacy Policy.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-storage",
    title: "5. Data Storage and Security",
    content: (
      <>
        <p>
          Your data is stored on Supabase's infrastructure, hosted on Amazon Web Services (AWS) servers in the United
          States. We implement the following security measures:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>All data is transmitted over HTTPS (TLS 1.2+) — never in plain text</li>
          <li>Passwords are hashed using bcrypt and are never stored in recoverable form</li>
          <li>OAuth tokens are managed by Supabase Auth and are never stored in our application layer</li>
          <li>Database access is restricted by row-level security (RLS) policies — each user can only access their own data</li>
          <li>API keys and secrets are stored as environment variables and never exposed in client-side code</li>
          <li>We conduct periodic security reviews and keep all dependencies up to date</li>
        </ul>
        <p className="mt-3">
          While we take security seriously, no method of transmission or storage is 100% secure. We encourage you to use
          a strong, unique password and to contact us immediately if you suspect unauthorised access to your account.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    content: (
      <>
        <p>We retain your personal data for as long as your account is active or as needed to provide the Service.</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>
            <strong>Account data</strong> (name, email, profile photo): retained until you delete your account
          </li>
          <li>
            <strong>Cards and boards</strong>: retained until you delete them or delete your account
          </li>
          <li>
            <strong>Transactional email logs</strong>: retained for up to 90 days for delivery confirmation purposes
          </li>
          <li>
            <strong>Server logs</strong> (IP addresses, access logs): retained for up to 30 days for security and
            debugging purposes, then automatically purged
          </li>
        </ul>
        <p className="mt-3">
          Upon account deletion, we will remove or anonymise your personal data within 30 days, except where we are
          required to retain it for legal compliance.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "7. Cookies",
    content: (
      <>
        <p>We use the following types of cookies:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>
            <strong>Essential session cookies</strong> — required to keep you logged in and to protect your session.
            These cannot be disabled without breaking core functionality.
          </li>
          <li>
            <strong>Preference cookies</strong> — store lightweight UI preferences (e.g., last selected template).
          </li>
        </ul>
        <p className="mt-3">
          We do <strong>not</strong> use advertising cookies, tracking pixels, or third-party analytics cookies
          that follow you across other websites.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    content: (
      <>
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
          <li><strong>Correction</strong> — request that we correct inaccurate or incomplete data</li>
          <li><strong>Deletion</strong> — request that we delete your personal data ("right to be forgotten")</li>
          <li><strong>Portability</strong> — request your data in a structured, machine-readable format</li>
          <li><strong>Restriction</strong> — request that we limit processing of your data in certain circumstances</li>
          <li><strong>Objection</strong> — object to processing based on legitimate interests</li>
          <li>
            <strong>Withdraw consent</strong> — revoke OAuth access at any time via{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2CB1A6] hover:underline"
            >
              Google's security settings
            </a>
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2CB1A6] hover:underline">{CONTACT_EMAIL}</a>.
          We will respond within 30 days. EU/EEA residents may also lodge a complaint with their local data protection
          authority.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: (
      <p>
        The Service is not directed to children under the age of 13 (or 16 in the EEA). We do not knowingly collect
        personal information from children. If we discover we have inadvertently collected data from a child, we will
        delete it immediately. If you believe we have collected information from a child, please contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2CB1A6] hover:underline">{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
  {
    id: "international",
    title: "10. International Data Transfers",
    content: (
      <p>
        Cardora is based in the United States. If you access the Service from outside the United States, your
        information may be transferred to, stored, and processed in the United States. We rely on standard contractual
        clauses and other appropriate safeguards for cross-border transfers in compliance with applicable data protection
        laws, including the GDPR.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "11. Third-Party Links",
    content: (
      <p>
        The Service may contain links to external websites. We are not responsible for the privacy practices of those
        sites and encourage you to review their privacy policies. This Privacy Policy applies solely to information
        collected by Cardora.
      </p>
    ),
  },
  {
    id: "changes",
    title: "12. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at
        the top of this page and, for material changes, notify you via email or a prominent notice within the Service.
        Your continued use of the Service after changes take effect constitutes acceptance of the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "13. Contact Us",
    content: (
      <>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
        <div className="mt-4 p-4 bg-[#F7FAFC] rounded-xl border border-[#E5EAF0]">
          <p className="font-semibold text-[#0B1F2A]">Cardora</p>
          <p className="mt-1">
            Email:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#2CB1A6] hover:underline">{CONTACT_EMAIL}</a>
          </p>
          <p>
            Website:{" "}
            <a href={APP_URL} className="text-[#2CB1A6] hover:underline">{APP_URL}</a>
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5EAF0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/cardoraLogo.png" alt="Cardora" width={160} height={48} className="h-10 w-auto" />
            <span className="text-xl font-bold text-[#2CB1A6]">Cardora</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#5B6B75] hover:text-[#2CB1A6] transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86] py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Last Updated: {LAST_UPDATED}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-white/90 text-lg">
            We believe privacy is a right, not a feature. Here's exactly what we collect, why, and how we protect it.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Table of Contents — sticky sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-widest text-[#5B6B75] mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-[#5B6B75] hover:text-[#2CB1A6] transition-colors py-1 leading-snug"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Policy sections */}
          <main className="flex-1 min-w-0">
            <div className="space-y-10">
              {sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  className="bg-white rounded-2xl border border-[#E5EAF0] p-8 scroll-mt-28"
                >
                  <h2 className="text-xl font-bold text-[#0B1F2A] mb-4 pb-3 border-b border-[#E5EAF0]">
                    {s.title}
                  </h2>
                  <div className="text-[#5B6B75] leading-relaxed text-sm">{s.content}</div>
                </section>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86] rounded-2xl p-8 text-center text-white">
              <h3 className="text-xl font-bold mb-2">Questions about your privacy?</h3>
              <p className="text-white/90 text-sm mb-4">
                We're happy to explain anything in plain language.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block bg-white text-[#2CB1A6] font-semibold px-6 py-3 rounded-full hover:bg-[#F7FAFC] transition-colors text-sm"
              >
                Contact Us at {CONTACT_EMAIL}
              </a>
            </div>
          </main>
        </div>
      </div>

      <SharedFooter />
    </div>
  );
}
