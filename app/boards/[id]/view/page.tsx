"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
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
import { extractDominantColor } from "@/lib/colorExtractor";
import { supabase } from "@/lib/supabase";
import { headerTitleColor } from "@/lib/boardTitle";
import { useEqualSides } from "@/lib/useEqualSides";

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
  const [imageBgColor, setImageBgColor] = useState<string>('#F7FAFC');
  const [showIntro, setShowIntro] = useState(true);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.4);
  const [showHeader, setShowHeader] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(new Set());
  const [messagesHidden, setMessagesHidden] = useState(false);
  const headerObserverRef = useRef<ResizeObserver | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const { leftRef: headerLeftRef, rightRef: headerRightRef, sideWidth: headerSideWidth } = useEqualSides();

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

  useEffect(() => {
    if (background?.type === 'IMAGE' && background.image?.file_path) {
      extractDominantColor(background.image.file_path).then(setImageBgColor);
    } else {
      setImageBgColor('#F7FAFC');
    }
  }, [background]);

  // Track the header's height so the background can make room for it. A
  // callback ref, since the header only mounts once loading has finished.
  const headerRef = useCallback((header: HTMLElement | null) => {
    headerObserverRef.current?.disconnect();
    headerObserverRef.current = null;
    if (!header) return;
    const update = () => setHeaderHeight(header.offsetHeight);
    update();
    headerObserverRef.current = new ResizeObserver(update);
    headerObserverRef.current.observe(header);
  }, []);

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
          source_template_id: board.id,
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

  const titleColor = headerTitleColor(board.title_font_color);
  const boardTitle = (
    <h1
      className="font-bold text-lg md:text-2xl lg:text-3xl leading-tight line-clamp-2 break-words"
      style={{ fontFamily: board.title_font || 'Inter', color: titleColor }}
      title={board.title}
    >
      {board.title}
    </h1>
  );
  const recipientLine = recipients.length > 0 && (
    <p className="mt-0.5 text-sm md:text-base font-semibold text-[#2CB1A6] truncate">
      For: {recipients.map(r => r.name).join(', ')}
    </p>
  );

  // As the header slides down, lower the background's top edge in step with
  // it so the image/animation shrinks to fit instead of being covered
  const backgroundLayerStyle: React.CSSProperties = {
    opacity: backgroundOpacity,
    top: showHeader ? headerHeight : 0,
    transition: showIntro ? undefined : 'opacity 2000ms ease-in, top 2000ms ease-out'
  };
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
          <div className="bg-[#2CB1A6] rounded-3xl shadow-2xl px-6 py-8 md:px-20 md:py-16 max-w-4xl w-full mx-4 text-center float-animation" style={{ opacity: 1 }}>
            {/* Cardora Logo/Name */}
            <div className="mb-4 md:mb-8 flex items-center justify-center gap-2 md:gap-4">
              <Image
                src="/cardoraLogo.png"
                alt="Cardora"
                width={180}
                height={48}
                className="h-7 md:h-12 w-auto"
              />
              <span className="text-xl md:text-3xl font-bold text-white">Cardora</span>
            </div>

            {/* Board Title */}
            <h1
              className="text-white font-bold mb-6 md:mb-12 text-3xl md:text-5xl lg:text-[56px]"
              style={{
                fontFamily: board?.title_font || 'Inter',
                lineHeight: '1.2'
              }}
            >
              {board?.title || 'Your Board'}
            </h1>

            {/* Open Button */}
            <button
              onClick={() => setShowIntro(false)}
              className="bg-white text-[#0B1F2A] px-6 py-3 md:px-12 md:py-5 rounded-full font-bold text-base md:text-xl hover:scale-105 transform transition-all shadow-lg"
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
            : background?.type === 'IMAGE'
            ? { backgroundColor: imageBgColor }
            : { backgroundColor: '#F7FAFC' })
        }}
      >
        {/* Effect Overlay - Plays on top of everything (but below intro) */}
        {!showIntro && board.effect_data && <EffectOverlay effect={board.effect_data} />}

        {/* Lottie Background Animation */}
      {(background?.type === 'ANIMATION' && selectedLottieAnimation) || (!background && lottieAnimation) ? (
        <div
          className={`fixed inset-0 z-0 pointer-events-none ${showIntro ? 'blur-lg' : ''}`}
          style={backgroundLayerStyle}
        >
          <LottieAnimation
            animationData={background?.type === 'ANIMATION' ? selectedLottieAnimation : lottieAnimation}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : null}
      {/* Image Background */}
      {background?.type === 'IMAGE' && background.image?.file_path && (
        <div
          className={`fixed inset-0 z-0 pointer-events-none flex items-center justify-center ${showIntro ? 'blur-lg' : ''}`}
          style={backgroundLayerStyle}
        >
          <img
            src={background.image.file_path}
            alt="Board background"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

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
        ref={headerRef}
        className="bg-white border-b border-[#E5EAF0] sticky top-0 z-50 transition-all duration-2000 ease-out"
        style={{
          opacity: showHeader ? 1 : 0,
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <div
          className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-6"
          style={{ '--header-side': `${headerSideWidth}px` } as React.CSSProperties}
        >
          {/* Equal-width sides keep the title centred on the page */}
          <div className="flex-shrink-0 md:flex-1 md:basis-0 md:min-w-[var(--header-side)]">
            <Link ref={headerLeftRef} href="/" className="flex items-center gap-2 md:gap-3 w-fit">
              <Image
                src="/cardoraLogo.png"
                alt="Cardora"
                width={180}
                height={48}
                className="h-9 md:h-12 w-auto"
              />
              <span className="text-xl md:text-2xl font-bold text-[#2CB1A6]">Cardora</span>
            </Link>
          </div>

          {/* Center - board title with recipients underneath (desktop) */}
          <div className="hidden md:block min-w-0 text-center">
            {boardTitle}
            {recipientLine}
          </div>

          {/* Right side - Buttons */}
          <div className="flex justify-end md:flex-1 md:basis-0 md:min-w-[var(--header-side)]">
            <div ref={headerRightRef} className="flex items-center gap-2 flex-shrink-0">
              {board?.is_template ? (
                <button
                  onClick={handleUseTemplate}
                  disabled={usingTemplate}
                  className="no-print px-3 md:px-6 py-2 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {usingTemplate ? 'Creating...' : 'Use This Template'}
                </button>
              ) : (
                <button
                  onClick={() => window.print()}
                  className="no-print w-9 h-9 md:w-auto md:h-auto md:px-4 md:py-2 bg-white hover:bg-[#E8F5F4] text-[#2CB1A6] border-2 border-[#2CB1A6] rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  title="Print / Save PDF"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span className="hidden md:inline">Print / Save PDF</span>
                </button>
              )}

              {board && isDelivered && (
                <div className="no-print px-2 py-1.5 md:px-4 md:py-2 bg-green-100 text-green-800 rounded-full font-semibold text-xs md:text-sm flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Delivered
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile title row - too narrow to share the bar with the logo and buttons */}
        <div className="md:hidden border-t border-[#E5EAF0] px-4 py-2 text-center">
          {boardTitle}
          {recipientLine}
        </div>
      </header>

      {/* Messages Grid */}
      <main
        className={`max-w-7xl mx-auto px-6 pt-12 pb-40 transition-opacity duration-500 ${messagesHidden ? 'pointer-events-none' : ''}`}
        style={{ opacity: messagesHidden ? 0 : 1 }}
        aria-hidden={messagesHidden}
      >
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

      {/* Floating controls - floating so the header stays uncluttered */}
      {showHeader && (board.format_type === 'board' || messages.length > 0) && (
        <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3">
          {/* Replay - reload the page to watch the opening animation again */}
          {board.format_type === 'board' && (
            <button
              onClick={() => window.location.reload()}
              className="w-12 h-12 bg-white border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] rounded-full shadow-lg transition-all flex items-center justify-center"
              title="Replay"
              aria-label="Replay"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}

          {/* Hide/Show Messages */}
          {messages.length > 0 && (
            <button
              onClick={() => setMessagesHidden(h => !h)}
              className={`h-12 bg-white border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] font-semibold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${messagesHidden ? 'px-5' : 'w-12'}`}
              title={messagesHidden ? 'Show messages' : 'Hide messages to see the background'}
              aria-label={messagesHidden ? 'Show messages' : 'Hide messages'}
              aria-pressed={messagesHidden}
            >
              {messagesHidden ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
              {messagesHidden && <span className="whitespace-nowrap">Show messages</span>}
            </button>
          )}
        </div>
      )}
      </div>
      </div>
    </>
  );
}
