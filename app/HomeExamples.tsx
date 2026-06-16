"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Lottie from "lottie-react";

function FormatModal({
  title,
  description,
  boardHref,
  cardHref,
  onClose,
}: {
  title: string;
  description: string;
  boardHref: string;
  cardHref: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
        >
          <svg className="w-5 h-5 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-[#0B1F2A] mb-2">Choose Format</h2>
        <p className="text-[#5B6B75] mb-6">{description}</p>
        <div className="grid grid-cols-2 gap-4">
          <Link href={boardHref} target="_blank" rel="noopener noreferrer" onClick={onClose}>
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
          <Link href={cardHref} target="_blank" rel="noopener noreferrer" onClick={onClose}>
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
  );
}

const VIEW_ICON = (
  <>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </>
);

export default function HomeExamples() {
  const [birthdayLottie, setBirthdayLottie] = useState<any>(null);
  const [weddingLottie, setWeddingLottie] = useState<any>(null);
  const [newBabyLottie, setNewBabyLottie] = useState<any>(null);
  const [congratulationsLottie, setCongratulationsLottie] = useState<any>(null);
  const [farewellLottie, setFarewellLottie] = useState<any>(null);
  const [teamCelebrationLottie, setTeamCelebrationLottie] = useState<any>(null);

  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showWeddingModal, setShowWeddingModal] = useState(false);
  const [showNewBabyModal, setShowNewBabyModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [showFarewellModal, setShowFarewellModal] = useState(false);
  const [showTeamCelebrationModal, setShowTeamCelebrationModal] = useState(false);

  useEffect(() => {
    fetch('/lotties/birthday/birthday1.json').then(r => r.json()).then(setBirthdayLottie).catch(() => {});
    fetch('/lotties/wedding/wedding2.json').then(r => r.json()).then(setWeddingLottie).catch(() => {});
    fetch('/lotties/newbaby/baby1.json').then(r => r.json()).then(setNewBabyLottie).catch(() => {});
    fetch('/lotties/congratulations/congratulations3.json').then(r => r.json()).then(setCongratulationsLottie).catch(() => {});
    fetch('/lotties/farewell/farewell4.json').then(r => r.json()).then(setFarewellLottie).catch(() => {});
    fetch('/lotties/teamcelebration/teamCelebration1.json').then(r => r.json()).then(setTeamCelebrationLottie).catch(() => {});
  }, []);

  const EXAMPLES = [
    {
      label: 'Birthday', gradient: 'from-pink-100 to-blue-100', headerGradient: 'from-blue-500 to-pink-400',
      lottie: birthdayLottie, fallbackColor: 'text-pink-500',
      fallbackPath: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z',
      onClick: () => setShowBirthdayModal(true),
    },
    {
      label: 'Wedding', gradient: 'from-pink-50 to-rose-100', headerGradient: 'from-rose-400 to-pink-300',
      lottie: weddingLottie, fallbackColor: 'text-rose-400',
      fallbackPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      onClick: () => setShowWeddingModal(true),
    },
    {
      label: 'New Baby', gradient: 'from-yellow-50 to-sky-100', headerGradient: 'from-sky-400 to-yellow-300',
      lottie: newBabyLottie, fallbackColor: 'text-sky-400',
      fallbackPath: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      onClick: () => setShowNewBabyModal(true),
    },
    {
      label: 'Congratulations', gradient: 'from-amber-50 to-purple-100', headerGradient: 'from-amber-500 to-purple-500',
      lottie: congratulationsLottie, fallbackColor: 'text-amber-500',
      fallbackPath: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      onClick: () => setShowCongratulationsModal(true),
    },
    {
      label: 'Farewell', gradient: 'from-teal-50 to-cyan-100', headerGradient: 'from-teal-500 to-cyan-400',
      lottie: farewellLottie, fallbackColor: 'text-teal-500',
      fallbackPath: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5',
      onClick: () => setShowFarewellModal(true),
    },
    {
      label: 'Team Celebration', gradient: 'from-indigo-50 to-purple-100', headerGradient: 'from-indigo-600 to-purple-500',
      lottie: teamCelebrationLottie, fallbackColor: 'text-indigo-500',
      fallbackPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      onClick: () => setShowTeamCelebrationModal(true),
    },
  ];

  return (
    <>
      {/* Modals */}
      {showBirthdayModal && <FormatModal title="Birthday" description="Select which type of birthday sample you'd like to view" boardHref="/boards/58fdbc1b/view" cardHref="/cards/ba377041/view" onClose={() => setShowBirthdayModal(false)} />}
      {showWeddingModal && <FormatModal title="Wedding" description="Select which type of wedding sample you'd like to view" boardHref="/boards/1d95b4d0/view" cardHref="/cards/4cdf605e/view" onClose={() => setShowWeddingModal(false)} />}
      {showNewBabyModal && <FormatModal title="New Baby" description="Select which type of new baby sample you'd like to view" boardHref="/boards/de2b4271/view" cardHref="/cards/7c038a35/view" onClose={() => setShowNewBabyModal(false)} />}
      {showCongratulationsModal && <FormatModal title="Congratulations" description="Select which type of congratulations sample you'd like to view" boardHref="/boards/4c61181a/view" cardHref="/cards/40415dc3/view" onClose={() => setShowCongratulationsModal(false)} />}
      {showFarewellModal && <FormatModal title="Farewell" description="Select which type of farewell sample you'd like to view" boardHref="/boards/778b616a/view" cardHref="/cards/159aa8d4/view" onClose={() => setShowFarewellModal(false)} />}
      {showTeamCelebrationModal && <FormatModal title="Team Celebration" description="Select which type of team celebration sample you'd like to view" boardHref="/boards/3d06eddd/view" cardHref="/cards/ea80cbc1/view" onClose={() => setShowTeamCelebrationModal(false)} />}

      {/* Examples Section */}
      <section id="templates" className="py-20 bg-[#F7FAFC]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#0B1F2A] mb-4">See Cardora in action</h2>
              <p className="text-xl text-[#5B6B75]">Browse examples and discover the perfect card for your celebration.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {EXAMPLES.map(({ label, gradient, headerGradient, lottie, fallbackColor, fallbackPath, onClick }) => (
                <div
                  key={label}
                  onClick={onClick}
                  className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 bg-gradient-to-br ${gradient} cursor-pointer`}
                >
                  <div className="aspect-[4/3] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {lottie ? (
                        <div className="w-full h-full">
                          <Lottie animationData={lottie} loop={true} style={{ width: '100%', height: '100%' }} />
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                          <svg className={`w-16 h-16 ${fallbackColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={fallbackPath} />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={`absolute top-0 left-0 right-0 bg-gradient-to-r ${headerGradient} text-white py-3 px-4`}>
                      <h3 className="font-bold text-lg">{label}</h3>
                    </div>
                    <div className="absolute inset-0 bg-[#2CB1A6]/0 group-hover:bg-[#2CB1A6]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="px-6 py-3 bg-[#2CB1A6] text-white rounded-lg font-semibold shadow-lg flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{VIEW_ICON}</svg>
                        View sample
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
    </>
  );
}
