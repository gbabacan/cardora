"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signUp, signIn, signInWithGoogle, signInWithFacebook, signInWithLinkedIn } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { createBoard } from "@/lib/boards";
import Toast from "@/components/Toast";
import { getOccasionsWithLottieData, OccasionWithLottieData } from "@/lib/occasions";


function CreateBoardPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipients, setRecipients] = useState<string[]>(['']);
  const [cardTitle, setCardTitle] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<'board' | 'card' | null>(null);
  const [occasions, setOccasions] = useState<OccasionWithLottieData[]>([]);
  const [occasionsLoading, setOccasionsLoading] = useState(true);
  const [occasionLottie, setOccasionLottie] = useState<any>(null);

  // Auth form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoadingState, setAuthLoadingState] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const filteredOccasions = occasions.filter((occasion) =>
    occasion.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch occasions from database with their lottie animations
  useEffect(() => {
    async function fetchOccasions() {
      setOccasionsLoading(true);
      try {
        const { occasions: fetchedOccasions, error } = await getOccasionsWithLottieData();

        if (error) {
          console.error('Error fetching occasions:', error);
        } else {
          setOccasions(fetchedOccasions);
        }
      } catch (err) {
        console.error('Error in fetchOccasions:', err);
      } finally {
        setOccasionsLoading(false);
      }
    }

    fetchOccasions();
  }, []);

  // After OAuth redirect: check sessionStorage for pending board creation
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const pending = sessionStorage.getItem('cardora_pending_board');
        if (pending) {
          try {
            const params = JSON.parse(pending);
            sessionStorage.removeItem('cardora_pending_board');
            const { board, error } = await createBoard({
              title: params.cardTitle,
              occasion_type: params.selectedOccasion || '',
              format_type: params.selectedFormat || 'board',
              recipients: params.recipients.filter((r: string) => r.trim()),
            });
            if (!error && board) {
              router.push(params.selectedFormat === 'card' ? `/cards/editor?id=${board.id}` : `/boards/editor?id=${board.id}`);
            }
          } catch {}
        }
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Helper: save pending board params and trigger OAuth
  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'linkedin') => {
    sessionStorage.setItem('cardora_pending_board', JSON.stringify({
      cardTitle, selectedOccasion, selectedFormat, recipients,
    }));
    const redirectTo = window.location.origin + '/boards/create';
    if (provider === 'google') await signInWithGoogle({ redirectTo });
    else if (provider === 'facebook') await signInWithFacebook({ redirectTo });
    else await signInWithLinkedIn({ redirectTo });
  };

  // Auto-select occasion from URL parameter
  useEffect(() => {
    const occasionParam = searchParams.get('occasion');
    if (occasionParam && occasions.find(o => o.short_id === occasionParam)) {
      setSelectedOccasion(occasionParam);
    }
  }, [searchParams, occasions]);

  // Load lottie when occasion is selected
  useEffect(() => {
    if (selectedOccasion) {
      const occasion = occasions.find(o => o.short_id === selectedOccasion);
      if (occasion?.lottieData) {
        setOccasionLottie(occasion.lottieData);
      } else if (selectedOccasion === 'any-other') {
        // Load default lottie for "Any Other" occasion
        fetch('/lotties/teamcelebration/teamCelebration1.json')
          .then(res => res.json())
          .then(data => setOccasionLottie(data))
          .catch(err => {
            console.error('Error loading any-other lottie:', err);
            setOccasionLottie(null);
          });
      } else {
        setOccasionLottie(null);
      }
    } else {
      setOccasionLottie(null);
    }
  }, [selectedOccasion, occasions]);

  const addRecipient = () => {
    setRecipients([...recipients, '']);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index: number, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index] = value;
    setRecipients(newRecipients);
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const isStep1Valid = () => {
    return cardTitle.trim() !== '' && recipients.some(r => r.trim() !== '');
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Smoke/Cloud Effects */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-[#A7E8E2] rounded-full blur-[120px] opacity-40" />
      <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] bg-[#2CB1A6] rounded-full blur-[140px] opacity-30" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#1F8F86] rounded-full blur-[100px] opacity-35" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#A7E8E2] rounded-full blur-[90px] opacity-25" />

      {/* Header */}
      <header className="border-b border-[#E5EAF0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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

            {/* Back Link */}
            <Link href="/" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#0B1F2A] mb-4">
                Choose Your Occasion
              </h1>
              <p className="text-lg text-[#5B6B75] max-w-2xl mx-auto mb-8">
                Select the perfect celebration type to create a memorable group card
              </p>

              {/* Search Box */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search occasions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-transparent border-0 border-b-2 border-[#E5EAF0] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Occasions Grid */}
            {occasionsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 20 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-md animate-pulse">
                    <div className="w-24 h-24 mx-auto mb-3 bg-[#F7FAFC] rounded-lg"></div>
                    <div className="h-4 bg-[#F7FAFC] rounded w-3/4 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : filteredOccasions.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredOccasions.map((occasion) => (
                <button
                  key={occasion.id}
                  onClick={() => setSelectedOccasion(occasion.short_id)}
                  className={`group relative bg-white rounded-xl p-4 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] ${occasion.short_id === 'any-other' ? 'col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5' : ''}`}
                >
                  {/* Lottie Animation */}
                  {occasion.lottieData ? (
                    <div className="w-24 h-24 mx-auto mb-3 rounded-lg bg-transparent text-[#2CB1A6] group-hover:scale-110 transition-transform duration-300">
                      <Lottie
                        animationData={occasion.lottieData}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 mx-auto mb-3 rounded-lg bg-[#F7FAFC] flex items-center justify-center text-[#2CB1A6] group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  )}

                  {/* Occasion Name */}
                  <h3 className="text-center text-sm font-bold text-[#0B1F2A] group-hover:text-[#2CB1A6] transition-colors">
                    {occasion.name}
                  </h3>
                </button>
              ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-[#E5EAF0] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-[#5B6B75] mb-2">No occasions found</p>
                <p className="text-[#5B6B75]">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Modal Panel */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
          selectedOccasion ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 my-4 h-[75vh] flex transform transition-all duration-500 overflow-hidden ${
            selectedOccasion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Left Panel - Lottie Animation */}
          <div className="hidden md:flex md:w-1/2 bg-[#E8F5F4] items-center justify-center p-8 relative">
            {selectedOccasion && occasionLottie && (
              <div className="w-64 h-64">
                <Lottie
                  animationData={occasionLottie}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-1/2 flex flex-col h-full relative overflow-hidden">
            {/* Step 1: Details */}
            <div className={`absolute inset-0 flex flex-col transition-transform duration-500 ${currentStep === 1 ? 'translate-x-0' : '-translate-x-full'}`}>
              {/* Panel Header */}
              <div className="px-8 pt-8 pb-6 relative flex-shrink-0">
                <button
                  onClick={() => setSelectedOccasion(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
                >
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {selectedOccasion && occasions.find(o => o.short_id === selectedOccasion) && (
                  <>
                    {occasionLottie && (
                      <div className="w-16 h-16 mb-4">
                        <Lottie
                          animationData={occasionLottie}
                          loop={true}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    )}
                    <h2 className="text-3xl font-bold text-[#0B1F2A] mb-2">
                      {occasions.find(o => o.short_id === selectedOccasion)?.name}
                    </h2>
                    <p className="text-[#5B6B75]">
                      Create a beautiful card for this special occasion
                    </p>
                  </>
                )}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-4">
            <div className="space-y-6">
              {/* Card Title Input */}
              <div>
                <label className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                  Card Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder={`e.g., ${occasions.find(o => o.short_id === selectedOccasion)?.name || "Happy Birthday Sarah!"}`}
                  className="w-full px-4 py-3 bg-[#F7FAFC] border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                />
              </div>

              {/* Recipient Names */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-[#0B1F2A]">
                    Recipient Name(s) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addRecipient}
                    className="flex items-center gap-1 text-sm text-[#2CB1A6] hover:text-[#1F8F86] font-semibold transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Recipient
                  </button>
                </div>
                <div className="space-y-3">
                  {recipients.map((recipient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Who is this card for?"
                        value={recipient}
                        onChange={(e) => updateRecipient(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-[#F7FAFC] border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                      />
                      {recipients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRecipient(index)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors flex-shrink-0"
                          title="Remove recipient"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

              {/* Panel Footer */}
              <div className="p-8 border-t border-[#E5EAF0] bg-[#F7FAFC] flex-shrink-0">
                <button
                  onClick={handleNextStep}
                  disabled={!isStep1Valid()}
                  className="w-full py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-bold rounded-lg transition-colors shadow-lg text-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Step 2: Choose Format */}
            <div className={`absolute inset-0 flex flex-col transition-transform duration-500 ${currentStep === 2 ? 'translate-x-0' : 'translate-x-full'}`}>
              {/* Panel Header */}
              <div className="px-8 pt-8 pb-6 relative flex-shrink-0">
                <button
                  onClick={() => setSelectedOccasion(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
                >
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <button
                  onClick={handleBackStep}
                  className="flex items-center gap-2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors mb-6"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <h2 className="text-3xl font-bold text-[#0B1F2A] mb-2">
                  Choose format
                </h2>
                <p className="text-[#5B6B75]">
                  What's the format?
                </p>
              </div>

              {/* Panel Content */}
              <div className="flex-1 px-6 pb-4 flex items-center">
                <div className="grid grid-cols-2 gap-4 w-full mt-2">
                  {/* Board Option */}
                  <button
                    onClick={() => setSelectedFormat('board')}
                    className={`p-4 rounded-xl border-4 transition-all hover:scale-105 ${
                      selectedFormat === 'board'
                        ? 'border-[#2CB1A6] bg-[#E8F5F4]'
                        : 'border-[#E5EAF0] bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-white rounded-lg p-2 flex items-center justify-center">
                      <svg className="w-full h-full text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-[#0B1F2A] mb-1">Board</h3>
                    <p className="text-xs md:text-sm text-[#5B6B75]">
                      Invite <span className="font-bold">multiple</span> people to add content
                    </p>
                  </button>

                  {/* Card Option */}
                  <button
                    onClick={() => setSelectedFormat('card')}
                    className={`p-4 rounded-xl border-4 transition-all hover:scale-105 ${
                      selectedFormat === 'card'
                        ? 'border-[#2CB1A6] bg-[#E8F5F4]'
                        : 'border-[#E5EAF0] bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-white rounded-lg p-2 flex items-center justify-center">
                      <svg className="w-full h-full text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-[#0B1F2A] mb-1">Card</h3>
                    <p className="text-xs md:text-sm text-[#5B6B75]">
                      Perfect if you are the <span className="font-bold">only</span> contributor
                    </p>
                  </button>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="p-8 border-t border-[#E5EAF0] bg-[#F7FAFC] flex-shrink-0">
                <button
                  onClick={async () => {
                    if (user) {
                      // User is logged in, create board and redirect to editor
                      setAuthLoadingState(true);
                      const { board, error } = await createBoard({
                        title: cardTitle,
                        occasion_type: selectedOccasion || '',
                        format_type: selectedFormat || 'board',
                        recipients: recipients.filter(r => r.trim())
                      });

                      if (error) {
                        setToast({ message: 'Error creating board: ' + error, type: 'error' });
                        setAuthLoadingState(false);
                      } else if (board) {
                        // Redirect based on format type
                        if (selectedFormat === 'card') {
                          router.push(`/cards/editor?id=${board.id}`);
                        } else {
                          router.push(`/boards/editor?id=${board.id}`);
                        }
                      }
                    } else {
                      // User not logged in, go to step 3 (auth)
                      setCurrentStep(3);
                    }
                  }}
                  disabled={!selectedFormat || authLoadingState}
                  className="w-full py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-bold rounded-lg transition-colors shadow-lg text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {authLoadingState ? 'Creating...' : 'Next'}
                </button>
              </div>
            </div>

            {/* Step 3: Authentication (only if not logged in) */}
            <div className={`absolute inset-0 flex flex-col transition-transform duration-500 ${currentStep === 3 ? 'translate-x-0' : 'translate-x-full'}`}>
              {/* Panel Header */}
              <div className="px-8 pt-8 pb-6 relative flex-shrink-0">
                <button
                  onClick={() => setSelectedOccasion(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
                >
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors mb-6"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <h2 className="text-3xl font-bold text-[#0B1F2A] mb-2">
                  {isSignIn ? 'Sign In to Continue' : 'Create Your Account'}
                </h2>
                <p className="text-[#5B6B75]">
                  {isSignIn ? 'Sign in to create your board' : 'Quick signup to save and share your board'}
                </p>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-4">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setAuthLoadingState(true);
                  setAuthError(null);

                  if (isSignIn) {
                    const { data, error } = await signIn(email, password);
                    if (error) {
                      setAuthError(error);
                      setAuthLoadingState(false);
                    } else {
                      // Create board and redirect to editor
                      const { board, error: boardError } = await createBoard({
                        title: cardTitle,
                        occasion_type: selectedOccasion || '',
                        format_type: selectedFormat || 'board',
                        recipients: recipients.filter(r => r.trim())
                      });

                      if (boardError) {
                        setAuthError('Error creating board: ' + boardError);
                        setAuthLoadingState(false);
                      } else if (board) {
                        // Redirect based on format type
                        if (selectedFormat === 'card') {
                          router.push(`/cards/editor?id=${board.id}`);
                        } else {
                          router.push(`/boards/editor?id=${board.id}`);
                        }
                      }
                    }
                  } else {
                    const { data, error } = await signUp(email, password, name);
                    if (error) {
                      setAuthError(error);
                      setAuthLoadingState(false);
                    } else {
                      const { data: signInData, error: signInError } = await signIn(email, password);
                      if (signInError) {
                        setAuthError("Account created! Please sign in.");
                        setIsSignIn(true);
                        setAuthLoadingState(false);
                      } else {
                        // Create board and redirect to editor
                        const { board, error: boardError } = await createBoard({
                          title: cardTitle,
                          occasion_type: selectedOccasion || '',
                          format_type: selectedFormat || 'board',
                          recipients: recipients.filter(r => r.trim())
                        });

                        if (boardError) {
                          setAuthError('Error creating board: ' + boardError);
                          setAuthLoadingState(false);
                        } else if (board) {
                          // Redirect based on format type
                          if (selectedFormat === 'card') {
                            router.push(`/cards/editor?id=${board.id}`);
                          } else {
                            router.push(`/boards/editor?id=${board.id}`);
                          }
                        }
                      }
                    }
                  }
                }} className="space-y-4">
                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {authError}
                    </div>
                  )}

                  {!isSignIn && (
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#F7FAFC] border-2 border-transparent rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-[#F7FAFC] border-2 border-transparent rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3 bg-[#F7FAFC] border-2 border-transparent rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoadingState}
                    className="w-full py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {authLoadingState ? "PROCESSING..." : (isSignIn ? "SIGN IN" : "CREATE ACCOUNT")}
                  </button>

                  {isSignIn && (
                    <div className="text-center">
                      <Link
                        href="/reset-password"
                        className="text-sm text-[#2CB1A6] hover:text-[#1F8F86] transition-colors"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignIn(!isSignIn);
                        setAuthError(null);
                      }}
                      className="text-sm text-[#5B6B75] hover:text-[#2CB1A6] transition-colors"
                    >
                      {isSignIn ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E5EAF0]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-[#5B6B75]">or continue with</span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleOAuthSignIn('google')}
                      className="flex items-center justify-center gap-2 py-2.5 border-2 border-[#E5EAF0] rounded-lg hover:bg-[#F7FAFC] transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-xs font-semibold text-[#0B1F2A]">Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuthSignIn('facebook')}
                      className="flex items-center justify-center gap-2 py-2.5 border-2 border-[#E5EAF0] rounded-lg hover:bg-[#F7FAFC] transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-xs font-semibold text-[#0B1F2A]">Facebook</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOAuthSignIn('linkedin')}
                      className="flex items-center justify-center gap-2 py-2.5 border-2 border-[#E5EAF0] rounded-lg hover:bg-[#F7FAFC] transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="text-xs font-semibold text-[#0B1F2A]">LinkedIn</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Overlay */}
      {selectedOccasion && (
        <div
          onClick={() => setSelectedOccasion(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}
    </div>
    </>
  );
}

export default function CreateBoardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#E5EAF0] flex items-center justify-center"><div className="text-[#2CB1A6] text-xl">Loading...</div></div>}>
      <CreateBoardPageContent />
    </Suspense>
  );
}