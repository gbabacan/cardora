"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
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
import { supabase } from "@/lib/supabase";

export default function RecipientViewPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params promise
  const { id: boardShortId } = use(params);
  const router = useRouter();

  const [board, setBoard] = useState<Board | null>(null);
  const [usingTemplate, setUsingTemplate] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [lottieAnimation, setLottieAnimation] = useState<any>(null);
  const [selectedLottieAnimation, setSelectedLottieAnimation] = useState<any>(null);
  const [background, setBackground] = useState<Background | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.4);
  const [showHeader, setShowHeader] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadBoardData();
    loadLottieAnimation();
  }, [boardShortId]);

  // Load remote Lottie animation
  const loadLottieAnimation = async () => {
    try {
      const remoteLottieUrl = 'https://assets-v2.lottiefiles.com/a/6a0cd638-48b9-11ef-b744-db583b43c862/KzeQAnBTz3.json';
      const response = await fetch(remoteLottieUrl);
      if (response.ok) {
        const animationData = await response.json();
        setLottieAnimation(animationData);
      } else {
        console.error('Failed to load remote Lottie animation');
      }
    } catch (error) {
      console.error('Error loading Lottie animation:', error);
    }
  };

  // Load Google Fonts dynamically when board is loaded
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

  // Load selected Lottie animation data when background changes
  useEffect(() => {
    const loadSelectedAnimation = async () => {
      if (background?.type === 'ANIMATION' && background.lottie_animation) {
        const animData = await loadLottieAnimationData(background.lottie_animation as any);
        setSelectedLottieAnimation(animData);
      } else {
        setSelectedLottieAnimation(null);
      }
    };

    loadSelectedAnimation();
  }, [background]);

  // Fade in content and background when intro is dismissed
  useEffect(() => {
    if (!showIntro) {
      setContentOpacity(1);
      setBackgroundOpacity(1);
      // Show header after 2 seconds delay
      const headerTimer = setTimeout(() => {
        setShowHeader(true);
      }, 2000);

      return () => clearTimeout(headerTimer);
    }
  }, [showIntro]);

  // Show messages one by one starting after 4 seconds
  useEffect(() => {
    if (!showIntro && messages.length > 0) {
      const timers: NodeJS.Timeout[] = [];

      messages.forEach((message, index) => {
        const timer = setTimeout(() => {
          setVisibleMessages(prev => new Set(prev).add(message.id));
        }, 4000 + (index * 750)); // Start at 4s, then add 750ms per message

        timers.push(timer);
      });

      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [showIntro, messages]);

  const handleUseTemplate = async () => {
    if (!board) return;
    setUsingTemplate(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?redirect=/boards/${boardShortId}/view`);
        return;
      }

      const { data: newBoard, error } = await supabase
        .from('boards')
        .insert({
          user_id: user.id,
          title: board.title,
          occasion_type: board.occasion_type,
          format_type: 'board',
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

      if (error || !newBoard) {
        setToast({ message: 'Failed to create board from template', type: 'error' });
        setUsingTemplate(false);
        return;
      }

      router.push(`/boards/editor?id=${newBoard.id}`);
    } catch (err) {
      setToast({ message: 'Something went wrong', type: 'error' });
      setUsingTemplate(false);
    }
  };

  const loadBoardData = async () => {
    setLoading(true);

    // Fetch board by short_id
    const { board: boardData, recipients: recipientsData, error: boardError } = await getBoardByShortId(boardShortId);

    if (boardError || !boardData) {
      setToast({ message: 'Board not found', type: 'error' });
      setLoading(false);
      return;
    }

    setBoard(boardData);
    setRecipients(recipientsData);

    // Load background - prioritize card_background_data (occasion lottie) over background_data (page background)
    if (boardData.card_background_data) {
      setBackground(boardData.card_background_data);
    } else if (boardData.background_data) {
      setBackground(boardData.background_data);
    }

    // Fetch messages
    const { messages: messagesData, error: messagesError } = await getBoardMessages(boardData.id);

    if (messagesError) {
      setToast({ message: 'Error loading messages', type: 'error' });
    } else {
      setMessages(messagesData);
    }

    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-[#2CB1A6] text-xl">Loading board...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0B1F2A] mb-4">Board Not Found</h1>
          <p className="text-[#5B6B75] mb-6">This board doesn't exist or has been deleted.</p>
          <Link href="/">
            <button className="px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-lg transition-colors">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formatName = board.format_type === 'board' ? 'board' : 'card';
  const isDelivered = board.status === 'DELIVERED';

  return (
    <>
      {/* Intro Overlay - Shows before revealing the board - OUTSIDE main container */}
      {showIntro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-lg bg-black/20">
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
          `}</style>
          <div className="bg-[#2CB1A6] rounded-3xl shadow-2xl px-20 py-16 max-w-4xl w-full mx-4 text-center float-animation" style={{ opacity: 1 }}>
            {/* Cardora Logo/Name */}
            <div className="mb-8 flex items-center justify-center gap-4">
              <Image
                src="/cardoraLogo.png"
                alt="Cardora"
                width={180}
                height={48}
                className="h-12 w-auto"
              />
              <span className="text-3xl font-bold text-white">Cardora</span>
            </div>

            {/* Board Title */}
            <h1
              className="text-white font-bold mb-12"
              style={{
                fontFamily: board?.title_font || 'Inter',
                fontSize: '56px',
                lineHeight: '1.2'
              }}
            >
              {board?.title || 'Your Board'}
            </h1>

            {/* Open Button */}
            <button
              onClick={() => setShowIntro(false)}
              className="bg-white text-[#0B1F2A] px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transform transition-all shadow-lg"
            >
              Open Your Cardora
            </button>
          </div>
        </div>
      )}

      <div
        className={`min-h-screen relative ${!showIntro ? 'transition-opacity duration-2000 ease-in' : ''}`}
        style={{
          opacity: backgroundOpacity,
          ...(background?.type === 'SOLID' && background.color
            ? { backgroundColor: background.color }
            : background?.type === 'PATTERN' && background.pattern?.file_path
            ? {
                backgroundImage: `url(${background.pattern.file_path})`,
                backgroundSize: 'clamp(300px, 40vmin, 1200px) clamp(300px, 40vmin, 1200px)',
                backgroundPosition: 'center',
                backgroundRepeat: 'repeat'
              }
            : { backgroundColor: '#F7FAFC' })
        }}
      >
        {/* Effect Overlay - Plays on top of everything (but below intro) */}
        {!showIntro && board.effect_data && <EffectOverlay effect={board.effect_data} />}

        {/* Lottie Background Animation - Only show if ANIMATION type or no background selected */}
      {(background?.type === 'ANIMATION' && selectedLottieAnimation) || (!background && lottieAnimation) ? (
        <div
          className={`fixed inset-0 z-0 pointer-events-none ${!showIntro ? 'transition-opacity duration-2000 ease-in' : ''} ${showIntro ? 'blur-lg' : ''}`}
          style={{ opacity: backgroundOpacity }}
        >
          <Lottie
            animationData={background?.type === 'ANIMATION' ? selectedLottieAnimation : lottieAnimation}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : null}

      {/* Content wrapper with higher z-index */}
      <div
        className={`relative z-10 transition-opacity duration-2000 ease-in ${showIntro ? 'blur-lg' : ''}`}
        style={{ opacity: contentOpacity }}
      >
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

      {/* Header */}
      <header
        className="bg-white border-b border-[#E5EAF0] sticky top-0 z-50 transition-all duration-2000 ease-out"
        style={{
          opacity: showHeader ? 1 : 0,
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/cardoraLogo.png"
              alt="Cardora"
              width={180}
              height={48}
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold text-[#2CB1A6]">Cardora</span>
          </Link>

          {/* Center - For Recipients */}
          {recipients.length > 0 && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <span className="text-xl font-bold text-[#2CB1A6]">
                For: {recipients.map(r => r.name).join(', ')}
              </span>
            </div>
          )}

          {/* Right side - Use Template / Print Button and Status Badge */}
          <div className="flex items-center gap-3">
            {board?.is_template ? (
              <button
                onClick={handleUseTemplate}
                disabled={usingTemplate}
                className="no-print px-6 py-2 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {usingTemplate ? 'Creating...' : 'Use This Template'}
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                className="no-print px-4 py-2 bg-white hover:bg-[#E8F5F4] text-[#2CB1A6] border-2 border-[#2CB1A6] rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print / Save PDF
              </button>
            )}

            {board && isDelivered && (
              <div className="no-print px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Delivered
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Board Header with Background */}
      <div
        className="py-12 relative transition-all duration-2000 ease-out"
        style={{
          backgroundColor: board.header_color && board.header_color_code ? board.header_color_code : 'transparent',
          opacity: showHeader ? 1 : 0,
          transform: showHeader ? 'translateY(0)' : 'translateY(-50px)'
        }}
      >
        {/* Gradient shadow overlay when header color is disabled */}
        {!board.header_color && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3) 50%, transparent)'
            }}
          />
        )}

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1
            className="font-bold"
            style={{
              fontFamily: board.title_font || 'Inter',
              fontSize: `${board.title_font_size || 48}px`,
              color: board.title_font_color || '#0B1F2A'
            }}
          >
            {board.title}
          </h1>
        </div>
      </div>

      {/* Messages Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="bg-white/40 backdrop-blur-md rounded-2xl p-12 border border-white/40 text-center max-w-2xl mx-auto shadow-xl">
            <div className="w-24 h-24 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">No Messages Yet</h3>
            <p className="text-[#0B1F2A]">
              This {formatName} doesn't have any messages yet. Check back soon!
            </p>
          </div>
        ) : (
          /* Messages Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-xl border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-lg transition-all overflow-hidden duration-750 ease-in"
                style={{
                  opacity: visibleMessages.has(message.id) ? 1 : 0,
                  transform: visibleMessages.has(message.id) ? 'scale(1)' : 'scale(0.95)'
                }}
              >
                {/* Media */}
                {message.media && message.media.length > 0 && (
                  <div className="relative w-full bg-gray-100">
                    {message.media[0].file_type === 'video' ? (
                      <video
                        src={message.media[0].file_url}
                        controls
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    ) : message.media[0].file_type === 'audio' ? (
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-[#2CB1A6] flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#0B1F2A]">Audio Message</p>
                            <p className="text-xs text-[#5B6B75]">Click play to listen</p>
                          </div>
                        </div>
                        <audio
                          src={message.media[0].file_url}
                          controls
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <img
                        src={message.media[0].file_url}
                        alt="Message media"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    )}
                  </div>
                )}

                {/* Message Content */}
                <div className="p-6">
                  <div
                    className="text-[#0B1F2A] mb-4 leading-relaxed prose prose-sm max-w-none"
                    style={{ fontFamily: board.body_font }}
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />

                  {/* Author & Date */}
                  <div className="flex items-center justify-between text-sm text-[#5B6B75] pt-4 border-t border-[#E5EAF0]">
                    <span className="font-semibold">
                      — {message.contributor?.is_anonymous ? 'Anonymous' : message.contributor?.name}
                    </span>
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      </div>
      </div>
    </>
  );
}
