"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { getOccasionsWithLottieData, OccasionWithLottieData } from "@/lib/occasions";

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

export default function Home() {
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [alternateText, setAlternateText] = useState<'together' | 'individually'>('together');
  const [currentHeroItem, setCurrentHeroItem] = useState(0);
  const [heroLottie1, setHeroLottie1] = useState<any>(null);
  const [heroLottie2, setHeroLottie2] = useState<any>(null);
  const [heroLottie3, setHeroLottie3] = useState<any>(null);
  const [heroLottie4, setHeroLottie4] = useState<any>(null);
  const [heroLottie5, setHeroLottie5] = useState<any>(null);
  const [occasions, setOccasions] = useState<any[]>([]);
  const [occasionsLoading, setOccasionsLoading] = useState(true);
  const [howItWorksLottie1, setHowItWorksLottie1] = useState<any>(null);
  const [howItWorksLottie2, setHowItWorksLottie2] = useState<any>(null);
  const [howItWorksLottie3, setHowItWorksLottie3] = useState<any>(null);
  const [howItWorksLottie4, setHowItWorksLottie4] = useState<any>(null);
  const [currentHowItWorksItem, setCurrentHowItWorksItem] = useState(0);
  const [birthdayExampleLottie, setBirthdayExampleLottie] = useState<any>(null);
  const [weddingExampleLottie, setWeddingExampleLottie] = useState<any>(null);
  const [newBabyExampleLottie, setNewBabyExampleLottie] = useState<any>(null);
  const [congratulationsExampleLottie, setCongratulationsExampleLottie] = useState<any>(null);
  const [farewellExampleLottie, setFarewellExampleLottie] = useState<any>(null);
  const [teamCelebrationExampleLottie, setTeamCelebrationExampleLottie] = useState<any>(null);
  const [showFormatModal, setShowFormatModal] = useState(false);
  const [showWeddingFormatModal, setShowWeddingFormatModal] = useState(false);
  const [showNewBabyFormatModal, setShowNewBabyFormatModal] = useState(false);
  const [showCongratulationsFormatModal, setShowCongratulationsFormatModal] = useState(false);
  const [showFarewellFormatModal, setShowFarewellFormatModal] = useState(false);
  const [showTeamCelebrationFormatModal, setShowTeamCelebrationFormatModal] = useState(false);

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

  // Auto-play carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Alternate between "Together" and "Individually" every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAlternateText(prev => prev === 'together' ? 'individually' : 'together');
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Load hero section lotties
  useEffect(() => {
    fetch('/lotties/birthday/birthday1.json')
      .then(res => res.json())
      .then(data => setHeroLottie1(data))
      .catch(err => console.error('Error loading hero lottie 1:', err));

    fetch('/lotties/welcome/welcome4.json')
      .then(res => res.json())
      .then(data => setHeroLottie2(data))
      .catch(err => console.error('Error loading hero lottie 2:', err));

    fetch('/lotties/love/love3.json')
      .then(res => res.json())
      .then(data => setHeroLottie3(data))
      .catch(err => console.error('Error loading hero lottie 3:', err));

    fetch('/lotties/newbaby/baby1.json')
      .then(res => res.json())
      .then(data => setHeroLottie4(data))
      .catch(err => console.error('Error loading hero lottie 4:', err));

    fetch('/lotties/love/love2.json')
      .then(res => res.json())
      .then(data => setHeroLottie5(data))
      .catch(err => console.error('Error loading hero lottie 5:', err));

    // Load "How It Works" section lotties
    fetch('/lotties/love/love1.json')
      .then(res => res.json())
      .then(data => setHowItWorksLottie1(data))
      .catch(err => console.error('Error loading how it works lottie 1:', err));

    fetch('/lotties/love/love5.json')
      .then(res => res.json())
      .then(data => setHowItWorksLottie2(data))
      .catch(err => console.error('Error loading how it works lottie 2:', err));

    fetch('/lotties/newbaby/baby4.json')
      .then(res => res.json())
      .then(data => setHowItWorksLottie3(data))
      .catch(err => console.error('Error loading how it works lottie 3:', err));

    fetch('/lotties/christmas/christmas1.json')
      .then(res => res.json())
      .then(data => setHowItWorksLottie4(data))
      .catch(err => console.error('Error loading how it works lottie 4:', err));

    // Load birthday example lottie
    fetch('/lotties/birthday/birthday1.json')
      .then(res => res.json())
      .then(data => setBirthdayExampleLottie(data))
      .catch(err => console.error('Error loading birthday example lottie:', err));

    // Load wedding example lottie
    fetch('/lotties/wedding/wedding2.json')
      .then(res => res.json())
      .then(data => setWeddingExampleLottie(data))
      .catch(err => console.error('Error loading wedding example lottie:', err));

    // Load new baby example lottie
    fetch('/lotties/newbaby/baby1.json')
      .then(res => res.json())
      .then(data => setNewBabyExampleLottie(data))
      .catch(err => console.error('Error loading new baby example lottie:', err));

    // Load congratulations example lottie
    fetch('/lotties/congratulations/congratulations3.json')
      .then(res => res.json())
      .then(data => setCongratulationsExampleLottie(data))
      .catch(err => console.error('Error loading congratulations example lottie:', err));

    // Load farewell example lottie
    fetch('/lotties/farewell/farewell4.json')
      .then(res => res.json())
      .then(data => setFarewellExampleLottie(data))
      .catch(err => console.error('Error loading farewell example lottie:', err));

    // Load team celebration example lottie
    fetch('/lotties/teamcelebration/teamCelebration1.json')
      .then(res => res.json())
      .then(data => setTeamCelebrationExampleLottie(data))
      .catch(err => console.error('Error loading team celebration example lottie:', err));
  }, []);

  // Rotate hero items (image + 5 lotties) every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroItem(prev => (prev + 1) % 6);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Rotate "How It Works" lotties every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHowItWorksItem(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch occasions from database with their lottie animations
  useEffect(() => {
    async function fetchOccasions() {
      setOccasionsLoading(true);
      try {
        const { occasions, error } = await getOccasionsWithLottieData(15);

        if (error) {
          console.error('Error fetching occasions:', error);
        } else {
          setOccasions(occasions);
        }
      } catch (err) {
        console.error('Error in fetchOccasions:', err);
      } finally {
        setOccasionsLoading(false);
      }
    }

    fetchOccasions();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Team Celebration Format Selection Modal */}
      {showTeamCelebrationFormatModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowTeamCelebrationFormatModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
            >
              <svg className="w-5 h-5 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-[#0B1F2A] mb-2">Choose Format</h2>
            <p className="text-[#5B6B75] mb-6">Select which type of team celebration sample you&apos;d like to view</p>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/boards/3d06eddd/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowTeamCelebrationFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Board</h3>
                  <p className="text-sm text-[#5B6B75]">Multiple people add messages together</p>
                </div>
              </Link>
              <Link href="/cards/ea80cbc1/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowTeamCelebrationFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Card</h3>
                  <p className="text-sm text-[#5B6B75]">Perfect for a single contributor</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Farewell Format Selection Modal */}
      {showFarewellFormatModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowFarewellFormatModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
            >
              <svg className="w-5 h-5 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-[#0B1F2A] mb-2">Choose Format</h2>
            <p className="text-[#5B6B75] mb-6">Select which type of farewell sample you&apos;d like to view</p>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/boards/778b616a/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowFarewellFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Board</h3>
                  <p className="text-sm text-[#5B6B75]">Multiple people add messages together</p>
                </div>
              </Link>
              <Link href="/cards/159aa8d4/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowFarewellFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Card</h3>
                  <p className="text-sm text-[#5B6B75]">Perfect for a single contributor</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Format Selection Modal */}
      {showCongratulationsFormatModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowCongratulationsFormatModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
            >
              <svg className="w-5 h-5 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-[#0B1F2A] mb-2">Choose Format</h2>
            <p className="text-[#5B6B75] mb-6">Select which type of congratulations sample you&apos;d like to view</p>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/boards/4c61181a/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowCongratulationsFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Board</h3>
                  <p className="text-sm text-[#5B6B75]">Multiple people add messages together</p>
                </div>
              </Link>
              <Link href="/cards/40415dc3/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowCongratulationsFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Card</h3>
                  <p className="text-sm text-[#5B6B75]">Perfect for a single contributor</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* New Baby Format Selection Modal */}
      {showNewBabyFormatModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowNewBabyFormatModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
            >
              <svg className="w-5 h-5 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-[#0B1F2A] mb-2">Choose Format</h2>
            <p className="text-[#5B6B75] mb-6">Select which type of new baby sample you&apos;d like to view</p>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/boards/de2b4271/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowNewBabyFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Board</h3>
                  <p className="text-sm text-[#5B6B75]">Multiple people add messages together</p>
                </div>
              </Link>
              <Link href="/cards/7c038a35/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowNewBabyFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Card</h3>
                  <p className="text-sm text-[#5B6B75]">Perfect for a single contributor</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Wedding Format Selection Modal */}
      {showWeddingFormatModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowWeddingFormatModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
            >
              <svg className="w-5 h-5 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-[#0B1F2A] mb-2">Choose Format</h2>
            <p className="text-[#5B6B75] mb-6">Select which type of wedding sample you&apos;d like to view</p>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/boards/1d95b4d0/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowWeddingFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Board</h3>
                  <p className="text-sm text-[#5B6B75]">Multiple people add messages together</p>
                </div>
              </Link>
              <Link href="/cards/4cdf605e/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowWeddingFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Card</h3>
                  <p className="text-sm text-[#5B6B75]">Perfect for a single contributor</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Format Selection Modal */}
      {showFormatModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowFormatModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
            >
              <svg className="w-5 h-5 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-[#0B1F2A] mb-2">Choose Format</h2>
            <p className="text-[#5B6B75] mb-6">Select which type of birthday sample you'd like to view</p>

            {/* Format Options */}
            <div className="grid grid-cols-2 gap-4">
              {/* Board Option */}
              <Link href="/boards/58fdbc1b/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Board</h3>
                  <p className="text-sm text-[#5B6B75]">Multiple people add messages together</p>
                </div>
              </Link>

              {/* Card Option */}
              <Link href="/cards/ba377041/view" target="_blank" rel="noopener noreferrer" onClick={() => setShowFormatModal(false)}>
                <div className="group p-6 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] rounded-xl cursor-pointer transition-all hover:shadow-lg h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#E8F5F4] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#2CB1A6] transition-colors">
                    <svg className="w-8 h-8 text-[#2CB1A6] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-[#0B1F2A] mb-2">Card</h3>
                  <p className="text-sm text-[#5B6B75]">Perfect for a single contributor</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#E5EAF0] bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 md:gap-4">
              <Image
                src="/cardoraLogo.png"
                alt="Cardora"
                width={240}
                height={64}
                className="h-9 md:h-16 w-auto"
                priority
              />
              <span className="text-xl md:text-3xl font-bold text-[#2CB1A6]">Cardora</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-12">
              <div
                className="relative"
                onMouseEnter={() => setShowFeaturesDropdown(true)}
                onMouseLeave={() => setShowFeaturesDropdown(false)}
              >
                <span className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold cursor-pointer">
                  Features
                </span>

                {/* Features Dropdown */}
                {showFeaturesDropdown && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] overflow-hidden w-[600px]">
                    <div className="grid grid-cols-2">
                      {/* Personal Section */}
                      <Link href="/benefits/personal" className="p-6 border-r border-[#E5EAF0] bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] hover:from-[#E8F5F4] hover:to-[#D0EBE9] transition-colors cursor-pointer">
                        <h3 className="text-xl font-bold text-[#0B1F2A] mb-2 flex items-center gap-2">
                          <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Personal
                        </h3>
                        <p className="text-sm text-[#5B6B75] mb-4">Celebrate life's special moments</p>
                        <ul className="space-y-2 text-[#5B6B75]">
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                            Birthdays
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Valentine's Day
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Weddings
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            New Baby
                          </li>
                          <li className="text-[#2CB1A6] font-medium">and many more...</li>
                        </ul>
                      </Link>

                      {/* Corporate Section */}
                      <Link href="/benefits/corporate" className="p-6 bg-gradient-to-br from-[#0B1F2A] to-[#1F8F86] hover:from-[#1F8F86] hover:to-[#0B1F2A] transition-colors cursor-pointer">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Corporate
                        </h3>
                        <p className="text-sm text-white/80 mb-4">Build culture through recognition</p>
                        <ul className="space-y-2 text-white/80">
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Team Celebration
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Employee Appreciation
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Work Anniversary
                          </li>
                          <li className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Congratulations
                          </li>
                          <li className="text-white font-medium">and many more...</li>
                        </ul>
                      </Link>
                    </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/pricing" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">
                Pricing
              </Link>
              <a href="/templates" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">
                Templates
              </a>
              <Link href="/contact" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-bold">
                Contact Us
              </Link>
            </nav>

            {/* Right: CTA + Hamburger */}
            <div className="flex items-center gap-2 md:gap-3">
              {user ? (
                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-9 h-9 rounded-full bg-[#2CB1A6] text-white flex items-center justify-center font-bold text-sm">
                    {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block text-[#0B1F2A] font-medium">
                    {user.user_metadata?.name || user.email}
                  </span>
                </Link>
              ) : (
                <>
                  <Link href="/login?mode=signin" className="hidden md:block">
                    <button className="px-4 py-2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-medium">
                      Sign in
                    </button>
                  </Link>
                  <Link href="/login?mode=signup">
                    <button className="px-4 md:px-6 py-2 md:py-2.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors shadow-sm text-sm md:text-base">
                      Sign up free
                    </button>
                  </Link>
                </>
              )}
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-[#F7FAFC] transition-colors"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? (
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <nav className="md:hidden border-t border-[#E5EAF0] pt-4 pb-2 mt-3 flex flex-col gap-1">
              <Link href="/benefits/personal" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Features — Personal</Link>
              <Link href="/benefits/corporate" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Features — Corporate</Link>
              <Link href="/pricing" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Pricing</Link>
              <Link href="/templates" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Templates</Link>
              <Link href="/contact" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Contact Us</Link>
              {user ? (
                <Link href="/dashboard" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Dashboard</Link>
              ) : (
                <Link href="/login?mode=signin" onClick={() => setShowMobileMenu(false)} className="px-3 py-2.5 text-[#5B6B75] font-semibold hover:text-[#2CB1A6] hover:bg-[#F7FAFC] rounded-lg transition-colors">Sign in</Link>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#F7FAFC] py-10 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1F2A] leading-tight flex flex-col">
                  <span>Send digital cards.<span className="sr-only"> — Digital Greeting Cards Online</span></span>
                  <span className="flex items-center justify-center lg:justify-start gap-2 md:gap-3">
                    <span className="relative inline-block min-w-[160px] sm:min-w-[220px] lg:min-w-[280px]">
                      <span
                        className={`absolute left-0 transition-all duration-500 ${
                          alternateText === 'together'
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 -translate-y-4'
                        }`}
                      >
                        Together.
                      </span>
                      <span
                        className={`absolute left-0 transition-all duration-500 ${
                          alternateText === 'individually'
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        }`}
                      >
                        Individually.
                      </span>
                      <span className="invisible">Individually.</span>
                    </span>
                    <Image
                      src="/cardoraHeart.png"
                      alt="heart"
                      width={80}
                      height={80}
                      className="inline-block w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20"
                      unoptimized
                    />
                  </span>
                </h1>
                <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Create beautiful digital cards for birthdays, farewells, and celebrations. Send solo or collect heartfelt messages from everyone in one place.
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
                <Link href="/boards/create">
                  <button className="px-6 md:px-8 py-3 md:py-3.5 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                    Create a Cardora
                  </button>
                </Link>
                <Link href="/templates">
                  <button className="px-6 md:px-8 py-3 md:py-3.5 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] border-2 border-[#2CB1A6] hover:border-[#1F8F86] rounded-lg font-semibold transition-all">
                    Explore templates
                  </button>
                </Link>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#2CB1A6] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#5B6B75] font-medium text-sm md:text-base">Free to get started</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#2CB1A6] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-[#5B6B75] font-medium text-sm md:text-base">Private and secure</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#2CB1A6] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-[#5B6B75] font-medium text-sm md:text-base">Loved by teams worldwide</span>
                </div>
              </div>
            </div>

            {/* Mobile Lottie — shown only below md, cycles through hero lotties */}
            <div className="lg:hidden flex items-center justify-center h-56 sm:h-72 relative">
              {[heroLottie1, heroLottie2, heroLottie3, heroLottie4, heroLottie5].map((lottie, index) => (
                lottie && (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${currentHeroItem === index + 1 ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Lottie animationData={lottie} loop={true} style={{ width: '100%', height: '100%' }} />
                  </div>
                )
              ))}
              {/* Show demo image when index 0 */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${currentHeroItem === 0 ? 'opacity-100' : 'opacity-0'} flex items-center justify-center`}>
                <Image src="/cardoraDemo.png" alt="Cardora Demo" width={400} height={400} className="w-full h-auto max-h-full object-contain" unoptimized />
              </div>
            </div>

            {/* Right Content - Rotating Demo Image and Lotties (hidden on mobile) */}
            <div className="hidden lg:block relative overflow-visible">
              <div className="relative scale-125 origin-center">
                {/* Invisible placeholder to maintain height */}
                <div className="invisible">
                  <Image
                    src="/cardoraDemo.png"
                    alt="Cardora Demo"
                    width={700}
                    height={700}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>

                {/* Demo Image (index 0) */}
                <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 0 ? 'opacity-100' : 'opacity-0'}`}>
                  <Image
                    src="/cardoraDemo.png"
                    alt="Cardora Demo"
                    width={700}
                    height={700}
                    className="w-full h-auto"
                    unoptimized
                  />
                </div>

                {/* Birthday Lottie (index 1) */}
                {heroLottie1 && (
                  <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <Lottie
                      animationData={heroLottie1}
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                )}

                {/* Welcome Lottie (index 2) */}
                {heroLottie2 && (
                  <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 2 ? 'opacity-100' : 'opacity-0'}`}>
                    <Lottie
                      animationData={heroLottie2}
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                )}

                {/* Valentine Lottie (index 3) */}
                {heroLottie3 && (
                  <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 3 ? 'opacity-100' : 'opacity-0'}`}>
                    <Lottie
                      animationData={heroLottie3}
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                )}

                {/* Baby Lottie (index 4) */}
                {heroLottie4 && (
                  <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 4 ? 'opacity-100' : 'opacity-0'}`}>
                    <Lottie
                      animationData={heroLottie4}
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                )}

                {/* Love2 Lottie (index 5) */}
                {heroLottie5 && (
                  <div className={`transition-opacity duration-500 absolute inset-0 ${currentHeroItem === 5 ? 'opacity-100' : 'opacity-0'}`}>
                    <Lottie
                      animationData={heroLottie5}
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#A7E8E2] rounded-full opacity-50 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#2CB1A6] rounded-full opacity-30 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5EAF0] hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F7FAFC] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Cards your way</h3>
                    <p className="text-[#5B6B75] leading-relaxed">
                      Send individually or invite others to add messages, photos, GIFs, and more.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5EAF0] hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F7FAFC] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Beautiful templates</h3>
                    <p className="text-[#5B6B75] leading-relaxed">
                      Choose from hundreds of modern templates for any occasion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5EAF0] hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#F7FAFC] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Send anywhere</h3>
                    <p className="text-[#5B6B75] leading-relaxed">
                      Deliver by email or share a link. Fast, simple, meaningful.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 md:py-10 bg-[#E8F5F4]">
        <div className="w-11/12 md:w-4/5 mx-auto">
          {/* Mobile: stacked layout */}
          <div className="flex flex-col md:hidden gap-4">
            {/* Profile + Quote */}
            <div className={`flex items-start gap-4 transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img src={TESTIMONIALS[currentTestimonial].image} alt={TESTIMONIALS[currentTestimonial].name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <svg className="w-8 h-8 text-[#2CB1A6] mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>
                <p className="text-sm text-[#0B1F2A] leading-relaxed mb-3">
                  {TESTIMONIALS[currentTestimonial].quote}
                </p>
                <p className="font-bold text-[#0B1F2A] text-sm">— {TESTIMONIALS[currentTestimonial].name}</p>
                <p className="text-[#5B6B75] text-xs">{TESTIMONIALS[currentTestimonial].title}</p>
              </div>
            </div>

            {/* Navigation — centered below */}
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

          {/* Desktop: original horizontal layout */}
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
              <p className="text-lg text-[#0B1F2A] leading-relaxed mb-4">
                {TESTIMONIALS[currentTestimonial].quote}
              </p>
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

      {/* Occasions Section */}
      <section className="py-20 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              What moments do you want to celebrate?
            </h2>
            <p className="text-xl text-white opacity-90">
              Send beautiful digital cards solo or gather messages from everyone for birthdays, milestones, and more.
            </p>
          </div>

          {/* Occasions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto mb-12">
            {occasionsLoading ? (
              // Loading skeleton
              Array.from({ length: 15 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-[#F7FAFC] rounded-full"></div>
                  <div className="h-12 w-full bg-[#F7FAFC] rounded"></div>
                </div>
              ))
            ) : occasions.length > 0 ? (
              occasions.map((occasion) => (
                <Link
                  key={occasion.id}
                  href={`/boards/create?occasion=${occasion.short_id}`}
                  className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-xl transition-all hover:scale-105"
                >
                  {occasion.lottieData ? (
                    <div className="w-20 h-20">
                      <Lottie
                        animationData={occasion.lottieData}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-[#F7FAFC] rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  )}
                  <h3 className="text-center font-semibold text-[#0B1F2A] min-h-[3rem] flex items-center justify-center">
                    {occasion.name}
                  </h3>
                </Link>
              ))
            ) : (
              // Fallback if no occasions loaded
              <div className="col-span-full text-center text-white">
                <p>No occasions available at the moment.</p>
              </div>
            )}
          </div>

          {/* See All Link */}
          <div className="text-center">
            <Link href="/boards/create" className="inline-flex items-center gap-2 text-white text-lg font-semibold hover:gap-4 transition-all">
              See all
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-white relative overflow-hidden">
        {/* Decorative Lotties — desktop only */}
        {howItWorksLottie1 && (
          <div className="hidden md:block absolute top-16 left-16 w-64 h-64 opacity-30">
            <Lottie animationData={howItWorksLottie1} loop={true} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {howItWorksLottie2 && (
          <div className="hidden md:block absolute top-16 right-16 w-64 h-64 opacity-30">
            <Lottie animationData={howItWorksLottie2} loop={true} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {howItWorksLottie3 && (
          <div className="hidden md:block absolute bottom-16 left-16 w-64 h-64 opacity-30">
            <Lottie animationData={howItWorksLottie3} loop={true} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {howItWorksLottie4 && (
          <div className="hidden md:block absolute bottom-16 right-16 w-64 h-64 opacity-30">
            <Lottie animationData={howItWorksLottie4} loop={true} style={{ width: '100%', height: '100%' }} />
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#0B1F2A] text-center mb-8 md:mb-12">
              Make Celebrations Effortless
            </h2>

            {/* Tab Buttons */}
            <div className="flex justify-center gap-2 md:gap-4 mb-8 md:mb-16 max-w-3xl mx-auto">
              {['Create', 'Invite', 'Share', 'Celebrate'].map((step, index) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(index)}
                  className={`flex-1 px-3 md:px-10 py-2 md:py-3 rounded-full font-semibold transition-all text-sm md:text-base ${
                    activeStep === index
                      ? 'bg-[#1F8F86] text-white'
                      : 'bg-white text-[#5B6B75] border-2 border-[#E5EAF0] hover:border-[#2CB1A6]'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>

            {/* Step Content */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Content */}
              <div>
                {activeStep === 0 && (
                  <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                    <p className="text-sm font-semibold text-[#5B6B75] uppercase tracking-wide">CREATE</p>
                    <h3 className="text-2xl md:text-4xl font-bold text-[#0B1F2A]">Pick your occasion</h3>
                    <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed">
                      From birthdays to farewells, choose the perfect moment to celebrate. Customize with photos, videos, and heartfelt messages in just a few clicks.
                    </p>
                    <Link href="/boards/create">
                      <button className="px-6 md:px-8 py-3 md:py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors text-base md:text-lg">
                        Create a Cardora
                      </button>
                    </Link>
                  </div>
                )}
                {activeStep === 1 && (
                  <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                    <p className="text-sm font-semibold text-[#5B6B75] uppercase tracking-wide">INVITE</p>
                    <h3 className="text-2xl md:text-4xl font-bold text-[#0B1F2A]">Get everyone involved</h3>
                    <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed">
                      Choose the Board format to send a simple link to friends, family, or coworkers. They can contribute messages and memories instantly, without signing up.
                    </p>
                    <Link href="/boards/create">
                      <button className="px-6 md:px-8 py-3 md:py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors text-base md:text-lg">
                        Create a Cardora
                      </button>
                    </Link>
                  </div>
                )}
                {activeStep === 2 && (
                  <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                    <p className="text-sm font-semibold text-[#5B6B75] uppercase tracking-wide">SHARE</p>
                    <h3 className="text-2xl md:text-4xl font-bold text-[#0B1F2A]">Make the moment unforgettable</h3>
                    <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed">
                      Send your card instantly or schedule it for the perfect surprise. Share digitally, print it, or present it live—creating memories that last.
                    </p>
                    <Link href="/boards/create">
                      <button className="px-6 md:px-8 py-3 md:py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors text-base md:text-lg">
                        Create a Cardora
                      </button>
                    </Link>
                  </div>
                )}
                {activeStep === 3 && (
                  <div className="space-y-4 md:space-y-6 text-center lg:text-left">
                    <p className="text-sm font-semibold text-[#5B6B75] uppercase tracking-wide">CELEBRATE</p>
                    <h3 className="text-2xl md:text-4xl font-bold text-[#0B1F2A]">Create memories that last</h3>
                    <p className="text-base md:text-lg text-[#5B6B75] leading-relaxed">
                      Your recipient receives a heartfelt card filled with messages, photos, and love—whether from you alone or from everyone together. A keepsake they can treasure and revisit forever.
                    </p>
                    <Link href="/boards/create">
                      <button className="px-6 md:px-8 py-3 md:py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors text-base md:text-lg">
                        Create a Cardora
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Right Visual */}
              <div className="bg-[#F7FAFC] rounded-2xl p-4 md:p-8 min-h-[280px] md:min-h-[500px] flex items-center justify-center">
                {activeStep === 0 && (
                  <div className="w-full">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <p className="text-sm font-semibold text-[#5B6B75] mb-4">Select occasion</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-[#F7FAFC] rounded-lg">
                          <span className="text-2xl">🎂</span>
                          <span className="font-medium text-[#0B1F2A]">Birthday</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 hover:bg-[#F7FAFC] rounded-lg">
                          <span className="text-2xl">📅</span>
                          <span className="font-medium text-[#0B1F2A]">Work Anniversary</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 hover:bg-[#F7FAFC] rounded-lg">
                          <span className="text-2xl">🏆</span>
                          <span className="font-medium text-[#0B1F2A]">Congrats</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 hover:bg-[#F7FAFC] rounded-lg">
                          <span className="text-2xl">💐</span>
                          <span className="font-medium text-[#0B1F2A]">Sympathy</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 hover:bg-[#F7FAFC] rounded-lg">
                          <span className="text-2xl">💌</span>
                          <span className="font-medium text-[#0B1F2A]">Thank You</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="w-full">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <p className="text-sm font-semibold text-[#5B6B75] mb-4">Invite contributors</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-4 py-2 bg-[#2CB1A6] text-white rounded-full text-sm">Emily Chen</span>
                        <span className="px-4 py-2 bg-[#2CB1A6] text-white rounded-full text-sm">Michael Rodriguez</span>
                        <span className="px-4 py-2 bg-[#2CB1A6] text-white rounded-full text-sm">Sarah Johnson</span>
                        <span className="px-4 py-2 bg-[#2CB1A6] text-white rounded-full text-sm">Design Team</span>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-[#5B6B75]">Message</label>
                        <div className="p-4 bg-[#F7FAFC] rounded-lg">
                          <p className="text-[#0B1F2A]">Hi everyone! Let's make Alex's farewell card extra special. Please add your favorite memory or message!</p>
                        </div>
                        <button className="w-full px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors">
                          Send invites
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="w-full space-y-6">
                    {/* Delivery Options Card */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#E5EAF0]">
                      <p className="text-sm font-semibold text-[#5B6B75] mb-4">Choose delivery</p>

                      {/* Send Now Option */}
                      <div className="bg-gradient-to-r from-[#2CB1A6] to-[#A7E8E2] rounded-lg p-4 mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-white">Send now</p>
                            <p className="text-sm text-white opacity-90">Deliver instantly</p>
                          </div>
                        </div>
                        <span className="text-2xl">⚡</span>
                      </div>

                      {/* Schedule Option */}
                      <div className="bg-[#F7FAFC] rounded-lg p-4 flex items-center justify-between border-2 border-[#E5EAF0]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-[#2CB1A6]">
                            <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-[#0B1F2A]">Schedule for later</p>
                            <p className="text-sm text-[#5B6B75]">Pick the perfect moment</p>
                          </div>
                        </div>
                        <span className="text-2xl">📅</span>
                      </div>
                    </div>

                    {/* Celebration Preview */}
                    <div className="bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-2 right-2 text-4xl opacity-50">🎉</div>
                      <div className="absolute bottom-2 left-2 text-3xl opacity-50">💝</div>
                      <h4 className="text-xl font-bold mb-2">Happy Birthday, Alex! 🎂</h4>
                      <p className="text-sm opacity-90 mb-3">15 heartfelt messages waiting inside</p>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
                        <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
                        <div className="w-8 h-8 bg-white rounded-full opacity-80"></div>
                        <div className="text-sm flex items-center text-white font-semibold">+12</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                    {/* Background Image - People Celebrating */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop&crop=faces)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2CB1A6]/80 to-[#1F8F86]/80"></div>
                    </div>

                    {/* Celebration Icon Elements */}
                    <div className="absolute top-8 left-8 animate-bounce">
                      <svg className="w-10 h-10 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="absolute top-12 right-12 animate-pulse">
                      <svg className="w-8 h-8 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="absolute bottom-8 left-12 animate-bounce delay-100">
                      <svg className="w-9 h-9 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>

                    {/* Central Card Display */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80">
                      <div className="bg-white rounded-xl shadow-2xl p-6 border-4 border-white">
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#2CB1A6] to-[#A7E8E2] rounded-full mx-auto mb-3 flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                            </svg>
                          </div>
                          <h4 className="text-2xl font-bold text-[#0B1F2A] mb-2">Happy Birthday!</h4>
                          <p className="text-sm text-[#5B6B75]">From your amazing team</p>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="bg-[#F7FAFC] rounded-lg p-3 flex items-start gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-[#2CB1A6] to-[#A7E8E2] rounded-full flex-shrink-0"></div>
                            <p className="text-xs text-[#0B1F2A] leading-relaxed">"Best wishes for an amazing year!" - Sarah</p>
                          </div>
                          <div className="bg-[#F7FAFC] rounded-lg p-3 flex items-start gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-[#2CB1A6] to-[#A7E8E2] rounded-full flex-shrink-0"></div>
                            <p className="text-xs text-[#0B1F2A] leading-relaxed">"You're amazing! Keep shining!" - Mike</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#E5EAF0]">
                          <div className="flex -space-x-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-[#2CB1A6] to-[#A7E8E2] rounded-full border-2 border-white"></div>
                            <div className="w-7 h-7 bg-gradient-to-br from-[#FFB84D] to-[#FF9E1B] rounded-full border-2 border-white"></div>
                            <div className="w-7 h-7 bg-gradient-to-br from-[#FF6B9D] to-[#FF4081] rounded-full border-2 border-white"></div>
                            <div className="w-7 h-7 bg-gradient-to-br from-[#7C4DFF] to-[#6200EA] rounded-full border-2 border-white"></div>
                          </div>
                          <span className="text-sm font-bold text-[#2CB1A6]">+24 contributors</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="templates" className="py-20 bg-[#F7FAFC]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">
                See Cardora in action
              </h2>
              <p className="text-xl text-[#5B6B75]">
                Browse examples and discover the perfect card for your celebration.
              </p>
            </div>

            {/* Examples Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Birthday Example */}
              <div
                onClick={() => setShowFormatModal(true)}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br from-pink-100 to-blue-100 cursor-pointer"
              >
                <div className="aspect-[4/3] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {birthdayExampleLottie ? (
                        <div className="w-full h-full">
                          <Lottie
                            animationData={birthdayExampleLottie}
                            loop={true}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                          <svg className="w-16 h-16 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-pink-400 text-white py-3 px-4">
                    <h3 className="font-bold text-lg">Birthday</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#2CB1A6]/0 group-hover:bg-[#2CB1A6]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="px-6 py-3 bg-[#2CB1A6] text-white rounded-lg font-semibold shadow-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View sample
                    </button>
                  </div>
                </div>
              </div>

              {/* Wedding Example */}
              <div
                onClick={() => setShowWeddingFormatModal(true)}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br from-pink-50 to-rose-100 cursor-pointer"
              >
                <div className="aspect-[4/3] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {weddingExampleLottie ? (
                      <Lottie
                        animationData={weddingExampleLottie}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <svg className="w-16 h-16 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-rose-400 to-pink-300 text-white py-3 px-4">
                    <h3 className="font-bold text-lg">Wedding</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#2CB1A6]/0 group-hover:bg-[#2CB1A6]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="px-6 py-3 bg-[#2CB1A6] text-white rounded-lg font-semibold shadow-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View sample
                    </button>
                  </div>
                </div>
              </div>

              {/* New Baby Example */}
              <div
                onClick={() => setShowNewBabyFormatModal(true)}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br from-yellow-50 to-sky-100 cursor-pointer"
              >
                <div className="aspect-[4/3] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {newBabyExampleLottie ? (
                      <Lottie
                        animationData={newBabyExampleLottie}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <svg className="w-16 h-16 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-sky-400 to-yellow-300 text-white py-3 px-4">
                    <h3 className="font-bold text-lg">New Baby</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#2CB1A6]/0 group-hover:bg-[#2CB1A6]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="px-6 py-3 bg-[#2CB1A6] text-white rounded-lg font-semibold shadow-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View sample
                    </button>
                  </div>
                </div>
              </div>

              {/* Congratulations Example */}
              <div
                onClick={() => setShowCongratulationsFormatModal(true)}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br from-amber-50 to-purple-100 cursor-pointer"
              >
                <div className="aspect-[4/3] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {congratulationsExampleLottie ? (
                      <Lottie
                        animationData={congratulationsExampleLottie}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <svg className="w-16 h-16 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-purple-500 text-white py-3 px-4">
                    <h3 className="font-bold text-lg">Congratulations</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#2CB1A6]/0 group-hover:bg-[#2CB1A6]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="px-6 py-3 bg-[#2CB1A6] text-white rounded-lg font-semibold shadow-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View sample
                    </button>
                  </div>
                </div>
              </div>

              {/* Farewell Example */}
              <div
                onClick={() => setShowFarewellFormatModal(true)}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br from-teal-50 to-cyan-100 cursor-pointer"
              >
                <div className="aspect-[4/3] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {farewellExampleLottie ? (
                      <Lottie
                        animationData={farewellExampleLottie}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <svg className="w-16 h-16 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-400 text-white py-3 px-4">
                    <h3 className="font-bold text-lg">Farewell</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#2CB1A6]/0 group-hover:bg-[#2CB1A6]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="px-6 py-3 bg-[#2CB1A6] text-white rounded-lg font-semibold shadow-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View sample
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Celebration Example */}
              <div
                onClick={() => setShowTeamCelebrationFormatModal(true)}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br from-indigo-50 to-purple-100 cursor-pointer"
              >
                <div className="aspect-[4/3] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {teamCelebrationExampleLottie ? (
                      <Lottie
                        animationData={teamCelebrationExampleLottie}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                        <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 px-4">
                    <h3 className="font-bold text-lg">Team Celebration</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#2CB1A6]/0 group-hover:bg-[#2CB1A6]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="px-6 py-3 bg-[#2CB1A6] text-white rounded-lg font-semibold shadow-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View sample
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link href="/templates">
                <button className="px-10 py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  Explore All Templates
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="bg-white">
        <div className="container mx-auto px-6 pt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">
                Why Choose Cardora?
              </h2>
              <p className="text-xl text-[#5B6B75]">
                Perfect for personal celebrations and professional recognition
              </p>
            </div>
          </div>
        </div>

        {/* Personal Section - Full Width Background */}
        <div className="bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-[#2CB1A6] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#0B1F2A] mb-4">For Personal Celebrations</h3>
                  <p className="text-lg text-[#5B6B75] leading-relaxed mb-6">
                    Make every milestone memorable. Cardora helps you celebrate life's precious moments with the people who matter most.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-[#A7E8E2] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#0B1F2A] mb-2 text-lg">Bring Everyone Together</h4>
                  <p className="text-[#5B6B75]">
                    Connect friends and family from around the world in one beautiful, heartfelt card
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-[#A7E8E2] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#0B1F2A] mb-2 text-lg">Create Lasting Memories</h4>
                  <p className="text-[#5B6B75]">
                    Preserve heartfelt messages and photos that your loved ones will treasure forever
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-[#A7E8E2] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-[#0B1F2A] mb-2 text-lg">Celebrate Your Way</h4>
                  <p className="text-[#5B6B75]">
                    Choose from stunning templates and customize every detail to match the occasion
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link href="/benefits/personal">
                  <button className="px-10 py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                    Learn more
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Section - Full Width Background */}
        <div className="bg-gradient-to-br from-[#0B1F2A] to-[#1F8F86] py-12 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">For Corporate Teams</h3>
                  <p className="text-lg opacity-90 leading-relaxed mb-6">
                    Transform your workplace culture with meaningful recognition. Strengthen team bonds and drive results through authentic appreciation.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold mb-2 text-lg">Energize Your Team</h4>
                  <p className="text-white/80 text-sm">
                    Inspire higher engagement and motivation through collective appreciation
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold mb-2 text-lg">Build Stronger Culture</h4>
                  <p className="text-white/80 text-sm">
                    Foster appreciation across all levels and strengthen team connections
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h4 className="font-bold mb-2 text-lg">Recognize Excellence</h4>
                  <p className="text-white/80 text-sm">
                    Celebrate achievements and milestones that drive your business forward
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold mb-2 text-lg">Retain Top Talent</h4>
                  <p className="text-white/80 text-sm">
                    Increase satisfaction and loyalty by making employees feel valued
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link href="/benefits/corporate">
                  <button className="px-10 py-4 bg-white hover:bg-[#F7FAFC] text-[#2CB1A6] text-lg rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                    Learn more
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2CB1A6] py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Logo & Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/cardoraLogo.png"
                    alt="Cardora"
                    width={160}
                    height={48}
                    className="h-12 w-auto"
                  />
                  <span className="text-2xl font-bold text-white">Cardora</span>
                </div>
                <p className="text-sm text-white opacity-90">
                  Beautiful group cards for every celebration
                </p>
              </div>

              {/* Product Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-white opacity-80 hover:opacity-100 transition-opacity">Features</a></li>
                  <li><Link href="/pricing" className="text-white opacity-80 hover:opacity-100 transition-opacity">Pricing</Link></li>
                  <li><a href="/templates" className="text-white opacity-80 hover:opacity-100 transition-opacity">Templates</a></li>
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="text-white opacity-80 hover:opacity-100 transition-opacity">Contact Us</Link></li>
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {/* Facebook */}
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="Facebook">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>

                  {/* X (Twitter) */}
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="X">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="LinkedIn">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a href="#" className="w-10 h-10 bg-[#1F8F86] hover:bg-[#0B1F2A] rounded-lg flex items-center justify-center transition-all" aria-label="Instagram">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-white border-opacity-20 pt-8 text-center">
              <p className="text-sm text-white opacity-90">
                &copy; 2026 Cardora. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}