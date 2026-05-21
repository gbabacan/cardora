"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
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

export default function CardViewPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params promise
  const { id: cardShortId } = use(params);

  const [board, setBoard] = useState<Board | null>(null);
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
  const [showEffects, setShowEffects] = useState(false); // Control when effects appear
  const [cardEmerging, setCardEmerging] = useState(false); // Card emerging from envelope
  const [cardFullyEmerged, setCardFullyEmerged] = useState(false); // Card emergence complete
  const [cardView, setCardView] = useState<'front' | 'inside'>('front');
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDuration, setFlipDuration] = useState(300); // Duration for card flip animation
  const [cardRotation, setCardRotation] = useState(0); // Rotation for 3D card flip
  const [contentOpacity, setContentOpacity] = useState(1); // Show content immediately
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.3); // Start with blurred background

  useEffect(() => {
    loadCardData();
  }, [cardShortId]);

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
      // Start card emerging from envelope
      setTimeout(() => {
        setCardEmerging(true);
      }, 100);
      // Card fully emerged after 1.5 seconds
      setTimeout(() => {
        setCardFullyEmerged(true);
      }, 1500);
    }, 3000);

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
    <>
      {/* Main Content - Start directly with envelope */}
      <div className="min-h-screen relative flex items-center justify-center p-8">
        {/* Background Layer - Blurred when envelope is closed */}
        <div
          className="fixed inset-0 z-0"
          style={
            pageBackground
              ? pageBackground.type === 'PATTERN'
                ? {
                    backgroundImage: getBackgroundCssValue(pageBackground),
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px 200px',
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
        <div className="relative z-10">
          {/* Envelope - Always visible */}
          <div
            className="relative w-[750px] mx-auto"
            onClick={() => !envelopeOpening && !envelopeOpened && handleOpenEnvelope()}
            style={{ cursor: !envelopeOpening && !envelopeOpened ? 'pointer' : 'default' }}
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
              `}</style>
              <div
                className={`relative ${!envelopeOpening && !envelopeOpened ? 'float-animation' : ''}`}
                style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  transformStyle: 'preserve-3d',
                  pointerEvents: envelopeOpened ? 'none' : 'auto',
                  transform: `rotateY(${envelopeRotation}deg)`,
                  transition: 'opacity 0.3s ease-in-out',
                  opacity: envelopeOpened ? 0.8 : 1
                }}
              >
                {/* Envelope Front */}
                <div
                  className="absolute inset-0 rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: board.title_font_color || '#8B4513',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    opacity: envelopeRotation < -90 ? 0 : 1,
                    transition: 'opacity 0.1s',
                    pointerEvents: envelopeRotation < -90 ? 'none' : 'auto'
                  }}
                >
                {/* Stamp */}
                <div className="absolute top-8 right-8 flex items-center">
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
                <div className="absolute top-8 left-8">
                  <div
                    className="space-y-2"
                    style={{
                      fontFamily: board.title_font,
                      color: isLightColor(board.title_font_color || '#8B4513') ? '#1F2937' : '#FFFFFF'
                    }}
                  >
                    <p className="text-xl">
                      <span className="font-semibold">From:</span> {cardMessage?.contributor?.name || 'Sender'}
                    </p>
                    <p className="text-xl">
                      <span className="font-semibold">To:</span> {recipients.filter(r => r).map(r => r.name).join(', ') || 'You'}
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
                    backgroundColor: board.title_font_color || '#8B4513',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    opacity: envelopeRotation <= -90 ? 1 : 0,
                    transition: 'opacity 0.1s',
                    pointerEvents: envelopeRotation <= -90 ? 'auto' : 'none'
                  }}
                >
                  {/* Envelope opened flap with golden lining */}
                  <div className="absolute inset-0">
                    {/* Bottom part of envelope */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-2/3"
                      style={{ backgroundColor: board.title_font_color || '#8B4513' }}
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

          {/* Card - Show after envelope is opened, positioned absolutely on top */}
          {envelopeOpened && (
            <div
              className="absolute cursor-pointer z-20"
              onClick={() => handleFlipCard()}
              style={{
                perspective: '1500px',
                transformStyle: 'preserve-3d',
                // Start from envelope position, emerge to center
                top: cardFullyEmerged ? '50%' : '50%',
                left: '50%',
                transform: cardFullyEmerged
                  ? 'translate(-50%, -50%) translateY(0) scale(1) rotateX(0deg)'
                  : cardEmerging
                    ? 'translate(-50%, -50%) translateY(100px) scale(0.75) rotateX(-15deg) translateZ(-50px)'
                    : 'translate(-50%, -50%) translateY(200px) scale(0.6) rotateX(-25deg) translateZ(-100px)',
                transition: cardEmerging
                  ? 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'none',
                opacity: cardEmerging ? 1 : 0
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
                    <Lottie
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
                        {cardMessage.contributor && (
                          <div className="absolute bottom-8 right-8 text-right">
                            <p className="text-sm text-gray-500">From:</p>
                            <p className="font-semibold text-[#0B1F2A]">
                              {cardMessage.contributor.name}
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

            {/* Flip button - Only show when card is visible */}
            <div className="text-center mt-8">
              <button
                onClick={handleFlipCard}
                className="bg-white/90 hover:bg-white text-[#2CB1A6] p-4 rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(44,177,166,0.4)] transition-all duration-300 hover:scale-110"
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
    </>
  );
}