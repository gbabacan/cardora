import Link from "next/link";
import Image from "next/image";
import SharedFooter from "../SharedFooter";
import TemplatesNav from "./TemplatesNav";
import TemplatesContent from "./TemplatesContent";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <TemplatesNav />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* H1 + subtitle — server-rendered */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F2A] mb-3">
            Templates
            <span className="sr-only"> — Digital Greeting Card Templates for Every Occasion</span>
          </h1>
          <p className="text-base md:text-lg text-[#5B6B75]">
            Choose from our pre-designed templates to get started quickly
          </p>
        </div>

        {/* Filters + template grid — client component */}
        <TemplatesContent />
      </main>
      <SharedFooter />
    </div>
  );
}
