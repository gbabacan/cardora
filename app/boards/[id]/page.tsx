"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LottieAnimation from "@/components/LottieAnimation";
import { getBoardByShortId } from "@/lib/boards";
import { getCurrentUser } from "@/lib/auth";
import { getBoardMessages } from "@/lib/messages";
import type { Board, Recipient } from "@/lib/boards";
import type { Message } from "@/lib/messages";
import type { Background } from "@/lib/backgrounds";
import Toast from "@/components/Toast";
import AddMessageModal from "@/components/AddMessageModal";
import InviteModal from "@/components/InviteModal";
import { loadLottieAnimationData } from "@/lib/lotties";
import { extractDominantColor } from "@/lib/colorExtractor";
import { headerTitleColor } from "@/lib/boardTitle";
import { useEqualSides } from "@/lib/useEqualSides";

export default function BoardViewPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params promise
  const { id: boardShortId } = use(params);

  const router = useRouter();
  const [board, setBoard] = useState<Board | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMessageModal, setShowAddMessageModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const headerObserverRef = useRef<ResizeObserver | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const { leftRef: headerLeftRef, rightRef: headerRightRef, sideWidth: headerSideWidth } = useEqualSides();

  // Track the header's height so the background starts below it rather than
  // being covered. A callback ref, since the header only mounts after loading.
  const headerRef = useCallback((header: HTMLElement | null) => {
    headerObserverRef.current?.disconnect();
    headerObserverRef.current = null;
    if (!header) return;
    const update = () => setHeaderHeight(header.offsetHeight);
    update();
    headerObserverRef.current = new ResizeObserver(update);
    headerObserverRef.current.observe(header);
  }, []);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [lottieAnimation, setLottieAnimation] = useState<any>(null);
  const [selectedLottieAnimation, setSelectedLottieAnimation] = useState<any>(null);
  const [background, setBackground] = useState<Background | null>(null);
  const [imageBgColor, setImageBgColor] = useState<string>('#F7FAFC');

  // Edit/delete state
  const [ownedTokens, setOwnedTokens] = useState<Record<string, string>>({}); // { messageId: editToken }
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string; media?: { file_url: string; file_type: string } | null } | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [messagesHidden, setMessagesHidden] = useState(false);
  // Owners can add a personal message to email invites; contributors can't
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(({ user }) => setCurrentUserId(user?.id ?? null));
  }, []);

  useEffect(() => {
    loadBoardData();
    loadLottieAnimation();
    // Load owned message tokens from localStorage
    try {
      const stored = localStorage.getItem(`cardora_tokens_${boardShortId}`);
      if (stored) setOwnedTokens(JSON.parse(stored));
    } catch {}
  }, [boardShortId]);

  const saveToken = (messageId: string, token: string) => {
    const updated = { ...ownedTokens, [messageId]: token };
    setOwnedTokens(updated);
    try {
      localStorage.setItem(`cardora_tokens_${boardShortId}`, JSON.stringify(updated));
    } catch {}
  };

  const handleEditSuccess = () => {
    setToast({ message: 'Message updated! 🎉', type: 'success' });
    setEditingMessage(null);
    loadBoardData();
  };

  const handleDeleteMessage = async (messageId: string) => {
    const token = ownedTokens[messageId];
    if (!token) return;
    setDeletingMessageId(messageId);
    try {
      const res = await fetch('/api/messages/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, edit_token: token }),
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        const updated = { ...ownedTokens };
        delete updated[messageId];
        setOwnedTokens(updated);
        try { localStorage.setItem(`cardora_tokens_${boardShortId}`, JSON.stringify(updated)); } catch {}
        setToast({ message: 'Message deleted', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete message', type: 'error' });
      }
    } catch {
      setToast({ message: 'Failed to delete message', type: 'error' });
    } finally {
      setDeletingMessageId(null);
      setConfirmDeleteId(null);
    }
  };

  // Load remote Lottie animation
  const loadLottieAnimation = async () => {
    try {
      // Remote Lottie URL from LottieFiles CDN
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

  const handleMessageAdded = (messageId?: string, editToken?: string) => {
    setToast({ message: 'Message posted successfully! 🎉', type: 'success' });
    setShowAddMessageModal(false);
    // Save edit token to localStorage so user can edit/delete later
    if (messageId && editToken) saveToken(messageId, editToken);
    loadBoardData();
  };

  const handleMessageError = (errorMessage: string) => {
    setToast({ message: errorMessage, type: 'error' });
  };

  const handleInviteSuccess = (successMessage: string) => {
    setToast({ message: successMessage, type: 'success' });
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
            <button className="px-6 py-3 bg-[#1A7F77] hover:bg-[#156C65] text-white font-semibold rounded-lg transition-colors">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formatName = board.format_type === 'board' ? 'board' : 'card';
  const isDelivered = board.status === 'DELIVERED';
  const isCard = board.format_type === 'card';
  const boardTitle = (
    <h1
      className="font-bold text-lg md:text-2xl lg:text-3xl leading-tight line-clamp-2 break-words"
      style={{ fontFamily: board.title_font || 'Inter', color: headerTitleColor(board.title_font_color) }}
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

  return (
    <div
      className="min-h-screen relative"
      style={{
        ...(background?.type === 'SOLID' && background.color
          ? { backgroundColor: background.color }
          : background?.type === 'PATTERN' && background.pattern?.file_path
          ? {
              backgroundImage: `url(${background.pattern.file_path})`,
              backgroundSize: '200px 200px',
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat'
            }
          : background?.type === 'IMAGE'
          ? { backgroundColor: imageBgColor }
          : { backgroundColor: '#F7FAFC' })
      }}
    >
      {/* Lottie Background Animation */}
      {(background?.type === 'ANIMATION' && selectedLottieAnimation) || (!background && lottieAnimation) ? (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ top: headerHeight }}>
          <LottieAnimation
            animationData={background?.type === 'ANIMATION' ? selectedLottieAnimation : lottieAnimation}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : null}
      {/* Image Background */}
      {background?.type === 'IMAGE' && background.image?.file_path && (
        <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center" style={{ top: headerHeight }}>
          <img
            src={background.image.file_path}
            alt="Board background"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Content wrapper with higher z-index */}
      <div className="relative z-10">
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

      {/* Header */}
      <header ref={headerRef} className="bg-white border-b border-[#E5EAF0] sticky top-0 z-50">
        <div
          className="max-w-screen-2xl mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-2 lg:gap-6"
          style={{ '--header-side': `${headerSideWidth}px` } as React.CSSProperties}
        >
          {/* Equal-width sides keep the title centred on the page */}
          <div className="flex-shrink-0 lg:flex-1 lg:basis-0 lg:min-w-[var(--header-side)]">
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

          {/* Center - board title with recipients underneath (large screens; the
              action buttons leave too little room on tablets) */}
          <div className="hidden lg:block min-w-0 text-center">
            {boardTitle}
            {recipientLine}
          </div>

          {/* Right side - Action Buttons */}
          {board && (
            <div className="flex justify-end flex-shrink-0 lg:flex-1 lg:basis-0 lg:min-w-[var(--header-side)]">
              <div ref={headerRightRef} className="flex items-center gap-2 flex-shrink-0">
                {isCard ? (
                  <div className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-xs md:text-sm flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Single Card (View Only)</span>
                  </div>
                ) : !isDelivered ? (
                  <>
                    {/* View as Recipient — compact so the centred title has room; icon only below xl */}
                    <Link href={`/boards/${boardShortId}/view`} target="_blank">
                      <button className="w-9 h-9 xl:w-auto xl:px-3 bg-white border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] font-semibold text-sm rounded-full transition-colors flex items-center justify-center gap-1.5" title="View as Recipient">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="hidden xl:inline">Preview</span>
                      </button>
                    </Link>

                    {/* Invite People — compact so the centred title has room; icon only below xl */}
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="w-9 h-9 xl:w-auto xl:px-3 bg-white border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] font-semibold text-sm rounded-full transition-colors flex items-center justify-center gap-1.5"
                      title="Invite People"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="hidden xl:inline">Invite</span>
                    </button>

                    {/* Add Your Message — always shows text */}
                    <button
                      onClick={() => setShowAddMessageModal(true)}
                      className="px-3 py-2 md:px-5 md:py-2.5 bg-[#1A7F77] hover:bg-[#156C65] text-white font-semibold rounded-full transition-colors shadow-lg flex items-center gap-1.5 text-sm md:text-base whitespace-nowrap"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="hidden sm:inline">Add Your Message</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </>
                ) : (
                  <div className="px-3 py-1.5 md:px-4 md:py-2 bg-green-100 text-green-800 rounded-full font-semibold text-xs md:text-sm flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Delivered
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Title row for phones and tablets - too narrow to share the bar with the logo and buttons */}
        <div className="lg:hidden border-t border-[#E5EAF0] px-4 py-2 text-center">
          {boardTitle}
          {recipientLine}
        </div>
      </header>

      {/* Card Type Notice Banner */}
      {isCard && (
        <div className="bg-blue-50 border-b-2 border-blue-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">This is a Single Card</h3>
                <p className="text-sm text-blue-800">
                  Cards are created by a single person and don't accept contributions from others.
                  Only collaborative boards allow multiple people to add messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Grid */}
      <main
        className={`max-w-7xl mx-auto px-6 pt-12 pb-28 transition-opacity duration-500 ${messagesHidden ? 'pointer-events-none' : ''}`}
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
            <h3 className="text-xl font-bold text-[#0B1F2A] mb-3">Start the Celebration!</h3>
            <p className="text-[#0B1F2A] mb-6">
              This {formatName} is waiting for your heartfelt message. Be the first to share your thoughts!
            </p>
            {!isDelivered && (
              <button
                onClick={() => setShowAddMessageModal(true)}
                className="px-8 py-3 bg-[#1A7F77] hover:bg-[#156C65] text-white font-semibold rounded-full transition-colors shadow-lg"
              >
                Add the First Message
              </button>
            )}
          </div>
        ) : (
          /* Messages Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-xl border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-lg transition-all overflow-hidden"
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
                    <div className="flex items-center gap-2">
                      <span>{formatDate(message.created_at)}</span>
                      {/* Edit/Delete — only for messages the user owns */}
                      {ownedTokens[message.id] && !isDelivered && (
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => setEditingMessage({ id: message.id, content: message.content, media: message.media?.[0] || null })}
                            className="p-1 text-[#5B6B75] hover:text-[#2CB1A6] transition-colors"
                            title="Edit message"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(message.id)}
                            className="p-1 text-[#5B6B75] hover:text-red-500 transition-colors"
                            title="Delete message"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Hide/Show Messages - floating so the header stays uncluttered */}
      {messages.length > 0 && (
        <button
          onClick={() => setMessagesHidden(h => !h)}
          className={`fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 h-12 bg-white border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] font-semibold rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${messagesHidden ? 'px-5' : 'w-12'}`}
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

      {/* Add Message Modal - Only for boards, not cards */}
      {!isDelivered && !isCard && (
        <AddMessageModal
          boardId={board.id}
          boardShortId={boardShortId}
          isOpen={showAddMessageModal}
          onClose={() => setShowAddMessageModal(false)}
          onSuccess={handleMessageAdded}
          onError={handleMessageError}
        />
      )}

      {/* Invite Modal - Only for boards, not cards */}
      {!isDelivered && !isCard && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          boardLink={`${process.env.NEXT_PUBLIC_APP_URL || 'https://cardora.cards'}/boards/${boardShortId}`}
          boardTitle={board.title}
          boardId={board.id}
          isOwner={!!currentUserId && currentUserId === board.user_id}
          onError={handleMessageError}
          onSuccess={handleInviteSuccess}
        />
      )}

      {/* Edit Message Modal — reuses AddMessageModal in edit mode */}
      {editingMessage && (
        <AddMessageModal
          boardId={board.id}
          boardShortId={boardShortId}
          isOpen={!!editingMessage}
          onClose={() => setEditingMessage(null)}
          onSuccess={handleEditSuccess}
          onError={(err) => setToast({ message: err, type: 'error' })}
          editMode={true}
          editMessageId={editingMessage.id}
          editToken={ownedTokens[editingMessage.id]}
          initialContent={editingMessage.content}
          initialMedia={editingMessage.media}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#0B1F2A] mb-2">Delete Message?</h3>
            <p className="text-[#5B6B75] text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border-2 border-[#E5EAF0] text-[#5B6B75] rounded-lg font-medium hover:bg-[#F7FAFC] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(confirmDeleteId)}
                disabled={deletingMessageId === confirmDeleteId}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {deletingMessageId === confirmDeleteId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}