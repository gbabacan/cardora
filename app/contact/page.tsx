import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import ContactNav from "./ContactNav";
import ContactFormSection from "./ContactFormSection";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Interactive header — client component */}
      <ContactNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* H1 — server-rendered, Google reads this immediately */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-3">
            Get in Touch
            <span className="sr-only"> — Contact Cardora, Digital Greeting Cards</span>
          </h1>
          <p className="text-base md:text-lg text-[#5B6B75]">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        {/* Form + Lottie — client component */}
        <ContactFormSection />
      </main>
      <SharedFooter />
    </div>
  );
}
