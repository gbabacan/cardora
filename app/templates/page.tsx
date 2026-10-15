import Link from "next/link";
import SharedFooter from "../SharedFooter";
import TemplatesNav from "./TemplatesNav";
import TemplatesContent from "./TemplatesContent";
import { fetchPublicTemplates } from "@/lib/publicTemplates";

// Rendered on the server so the templates are in the HTML search engines
// read, and refreshed at most every 5 minutes. The browser re-fetches after
// loading, so template changes from the admin page show up straight away.
export const revalidate = 300;

// Occasion landing pages, linked below the templates so each occasion's
// templates and its guide page point at each other.
const OCCASION_PAGES = [
  { href: "/birthday-cards", label: "Birthday cards", text: "Group birthday cards the whole team or family can sign." },
  { href: "/farewell-cards", label: "Farewell cards", text: "Send off a colleague or friend with messages from everyone." },
  { href: "/thank-you-cards", label: "Thank you cards", text: "Say thanks together, or write a personal note of your own." },
  { href: "/work-anniversary-cards", label: "Work anniversary cards", text: "Celebrate years at the company with the whole team." },
  { href: "/retirement-cards", label: "Retirement cards", text: "Collect memories and well wishes for a retiring colleague." },
  { href: "/employee-appreciation-cards", label: "Employee appreciation cards", text: "Recognise great work, from you or the whole team." },
  { href: "/promotion-cards", label: "Promotion cards", text: "Congratulate a colleague on their new role." },
  { href: "/team-celebration-cards", label: "Team celebration cards", text: "Mark a launch, a win or a milestone together." },
  { href: "/congratulations-cards", label: "Congratulations cards", text: "For any achievement worth celebrating." },
  { href: "/wedding-cards", label: "Wedding cards", text: "A digital guestbook every guest can sign." },
  { href: "/new-baby-cards", label: "New baby cards", text: "Welcome a new arrival with messages from everyone." },
  { href: "/graduation-cards", label: "Graduation cards", text: "Celebrate a graduate with the whole class or family." },
  { href: "/christmas-cards", label: "Christmas cards", text: "Season's greetings from the whole team." },
  { href: "/valentines-cards", label: "Valentine's Day cards", text: "A personal card for someone special." },
];

export default async function TemplatesPage() {
  const initialTemplates = await fetchPublicTemplates().catch(() => null);

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <TemplatesNav />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-5 md:mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F2A]">
            Templates
            <span className="sr-only"> — Digital Greeting Card Templates for Every Occasion</span>
          </h1>
          <p className="text-sm md:text-base text-[#5B6B75]">
            Choose from our pre-designed templates to get started quickly
          </p>
        </div>

        {/* Filters + template grid — client component, server-rendered with data */}
        <TemplatesContent initialTemplates={initialTemplates} />

        <section className="mt-16 border-t border-[#E5EAF0] pt-10" aria-labelledby="occasion-guides">
          <h2 id="occasion-guides" className="text-xl md:text-2xl font-bold text-[#0B1F2A]">
            Card ideas by occasion
          </h2>
          <p className="mt-1 text-sm md:text-base text-[#5B6B75]">
            Tips, examples and the best templates for each occasion.
          </p>
          <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {OCCASION_PAGES.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="group block">
                  <span className="font-semibold text-[#0B1F2A] group-hover:text-[#2CB1A6]">{page.label}</span>
                  <span className="block text-sm text-[#5B6B75]">{page.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SharedFooter />
    </div>
  );
}
