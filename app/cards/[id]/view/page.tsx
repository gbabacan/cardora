"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LottieAnimation from "@/components/LottieAnimation";
import { useRouter } from "next/navigation";
import { getBoardByShortId } from "@/lib/boards";
import { getBoardMessages } from "@/lib/messages";
import type { Board, Recipient } from "@/lib/boards";
import type { Message } from "@/lib/messages";
import type { Background } from "@/lib/backgrounds";
import type { Effect } from "@/lib/effects";
import Toast from "@/components/Toast";
import EffectOverlay from "@/components/EffectOverlay";
import { loadLottieAnimationData } from "@/lib/lotties";
import { getBackgroundCssValue } from "@/lib/backgrounds";
import { supabase } from "@/lib/supabase";

export default function CardViewPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params promise
  const { id: cardShortId } = use(params);
  const router = useRouter();

  const [envelopeScale, setEnvelopeScale] = useState(1);
  const [board, setBoard] = useState<Board | null>(null);
  const [usingTemplate, setUsingTemplate] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [cardMessage, setCardMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [cardThemeAnimation, setCardThemeAnimation] = useState<any>(null);
  const [pageBackground, setPageBackground] = useState<Background | null>(null);
  const [showIntro, setShowIntro] = useState(false); // Skip intro, show envelope directly
  const [envelopeOpening, setEnvelopeOpening] = useState(false); // Envelope opening animation state
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [envelopeRotation, setEnvelopeRotation] = useState(0); // Rotation degree for envelope
  const [envelopeView, setEnvelopeView] = useState<'front' | 'back'>('front'); // Which side of envelope to show
  const [isFlippingEnvelope, setIsFlippingEnvelope] = useState(false); // Envelope flipping state
  const [showEffects, setShowEffects] = useState(false); // Control when effects appear
  const [cardEmerging, setCardEmerging] = useState(false); // Card emerging from envelope
  const [cardFullyEmerged, setCardFullyEmerged] = useState(false); // Card emergence complete
  const [viewMode, setViewMode] = useState<'envelope' | 'card'>('envelope'); // Toggle between envelope and card view
  const [cardView, setCardView] = useState<'front' | 'inside'>('front');
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDuration, setFlipDuration] = useState(300); // Duration for card flip animation
  const [cardRotation, setCardRotation] = useState(0); // Rotation for 3D card flip
  const [contentOpacity, setContentOpacity] = useState(1); // Show content immediately
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3); // Start with blurred background

  useEffect(() => {
    loadCardData();
  }, [cardShortId]);

  // Scale envelope to fit mobile screens
  useEffect(() => {
    const updateScale = () => {
      // 750px envelope + ~64px toggle button + ~48px gap + padding = ~920px total
      const containerWidth = 920;
      const scale = Math.min(1, window.innerWidth / containerWidth);
      setEnvelopeScale(scale);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Load Google Fonts dynamically when card is loaded
  useEffect(() => {
    if (!board) return;

    // Load fonts from Google Fonts
    const fonts = [board.title_font, board.body_font].filter(Boolean);
    const uniqueFonts = [...new Set(fonts)]; // Remove duplicates

    uniqueFonts.forEach(font => {
      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href*="${font.replace(/\s/g, '+')}"]`);
      if (existingLink) return;

      // Create link element for Google Fonts
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s/g, '+')}:wght@400;500;600;700;800;900&display=swap`;
      document.head.appendChild(link);
    });
  }, [board]);

  // Load card theme animation when board loads
  useEffect(() => {
    const loadCardTheme = async () => {
      if (board?.card_background_data?.type === 'ANIMATION' && board.card_background_data.lottie_animation) {
        const animData = await loadLottieAnimationData(board.card_background_data.lottie_animation as any);
        setCardThemeAnimation(animData);
      } else {
        setCardThemeAnimation(null);
      }
    };

    loadCardTheme();
  }, [board]);

  // Content and background are shown immediately (no intro)

  // Handle envelope opening sequence
  const handleOpenEnvelope = () => {
    setEnvelopeOpening(true);

    // Animate rotation smoothly over 3 seconds using requestAnimationFrame
    const startTime = Date.now();
    const duration = 3000;
    const targetRotation = -180;

    const animateRotation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-in-out function
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentRotation = easeProgress * targetRotation;
      setEnvelopeRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        // Ensure rotation stays at -180 after animation completes
        setEnvelopeRotation(-180);
      }
    };

    animateRotation();

    // Start showing effects at the middle of the flip (1.5 seconds)
    setTimeout(() => {
      setShowEffects(true);
    }, 1500);

    // Gradually increase background opacity during the animation
    setTimeout(() => {
      setBackgroundOpacity(0.5);
    }, 750);

    setTimeout(() => {
      setBackgroundOpacity(0.7);
    }, 1500);

    setTimeout(() => {
      setBackgroundOpacity(0.9);
    }, 2250);

    // After 3 seconds of animation, set full opacity and start card emergence
    setTimeout(() => {
      setBackgroundOpacity(1);
      setEnvelopeOpened(true);
      setEnvelopeView('back'); // Set to back view after opening
      // Start card emerging from envelope
      setTimeout(() => {
        setCardEmerging(true);
      }, 100);
      // Card fully emerged after 1.5 seconds
      setTimeout(() => {
        setCardFullyEmerged(true);
      }, 1500);
    }, 3000);

    // Switch view mode to card after emergence completes
    setTimeout(() => {
      setViewMode('card');
    }, 4500);

    // Automatically flip the card to show the inside after card emerges and displays (8 seconds total: 3s envelope + 1.5s emergence + 3.5s display)
    // Use slower flip animation (1000ms) for the automatic flip
    setTimeout(() => {
      handleFlipCard(1000);
    }, 8000);
  };

  // Helper function to check if a color is light
  const isLightColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  const loadCardData = async () => {
    setLoading(true);

    console.log('Loading card with short_id:', cardShortId);

    // Fetch card by short_id
    const { board: cardData, recipients: recipientsData, error: boardError } = await getBoardByShortId(cardShortId);

    console.log('getBoardByShortId result:', { cardData, recipientsData, boardError });

    if (boardError || !cardData) {
      console.error('Error loading card:', boardError);
      setToast({ message: 'Card not found', type: 'error' });
      setLoading(false);
      return;
    }

    // Ensure this is a card, not a board
    if (cardData.format_type !== 'card') {
      console.error('Format type is not card:', cardData.format_type);
      setToast({ message: 'This is not a card', type: 'error' });
      setLoading(false);
      return;
    }

    setBoard(cardData);
    setRecipients(recipientsData);

    // Load page background if exists
    if (cardData.background_data) {
      setPageBackground(cardData.background_data);
    }

    // Fetch card message (cards have exactly one message)
    const { messages: messagesData, error: messagesError } = await getBoardMessages(cardData.id);

    if (messagesError) {
      setToast({ message: 'Error loading card message', type: 'error' });
    } else if (messagesData && messagesData.length > 0) {
      setCardMessage(messagesData[0]);
    }

    setLoading(false);
  };

  const handleFlipCard = (duration: number = 300) => {
    if (isFlipping) return;

    setFlipDuration(duration);
    setIsFlipping(true);

    // Animate to target rotation
    const targetRotation = cardView === 'front' ? 180 : 0;
    setCardRotation(targetRotation);

    // Switch content at the halfway point (when card is perpendicular)
    setTimeout(() => {
      setCardView(cardView === 'front' ? 'inside' : 'front');
    }, duration / 2);

    // End flipping state
    setTimeout(() => {
      setIsFlipping(false);
    }, duration);
  };

  const handleFlipEnvelope = () => {
    if (isFlippingEnvelope) return;

    setIsFlippingEnvelope(true);

    // Calculate target rotation based on current view
    const currentRotation = envelopeRotation;
    const targetRotation = envelopeView === 'front' ? currentRotation - 180 : currentRotation + 180;

    // Animate rotation
    setEnvelopeRotation(targetRotation);

    // Switch view at halfway point
    setTimeout(() => {
      setEnvelopeView(envelopeView === 'front' ? 'back' : 'front');
    }, 150);

    // End flipping state
    setTimeout(() => {
      setIsFlippingEnvelope(false);
    }, 300);
  };

  const handleUseTemplate = async () => {
    if (!board) return;
    setUsingTemplate(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirect=/cards/${cardShortId}/view`);
        return;
      }

      const { data: newCard, error } = await supabase
        .from('boards')
        .insert({
          user_id: user.id,
          title: board.title,
          occasion_type: board.occasion_type,
          format_type: 'card',
          background_id: board.background_id,
          card_background_id: board.card_background_id,
          effect_id: board.effect_id,
          texture_id: board.texture_id,
          header_color: board.header_color,
          header_color_code: board.header_color_code,
          title_font: board.title_font,
          title_font_size: board.title_font_size,
          title_font_color: board.title_font_color,
          body_font: board.body_font,
          envelope_font: board.envelope_font,
          envelope_color: board.envelope_color,
          intro_animation: board.intro_animation,
          status: 'CREATED',
          delivery_type: 'ON_DEMAND',
          notify_contributors: true,
          is_template: false,
        })
        .select()
        .single();

      if (error || !newCard) {
        setToast({ message: 'Failed to create card from template', type: 'error' });
        setUsingTemplate(false);
        return;
      }

      router.push(`/cards/editor?id=${newCard.id}`);
    } catch (err) {
      setToast({ message: 'Something went wrong', type: 'error' });
      setUsingTemplate(false);
    }
  };

  const handleReplayAnimation = () => {
    // Reset all states to beginning
    setEnvelopeOpening(false);
    setEnvelopeOpened(false);
    setEnvelopeRotation(0);
    setEnvelopeView('front');
    setShowEffects(false);
    setCardEmerging(false);
    setCardFullyEmerged(false);
    setViewMode('envelope');
    setCardView('front');
    setCardRotation(0);
    setBackgroundOpacity(0.3);
    setIsFlipping(false);
    setIsFlippingEnvelope(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-[#2CB1A6] text-xl">Loading card...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0B1F2A] mb-4">Card Not Found</h1>
          <p className="text-[#5B6B75] mb-6">This card doesn't exist or has been deleted.</p>
          <Link href="/">
            <button className="px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-lg transition-colors">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      {/* Logo and Company Name - Upper Left */}
      {envelopeOpened && (
        <Link href="/" className="no-print fixed top-4 md:top-8 left-5 md:left-8 z-50 flex items-center gap-2 md:gap-3 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer opacity-0 animate-[fadeIn_0.5s_ease-in-out_0.5s_forwards]">
          <Image
            src="/cardoraLogo.png"
            alt="Cardora Logo"
            width={40}
            height={40}
            className="w-5 h-5 md:w-8 md:h-8 object-contain"
          />
          <span className="text-sm md:text-2xl font-bold text-[#2CB1A6]">Cardora</span>
        </Link>
      )}

      {/* Action Buttons - Upper Right */}
      {envelopeOpened && (
        <div className="fixed top-4 md:top-8 right-5 md:right-8 z-50 flex items-center gap-2 md:gap-4">
          {/* Print Button or Use This Template */}
          {board?.is_template ? (
            <button
              onClick={handleUseTemplate}
              disabled={usingTemplate}
              className="no-print flex items-center gap-1.5 md:gap-3 bg-[#2CB1A6] hover:bg-[#1F8F86] px-3 md:px-6 py-1.5 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer opacity-0 animate-[fadeIn_0.5s_ease-in-out_0.5s_forwards] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm md:text-xl font-bold text-white">
                {usingTemplate ? 'Creating...' : 'Use Template'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => window.print()}
              className="no-print flex items-center gap-1.5 md:gap-3 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer opacity-0 animate-[fadeIn_0.5s_ease-in-out_0.5s_forwards]"
              title="Print / Save as PDF"
            >
              <svg className="w-5 h-5 md:w-10 md:h-10 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden md:inline text-2xl font-bold text-[#2CB1A6]">Print</span>
            </button>
          )}

          {/* Replay Button */}
          <button
            onClick={handleReplayAnimation}
            className="no-print flex items-center gap-1.5 md:gap-3 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer opacity-0 animate-[fadeIn_0.5s_ease-in-out_0.5s_forwards]"
            title="Replay Animation"
          >
            <svg className="w-5 h-5 md:w-10 md:h-10 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden md:inline text-2xl font-bold text-[#2CB1A6]">Replay</span>
          </button>
        </div>
      )}

      {/* Main Content - Start directly with envelope */}
      <div className="interactive-card-view min-h-screen relative flex items-center justify-center p-8 overflow-x-hidden">
        {/* Background Layer - Blurred when envelope is closed */}
        <div
          className="fixed inset-0 z-0"
          style={
            pageBackground
              ? pageBackground.type === 'PATTERN'
                ? {
                    backgroundImage: getBackgroundCssValue(pageBackground),
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'clamp(300px, 40vmin, 1200px) clamp(300px, 40vmin, 1200px)',
                    opacity: backgroundOpacity,
                    filter: envelopeOpening || envelopeOpened ? 'none' : 'blur(4px)',
                    transition: envelopeOpening ? 'filter 3s ease-in-out, opacity 3s ease-in-out' : 'none'
                  }
                : {
                    background: getBackgroundCssValue(pageBackground),
                    opacity: backgroundOpacity,
                    filter: envelopeOpening || envelopeOpened ? 'none' : 'blur(4px)',
                    transition: envelopeOpening ? 'filter 3s ease-in-out, opacity 3s ease-in-out' : 'none'
                  }
              : {
                  background: 'linear-gradient(to bottom right, rgb(252, 231, 243), rgb(249, 168, 212), rgb(236, 72, 153))',
                  opacity: backgroundOpacity,
                  filter: envelopeOpening || envelopeOpened ? 'none' : 'blur(4px)',
                  transition: envelopeOpening ? 'filter 2s ease-in-out, opacity 2s ease-in-out' : 'none'
                }
          }
        />

        {/* Effect Overlay - Show when envelope reaches middle of flip */}
        {showEffects && board.effect_data && <EffectOverlay effect={board.effect_data} />}

        {/* Envelope or Card Container - Always sharp */}
        <div
          className="relative z-10 flex flex-col items-center justify-center gap-8"
          style={envelopeScale < 1 ? { transform: `scale(${envelopeScale})`, transformOrigin: 'center center' } : undefined}
        >
          <div className="flex items-center justify-center gap-12">
            {/* Toggle Button - Left of envelope */}
            {cardFullyEmerged && (
              <div className="no-print flex flex-col gap-4">
                <button
                  onClick={() => setViewMode(viewMode === 'envelope' ? 'card' : 'envelope')}
                  className="bg-white/90 hover:bg-white text-[#2CB1A6] p-4 rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(44,177,166,0.4)] transition-all duration-300 hover:scale-110"
                  title={viewMode === 'envelope' ? 'View Card' : 'View Envelope'}
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {viewMode === 'envelope' ? (
                      /* Show card icon when viewing envelope */
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    ) : (
                      /* Show envelope icon when viewing card */
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            )}

            {/* Envelope - Always visible */}
            <div
              className="relative w-[750px]"
              onClick={() => {
                if (!envelopeOpening && !envelopeOpened) {
                  handleOpenEnvelope();
                } else if (envelopeOpened && viewMode === 'envelope') {
                  handleFlipEnvelope();
                }
              }}
              style={{
                cursor: (!envelopeOpening && !envelopeOpened) || (envelopeOpened && viewMode === 'envelope') ? 'pointer' : 'default',
                opacity: viewMode === 'card' ? 0.4 : 1,
                transform: viewMode === 'card' ? 'scale(0.8) translateY(20px)' : 'scale(1) translateY(0)',
                transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
                zIndex: viewMode === 'envelope' ? 20 : 5,
                pointerEvents: viewMode === 'card' ? 'none' : 'auto'
              }}
            >
              <style jsx>{`
                @keyframes floatAnimation {
                  0%, 100% {
                    transform: translateY(0px);
                  }
                  50% {
                    transform: translateY(-20px);
                  }
                }
                .float-animation {
                  animation: floatAnimation 3s ease-in-out infinite;
                }
                @keyframes envelopeOpen {
                  0% {
                    transform: rotateY(0deg);
                    opacity: 1;
                  }
                  100% {
                    transform: rotateY(-180deg);
                    opacity: 0.8;
                  }
                }
                .envelope-opening {
                  animation: envelopeOpen 3s ease-in-out forwards;
                }
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(-10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
              <div
                className={`relative ${!envelopeOpening && !envelopeOpened ? 'float-animation' : ''}`}
                style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  transformStyle: 'preserve-3d',
                  pointerEvents: envelopeOpened ? 'none' : 'auto',
                  transform: `rotateY(${envelopeRotation}deg)`,
                  transition: isFlippingEnvelope ? 'transform 300ms ease-in-out, opacity 0.3s ease-in-out' : 'opacity 0.3s ease-in-out',
                  opacity: viewMode === 'envelope' ? 1 : (envelopeOpened ? 0.8 : 1)
                }}
              >
                {/* Envelope Front */}
                <div
                  className="absolute inset-0 rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: board.envelope_color || '#8B4513',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    opacity: envelopeView === 'front' ? 1 : 0,
                    transition: 'opacity 0.1s',
                    pointerEvents: envelopeView === 'front' ? 'auto' : 'none'
                  }}
                >
                {/* Stamp */}
                <div className="absolute top-[6%] right-[3%] flex items-center">
                  {/* Postmark SVG */}
                  <div className="relative w-32 h-32 -mr-4 z-10">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Outer circle */}
                      <circle
                        cx="70"
                        cy="100"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                        opacity="0.7"
                        className="text-gray-800"
                      />
                      {/* Middle circle */}
                      <circle
                        cx="70"
                        cy="100"
                        r="38"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeDasharray="6 3"
                        opacity="0.6"
                        className="text-gray-800"
                      />
                      {/* Inner circle */}
                      <circle
                        cx="70"
                        cy="100"
                        r="31"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="5 2"
                        opacity="0.5"
                        className="text-gray-800"
                      />
                      {/* Wavy lines */}
                      <path d="M 115 75 Q 135 70, 155 75 T 195 75" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" className="text-gray-800" />
                      <path d="M 115 87 Q 135 82, 155 87 T 195 87" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6" className="text-gray-800" />
                      <path d="M 115 100 Q 135 95, 155 100 T 195 100" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" className="text-gray-800" />
                      <path d="M 115 113 Q 135 108, 155 113 T 195 113" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6" className="text-gray-800" />
                      <path d="M 115 125 Q 135 120, 155 125 T 195 125" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" className="text-gray-800" />
                    </svg>
                  </div>

                  {/* Cardora Stamp */}
                  <div className="w-28 h-20 transform rotate-2">
                    <div className="relative w-full h-full bg-white shadow-lg" style={{
                      clipPath: `polygon(
                        0 3px, 3px 3px, 3px 0, 6px 0, 6px 3px, 9px 3px, 9px 0, 12px 0, 12px 3px, 15px 3px, 15px 0, 18px 0, 18px 3px, 21px 3px, 21px 0, 24px 0, 24px 3px, 27px 3px, 27px 0, 30px 0, 30px 3px, 33px 3px, 33px 0, 36px 0, 36px 3px, 39px 3px, 39px 0, 42px 0, 42px 3px, 45px 3px, 45px 0, 48px 0, 48px 3px, 51px 3px, 51px 0, 54px 0, 54px 3px, 57px 3px, 57px 0, 60px 0, 60px 3px, 63px 3px, 63px 0, 66px 0, 66px 3px, 69px 3px, 69px 0, 72px 0, 72px 3px, 75px 3px, 75px 0, 78px 0, 78px 3px, 81px 3px, 81px 0, 84px 0, 84px 3px, 87px 3px, 87px 0, 90px 0, 90px 3px, 93px 3px, 93px 0, 96px 0, 96px 3px, 99px 3px, 99px 0, 102px 0, 102px 3px, 105px 3px, 105px 0, 108px 0, 108px 3px, 111px 3px, 111px 0, 112px 0,
                        112px 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% 9px, calc(100% - 3px) 9px, calc(100% - 3px) 12px, 100% 12px, 100% 15px, calc(100% - 3px) 15px, calc(100% - 3px) 18px, 100% 18px, 100% 21px, calc(100% - 3px) 21px, calc(100% - 3px) 24px, 100% 24px, 100% 27px, calc(100% - 3px) 27px, calc(100% - 3px) 30px, 100% 30px, 100% 33px, calc(100% - 3px) 33px, calc(100% - 3px) 36px, 100% 36px, 100% 39px, calc(100% - 3px) 39px, calc(100% - 3px) 42px, 100% 42px, 100% 45px, calc(100% - 3px) 45px, calc(100% - 3px) 48px, 100% 48px, 100% 51px, calc(100% - 3px) 51px, calc(100% - 3px) 54px, 100% 54px, 100% 57px, calc(100% - 3px) 57px, calc(100% - 3px) 60px, 100% 60px, 100% 63px, calc(100% - 3px) 63px, calc(100% - 3px) 66px, 100% 66px, 100% 69px, calc(100% - 3px) 69px, calc(100% - 3px) 72px, 100% 72px, 100% 75px, calc(100% - 3px) 75px, calc(100% - 3px) 78px, 100% 78px, 100% 80px,
                        calc(100% - 3px) calc(100% - 3px), 108px calc(100% - 3px), 108px 100%, 105px 100%, 105px calc(100% - 3px), 102px calc(100% - 3px), 102px 100%, 99px 100%, 99px calc(100% - 3px), 96px calc(100% - 3px), 96px 100%, 93px 100%, 93px calc(100% - 3px), 90px calc(100% - 3px), 90px 100%, 87px 100%, 87px calc(100% - 3px), 84px calc(100% - 3px), 84px 100%, 81px 100%, 81px calc(100% - 3px), 78px calc(100% - 3px), 78px 100%, 75px 100%, 75px calc(100% - 3px), 72px calc(100% - 3px), 72px 100%, 69px 100%, 69px calc(100% - 3px), 66px calc(100% - 3px), 66px 100%, 63px 100%, 63px calc(100% - 3px), 60px calc(100% - 3px), 60px 100%, 57px 100%, 57px calc(100% - 3px), 54px calc(100% - 3px), 54px 100%, 51px 100%, 51px calc(100% - 3px), 48px calc(100% - 3px), 48px 100%, 45px 100%, 45px calc(100% - 3px), 42px calc(100% - 3px), 42px 100%, 39px 100%, 39px calc(100% - 3px), 36px calc(100% - 3px), 36px 100%, 33px 100%, 33px calc(100% - 3px), 30px calc(100% - 3px), 30px 100%, 27px 100%, 27px calc(100% - 3px), 24px calc(100% - 3px), 24px 100%, 21px 100%, 21px calc(100% - 3px), 18px calc(100% - 3px), 18px 100%, 15px 100%, 15px calc(100% - 3px), 12px calc(100% - 3px), 12px 100%, 9px 100%, 9px calc(100% - 3px), 6px calc(100% - 3px), 6px 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px), 0 100%,
                        0 calc(100% - 3px), 3px calc(100% - 3px), 3px 75px, 0 75px, 0 72px, 3px 72px, 3px 69px, 0 69px, 0 66px, 3px 66px, 3px 63px, 0 63px, 0 60px, 3px 60px, 3px 57px, 0 57px, 0 54px, 3px 54px, 3px 51px, 0 51px, 0 48px, 3px 48px, 3px 45px, 0 45px, 0 42px, 3px 42px, 3px 39px, 0 39px, 0 36px, 3px 36px, 3px 33px, 0 33px, 0 30px, 3px 30px, 3px 27px, 0 27px, 0 24px, 3px 24px, 3px 21px, 0 21px, 0 18px, 3px 18px, 3px 15px, 0 15px, 0 12px, 3px 12px, 3px 9px, 0 9px, 0 6px, 3px 6px, 3px 3px
                      )`
                    }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#2CB1A6] font-bold text-base">Cardora</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* From Section in upper left */}
                <div className="absolute top-[6%] left-[3%]">
                  <div
                    className="space-y-1"
                    style={{
                      fontFamily: board.title_font,
                      color: isLightColor(board.title_font_color || '#8B4513') ? '#1F2937' : '#FFFFFF'
                    }}
                  >
                    <p className="text-xl">
                      <span className="font-semibold">From:</span> {board.is_template ? 'James Mitchell' : (cardMessage?.contributor?.name || 'Sender')}
                    </p>
                    <p className="text-xl">
                      <span className="font-semibold">To:</span> {board.is_template ? 'Sarah Bennett' : (recipients.filter(r => r).map(r => r.name).join(', ') || 'You')}
                    </p>
                  </div>
                </div>

                {/* Title in center */}
                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <h2
                    className="font-bold text-center"
                    style={{
                      fontFamily: board.title_font || 'Inter',
                      fontSize: `${board.title_font_size || 48}px`,
                      color: isLightColor(board.title_font_color || '#8B4513') ? '#1F2937' : '#FFFFFF'
                    }}
                  >
                    {board.title}
                  </h2>
                </div>
                </div>

                {/* Envelope Back */}
                <div
                  className="absolute inset-0 rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: board.envelope_color || '#8B4513',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    opacity: envelopeView === 'back' ? 1 : 0,
                    transition: 'opacity 0.1s',
                    pointerEvents: envelopeView === 'back' ? 'auto' : 'none'
                  }}
                >
                  {/* Envelope opened flap with golden lining */}
                  <div className="absolute inset-0">
                    {/* Bottom part of envelope */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-2/3"
                      style={{ backgroundColor: board.envelope_color || '#8B4513' }}
                    />

                    {/* Top flap opened */}
                    <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden">
                      <div
                        className="absolute inset-0 origin-top"
                        style={{
                          backgroundColor: '#D4AF37',
                          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                          transform: 'scaleY(1.2) translateY(-10%)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Envelope Button */}
              {!envelopeOpening && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleOpenEnvelope}
                    className="bg-white text-[#0B1F2A] px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transform transition-all shadow-lg hover:shadow-2xl"
                  >
                    Open Envelope
                  </button>
                </div>
              )}
            </div>

            {/* Card - Show after envelope is opened */}
            {envelopeOpened && (
              <div
                className="absolute cursor-pointer"
                onClick={() => viewMode === 'card' && handleFlipCard()}
                style={{
                  perspective: '1500px',
                  transformStyle: 'preserve-3d',
                  top: '50%',
                  left: '50%',
                  // Animation: start from behind and below -> go up -> settle down to center
                  // When switching to envelope view, slide back behind
                  transform: viewMode === 'envelope'
                    ? 'translate(-50%, -50%) translateY(30px) scale(0.75)'
                    : cardFullyEmerged
                      ? 'translate(-50%, -50%) translateY(0) scale(1)'
                      : cardEmerging
                        ? 'translate(-50%, -50%) translateY(-80px) scale(0.85)'
                        : 'translate(-50%, -50%) translateY(50px) scale(0.7)',
                  transition: cardEmerging
                    ? 'transform 1.5s cubic-bezier(0.45, 0.05, 0.55, 0.95), opacity 1.2s ease-in-out'
                    : 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out',
                  // Keep card visible but dimmed when behind envelope
                  opacity: viewMode === 'envelope' ? 0.3 : (cardFullyEmerged ? 1 : cardEmerging ? 0.6 : 0),
                  // z-index: envelope on top when in envelope mode, card on top when in card mode
                  zIndex: viewMode === 'envelope' ? 5 : (cardFullyEmerged ? 20 : 5),
                  pointerEvents: viewMode === 'envelope' ? 'none' : 'auto'
                }}
              >
              {cardView === 'front' ? (
              /* Card Front */
              <div
                className="bg-white rounded-xl shadow-2xl overflow-hidden"
                style={{
                  width: '550px',
                  height: '750px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  transform: `rotateY(${cardRotation}deg)`,
                  transition: `transform ${flipDuration}ms ease-in-out`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Card Theme Animation */}
                {cardThemeAnimation ? (
                  <div className="absolute inset-0 z-0">
                    <LottieAnimation
                      animationData={cardThemeAnimation}
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100" />
                )}

                {/* Texture Overlay */}
                {board.texture_data && (
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      backgroundImage: `url(${board.texture_data.file_path})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      mixBlendMode: 'multiply',
                      opacity: 0.3
                    }}
                  />
                )}
              </div>
            ) : (
              /* Card Inside */
              <div
                className="bg-white rounded-xl shadow-2xl overflow-hidden"
                style={{
                  width: '550px',
                  height: '750px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  transform: `rotateY(${cardRotation}deg)`,
                  transition: `transform ${flipDuration}ms ease-in-out`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div
                  className="h-full flex flex-col relative"
                  style={{
                    transform: 'rotateY(180deg)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Texture Overlay on Card Inside */}
                  {board.texture_data && (
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        backgroundImage: `url(${board.texture_data.file_path})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        mixBlendMode: 'multiply',
                        opacity: 0.3
                      }}
                    />
                  )}

                  {cardMessage ? (
                    <>
                      {/* Media Panel - Top Half */}
                      {cardMessage.media && cardMessage.media.length > 0 && (
                        <div className="h-1/2 bg-gray-50 flex items-center justify-center p-8 relative">
                          {cardMessage.media[0].file_type === 'image' || cardMessage.media[0].file_type === 'gif' ? (
                            <img
                              src={cardMessage.media[0].file_url}
                              alt="Card media"
                              className="max-w-full max-h-full object-contain rounded-lg"
                            />
                          ) : cardMessage.media[0].file_type === 'video' ? (
                            <video
                              src={cardMessage.media[0].file_url}
                              controls
                              className="max-w-full max-h-full rounded-lg"
                            />
                          ) : cardMessage.media[0].file_type === 'audio' ? (
                            <audio
                              src={cardMessage.media[0].file_url}
                              controls
                              className="w-full"
                            />
                          ) : null}
                        </div>
                      )}

                      {/* Message Panel - Bottom Half */}
                      <div className="flex-1 p-8 bg-white flex flex-col justify-center overflow-y-auto relative">
                        {/* Message Content */}
                        <div
                          className="prose prose-sm max-w-none text-center"
                          style={{
                            fontFamily: board.body_font || 'Inter'
                          }}
                          dangerouslySetInnerHTML={{ __html: cardMessage.content }}
                        />

                        {/* From - Bottom Right */}
                        {(cardMessage.contributor || board.is_template) && (
                          <div className="absolute bottom-8 right-8 text-right">
                            <p className="text-sm text-gray-500">From:</p>
                            <p className="font-semibold text-[#0B1F2A]">
                              {board.is_template ? 'James Mitchell' : cardMessage.contributor?.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                      No message
                    </div>
                  )}
                </div>
              </div>
            )}

            </div>
            )}
          </div>

          {/* Flip button - Show below envelope or card */}
          {cardFullyEmerged && (
            <div className="flex justify-center mt-8 ml-[700px]">
              <button
                onClick={viewMode === 'envelope' ? handleFlipEnvelope : () => handleFlipCard()}
                className="bg-white/90 hover:bg-white text-[#2CB1A6] p-4 rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(44,177,166,0.4)] transition-all duration-300 hover:scale-110"
                title={viewMode === 'envelope' ? 'Flip Envelope' : 'Flip Card'}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Print-Only Layout - Hidden on screen, visible when printing */}
      <div className="hidden print-only-layout">
        {/* Page 1: Envelope Front */}
        <div className="print-page">
          <div className="w-[750px] aspect-[16/10] relative rounded-lg overflow-hidden shadow-2xl"
            style={{ backgroundColor: board.envelope_color || '#8B4513' }}>
            {/* Stamp */}
            <div className="absolute top-8 right-8 flex items-center">
              {/* Postmark SVG */}
              <div className="relative w-32 h-32 -mr-4 z-10">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="70" cy="100" r="45" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="8 4" opacity="0.7" className="text-gray-800" />
                  <circle cx="70" cy="100" r="38" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.6" className="text-gray-800" />
                  <circle cx="70" cy="100" r="31" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 2" opacity="0.5" className="text-gray-800" />
                  <path d="M 115 75 Q 135 70, 155 75 T 195 75" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" className="text-gray-800" />
                  <path d="M 115 87 Q 135 82, 155 87 T 195 87" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6" className="text-gray-800" />
                  <path d="M 115 100 Q 135 95, 155 100 T 195 100" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" className="text-gray-800" />
                  <path d="M 115 113 Q 135 108, 155 113 T 195 113" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6" className="text-gray-800" />
                  <path d="M 115 125 Q 135 120, 155 125 T 195 125" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" className="text-gray-800" />
                </svg>
              </div>

              {/* Cardora Stamp */}
              <div className="w-28 h-20">
                <div className="relative w-full h-full bg-white shadow-lg flex items-center justify-center">
                  <span className="text-[#2CB1A6] font-bold text-base">Cardora</span>
                </div>
              </div>
            </div>

            {/* From Section */}
            <div className="absolute top-8 left-8 space-y-2">
              <div className="text-sm font-medium opacity-80" style={{ color: board.envelope_font === 'cursive' ? '#333' : '#222', fontFamily: board.envelope_font || 'serif' }}>
                From:
              </div>
              <div className="font-semibold text-lg" style={{ color: board.envelope_font === 'cursive' ? '#111' : '#000', fontFamily: board.envelope_font || 'serif' }}>
                {board.is_template ? 'James Mitchell' : (cardMessage?.contributor?.name || 'Sender')}
              </div>
            </div>

            {/* To Section (centered) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-center space-y-3">
                <div className="text-base font-medium opacity-90" style={{ color: board.envelope_font === 'cursive' ? '#333' : '#222', fontFamily: board.envelope_font || 'serif' }}>
                  To:
                </div>
                <div className="font-bold" style={{
                  fontSize: board.title_font_size ? `${board.title_font_size}px` : '48px',
                  color: board.title_font_color || '#000',
                  fontFamily: board.title_font || 'serif'
                }}>
                  {board.is_template ? 'Sarah Bennett' : recipients.map(r => r.name).join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 2: Card Front */}
        <div className="print-page">
          <div className="w-[600px] aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl bg-white flex items-center justify-center"
            style={
              board.card_background_data
                ? {
                    backgroundImage: `url(${board.card_background_data.pattern?.file_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }
                : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
            }>
            {/* Card Title if exists */}
            {board.title && (
              <div className="text-center p-8">
                <h1 className="font-bold" style={{
                  fontSize: board.title_font_size ? `${board.title_font_size}px` : '48px',
                  color: board.title_font_color || '#fff',
                  fontFamily: board.title_font || 'serif'
                }}>
                  {board.title}
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Page 3: Card Inside with Message */}
        <div className="print-page">
          <div className="w-[600px] aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl bg-white p-12"
            style={
              board.texture_data
                ? {
                    backgroundImage: `url(${board.texture_data.file_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }
                : { background: 'white' }
            }>
            {/* Message Content */}
            <div className="h-full flex flex-col">
              {/* Message */}
              {cardMessage && (
                <div className="flex-1 overflow-hidden">
                  <div
                    className="prose prose-sm max-w-none"
                    style={{ fontFamily: board.body_font || 'sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: cardMessage.content || '' }}
                  />
                </div>
              )}

              {/* Media if exists */}
              {cardMessage?.media && cardMessage.media.length > 0 && (
                <div className="mt-6 flex justify-center">
                  <img
                    src={cardMessage.media[0].file_url}
                    alt="Card media"
                    className="max-w-full max-h-64 object-contain rounded-lg"
                  />
                </div>
              )}

              {/* Sender Name */}
              <div className="mt-8 text-right">
                <p className="text-lg font-semibold" style={{ fontFamily: board.body_font || 'sans-serif' }}>
                  - {board.is_template ? 'James Mitchell' : (cardMessage?.contributor?.name || 'Sender')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}