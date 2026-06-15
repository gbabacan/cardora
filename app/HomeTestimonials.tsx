"use client";

import { useState, useEffect } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Cardora makes it so easy for our team to celebrate birthdays and big wins. Everyone feels included, no matter where they are.",
    name: "Lisa M.",
    title: "People Operations Manager, BrightWorks",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces",
  },
  {
    id: 2,
    quote: "Cardora is easy to use, both for the person developing the board and the folks contributing. This was also the first time I created a book from the posts. It was easy to use and personalize, and the recipient appreciated both the electronic and bound versions. It has been a convenient, helpful tool in celebrating our colleagues.",
    name: "Mellisa M.",
    title: "Vice President, CX Integrations",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces",
  },
  {
    id: 3,
    quote: "My best friend moved across the country, and I wanted to do something special for his 30th birthday. Cardora helped me collect messages and photos from all his old friends. When he saw it, he was genuinely moved. Perfect way to show someone they're remembered.",
    name: "David K.",
    title: "Friend & Birthday Organizer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
  },
  {
    id: 4,
    quote: "We used Cardora to welcome our colleague's new baby girl. Everyone shared their favorite parenting advice and well-wishes. It was such a thoughtful way to celebrate this new chapter, and she told us she keeps coming back to read the messages.",
    name: "Jennifer T.",
    title: "Team Lead, Marketing",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
  },
  {
    id: 5,
    quote: "For our annual Christmas celebration, we wanted something more personal than a generic card. Cardora let our entire department share holiday memories and gratitude. It brought our team closer together during the busy season.",
    name: "Robert C.",
    title: "Director of Operations, TechStart Inc.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces",
  },
];

export default function HomeTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevTestimonial = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      setIsAnimating(false);
    }, 300);
  };

  // Auto-play every 4 seconds
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 md:py-10 bg-[#E8F5F4]">
      <div className="w-11/12 md:w-4/5 mx-auto">
        {/* Mobile: stacked layout */}
        <div className="flex flex-col md:hidden gap-4">
          <div className={`flex items-start gap-4 transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <img src={TESTIMONIALS[currentTestimonial].image} alt={TESTIMONIALS[currentTestimonial].name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <svg className="w-8 h-8 text-[#2CB1A6] mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
              </svg>
              <p className="text-sm text-[#0B1F2A] leading-relaxed mb-3">{TESTIMONIALS[currentTestimonial].quote}</p>
              <p className="font-bold text-[#0B1F2A] text-sm">— {TESTIMONIALS[currentTestimonial].name}</p>
              <p className="text-[#5B6B75] text-xs">{TESTIMONIALS[currentTestimonial].title}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={prevTestimonial} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E5EAF0]" aria-label="Previous">
              <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button key={index} onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentTestimonial ? 'bg-[#2CB1A6]' : 'bg-[#E5EAF0]'}`}
                  aria-label={`Go to testimonial ${index + 1}`} />
              ))}
            </div>
            <button onClick={nextTestimonial} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E5EAF0]" aria-label="Next">
              <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Desktop: horizontal layout */}
        <div className="hidden md:flex items-center gap-8 h-48">
          <div className="flex-shrink-0">
            <div className={`w-28 h-28 rounded-full overflow-hidden transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <img src={TESTIMONIALS[currentTestimonial].image} alt={TESTIMONIALS[currentTestimonial].name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className={`flex-1 h-full flex flex-col justify-center transition-all duration-500 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <svg className="w-14 h-14 text-[#2CB1A6] mb-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
            <p className="text-lg text-[#0B1F2A] leading-relaxed mb-4">{TESTIMONIALS[currentTestimonial].quote}</p>
            <div>
              <p className="font-bold text-[#0B1F2A]">— {TESTIMONIALS[currentTestimonial].name}</p>
              <p className="text-[#5B6B75]">{TESTIMONIALS[currentTestimonial].title}</p>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-6">
            <button onClick={prevTestimonial} className="w-12 h-12 rounded-full bg-white hover:bg-[#F7FAFC] flex items-center justify-center transition-colors shadow-sm border border-[#E5EAF0]" aria-label="Previous testimonial">
              <svg className="w-6 h-6 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button key={index} onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentTestimonial ? 'bg-[#2CB1A6]' : 'bg-[#E5EAF0]'}`}
                  aria-label={`Go to testimonial ${index + 1}`} />
              ))}
            </div>
            <button onClick={nextTestimonial} className="w-12 h-12 rounded-full bg-white hover:bg-[#F7FAFC] flex items-center justify-center transition-colors shadow-sm border border-[#E5EAF0]" aria-label="Next testimonial">
              <svg className="w-6 h-6 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
