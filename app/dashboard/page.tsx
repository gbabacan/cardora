"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Lottie from "lottie-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { getUserBoards, deleteBoard, getBoardMessageCount } from "@/lib/boards";
import type { Board, Recipient } from "@/lib/boards";
import { getOccasions } from "@/lib/occasions";
import type { Occasion } from "@/lib/occasions";
import Toast from "@/components/Toast";
import { supabase } from "@/lib/supabase";

interface BoardWithRecipients extends Board {
  recipients: Recipient[];
  messageCount?: number;
}

interface TemplateWithLottie extends Board {
  lottieData?: any;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const templatesRef = useRef<HTMLDivElement>(null);
  const [boards, setBoards] = useState<BoardWithRecipients[]>([]);
  const [displayedBoards, setDisplayedBoards] = useState<BoardWithRecipients[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);
  const [templates, setTemplates] = useState<TemplateWithLottie[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [visibleOccasionCount, setVisibleOccasionCount] = useState(3);
  const [templateFilterFormat, setTemplateFilterFormat] = useState<'all' | 'board' | 'card'>('all');
  const [templateFilterOccasion, setTemplateFilterOccasion] = useState<string>('all');
  const [loadingMore, setLoadingMore] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [deletingBoardId, setDeletingBoardId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [itemsToShow, setItemsToShow] = useState(8);

  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'card' | 'board'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'CREATED' | 'PUBLISHED' | 'DELIVERED'>('all');
  const [filterOccasion, setFilterOccasion] = useState<string>('all');
  const [filterRecipient, setFilterRecipient] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const loadBoards = async () => {
      if (!user) return;

      setLoadingBoards(true);
      const { boards: userBoards, error } = await getUserBoards();

      if (error) {
        setToast({ message: 'Error loading boards: ' + error, type: 'error' });
      } else {
        // Fetch message counts for each board
        const boardsWithCounts = await Promise.all(
          userBoards.map(async (board) => {
            const { count } = await getBoardMessageCount(board.id);
            return { ...board, messageCount: count || 0 };
          })
        );
        setBoards(boardsWithCounts as BoardWithRecipients[]);
      }

      setLoadingBoards(false);
    };

    if (user) {
      loadBoards();
    }
  }, [user]);

  useEffect(() => {
    const loadOccasions = async () => {
      setLoadingOccasions(true);
      const { occasions: fetchedOccasions, error } = await getOccasions();

      if (error) {
        setToast({ message: 'Error loading occasions: ' + error, type: 'error' });
      } else {
        setOccasions(fetchedOccasions);
      }

      setLoadingOccasions(false);
    };

    loadOccasions();
  }, []);

  useEffect(() => {
    const loadTemplates = async () => {
      setLoadingTemplates(true);

      const { data, error } = await supabase
        .from('boards')
        .select(`
          *,
          background_data:background_id(
            id, type,
            lottie_animation:lottie_animation_id(id, name, file_path)
          ),
          card_background_data:card_background_id(
            id, type,
            lottie_animation:lottie_animation_id(id, name, file_path)
          )
        `)
        .eq('is_template', true)
        .order('occasion_type');

      if (error) {
        console.error('Error loading templates:', error);
        setLoadingTemplates(false);
        return;
      }

      if (!data || data.length === 0) {
        setLoadingTemplates(false);
        return;
      }

      // Load lottie data for each template based on format_type
      const lottieCache: Record<string, any> = {};
      const templatesWithLottie = await Promise.all(
        data.map(async (template) => {
          // Both boards and cards store their lottie in card_background_id
          const lottieAnim = template.card_background_data?.lottie_animation;

          if (!lottieAnim?.file_path) return { ...template, lottieData: null };

          const cacheKey = lottieAnim.id;
          if (!lottieCache[cacheKey]) {
            try {
              const res = await fetch(lottieAnim.file_path);
              if (res.ok) {
                lottieCache[cacheKey] = await res.json();
              }
            } catch (err) {
              console.error('Error loading lottie:', lottieAnim.file_path, err);
            }
          }

          return { ...template, lottieData: lottieCache[cacheKey] || null };
        })
      );

      setTemplates(templatesWithLottie as TemplateWithLottie[]);
      setLoadingTemplates(false);
    };

    loadTemplates();
  }, []);

  // Update displayed boards when boards, itemsToShow, or filters change
  useEffect(() => {
    let filtered = boards;

    // Apply filters
    if (filterType !== 'all') {
      filtered = filtered.filter(board => board.format_type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(board => board.status === filterStatus);
    }

    if (filterOccasion !== 'all') {
      filtered = filtered.filter(board => board.occasion_type === filterOccasion);
    }

    if (filterRecipient.trim() !== '') {
      filtered = filtered.filter(board =>
        board.recipients.some(r =>
          r.name.toLowerCase().includes(filterRecipient.toLowerCase())
        )
      );
    }

    setDisplayedBoards(filtered.slice(0, itemsToShow));
  }, [boards, itemsToShow, filterType, filterStatus, filterOccasion, filterRecipient]);

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setItemsToShow(prev => prev + 8);
      setLoadingMore(false);
    }, 300);
  };

  // Get unique values for filters
  const uniqueOccasions = Array.from(new Set(boards.map(b => b.occasion_type)));

  // Get filtered boards count (before pagination)
  const getFilteredBoardsCount = () => {
    let filtered = boards;
    if (filterType !== 'all') filtered = filtered.filter(b => b.format_type === filterType);
    if (filterStatus !== 'all') filtered = filtered.filter(b => b.status === filterStatus);
    if (filterOccasion !== 'all') filtered = filtered.filter(b => b.occasion_type === filterOccasion);
    if (filterRecipient.trim() !== '') filtered = filtered.filter(b => b.recipients.some(r => r.name.toLowerCase().includes(filterRecipient.toLowerCase())));
    return filtered.length;
  };

  const scrollToTemplates = () => {
    templatesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleDeleteBoard = async (boardId: string) => {
    setDeletingBoardId(boardId);

    const { error } = await deleteBoard(boardId);

    if (error) {
      setToast({ message: 'Error deleting board: ' + error, type: 'error' });
    } else {
      setBoards(boards.filter(b => b.id !== boardId));
      setToast({ message: 'Board deleted successfully', type: 'success' });
    }

    setDeletingBoardId(null);
    setShowDeleteConfirm(null);
  };

  const getStatusBadge = (status: string) => {
    const badges: {[key: string]: { bg: string; text: string; label: string }} = {
      'CREATED': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
      'PUBLISHED': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Active' },
      'DELIVERED': { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
    };

    const badge = badges[status] || badges['CREATED'];

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 0) return 'Overdue';
    if (diffMinutes < 60) return `In ${diffMinutes} min`;
    if (diffHours < 24) return `In ${diffHours}h`;

    // Compare calendar days in local time
    const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((dateDay.getTime() - todayDay.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return formatDate(dateString);
  };

  // Get upcoming scheduled deliveries
  const upcomingDeliveries = boards
    .filter(board =>
      board.delivery_type === 'SCHEDULED' &&
      board.scheduled_delivery &&
      board.status !== 'DELIVERED' &&
      new Date(board.scheduled_delivery) > new Date()
    )
    .sort((a, b) =>
      new Date(a.scheduled_delivery!).getTime() - new Date(b.scheduled_delivery!).getTime()
    )
    .slice(0, 4); // Show max 4 upcoming

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-[#2CB1A6] text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-[#E5EAF0]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image
              src="/cardoraLogo.png"
              alt="Cardora"
              width={180}
              height={48}
              className="h-9 md:h-12 w-auto"
            />
            <span className="text-xl md:text-2xl font-bold text-[#2CB1A6]">Cardora</span>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full bg-[#2CB1A6] text-white flex items-center justify-center font-bold text-sm">
                {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:block text-[#0B1F2A] font-medium">
                {user.user_metadata?.name || user.email}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#E5EAF0] py-2 z-10">
                <Link href="/account">
                  <button className="w-full text-left px-4 py-2 text-[#5B6B75] hover:bg-[#F7FAFC] hover:text-[#2CB1A6] transition-colors">
                    Account Settings
                  </button>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-[#5B6B75] hover:bg-[#F7FAFC] hover:text-[#2CB1A6] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0B1F2A] mb-2">
            Welcome back, {user.user_metadata?.name || 'there'}! 👋
          </h1>
          <p className="text-[#5B6B75] text-lg">
            Create and manage your cards
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/boards/create" className="bg-white rounded-2xl p-8 border-2 border-[#2CB1A6] hover:shadow-xl transition-all text-left group">
            <div className="w-16 h-16 rounded-full bg-[#A7E8E2] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0B1F2A] mb-2">Create New Cardora</h3>
            <p className="text-[#5B6B75]">Start a new group board or individual card</p>
          </Link>

          <button onClick={scrollToTemplates} className="bg-white rounded-2xl p-8 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-xl transition-all text-left group">
            <div className="w-16 h-16 rounded-full bg-[#F7FAFC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-[#5B6B75] group-hover:text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0B1F2A] mb-2">Browse Templates</h3>
            <p className="text-[#5B6B75]">Choose from pre-designed templates</p>
          </button>
        </div>

      </div>

      {/* My Boards Section - Full Width */}
      <div className="bg-[#E8F5F4]/60 border-y border-[#A7E8E2]/50 py-10">
        <div className="max-w-7xl mx-auto px-6">
        <div className="mb-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0B1F2A]">My Boards & Cards</h2>
            {boards.length > 0 && (
              <span className="text-[#5B6B75]">
                {getFilteredBoardsCount()} {getFilteredBoardsCount() === 1 ? 'item' : 'items'}
                {getFilteredBoardsCount() !== boards.length && ` (${boards.length} total)`}
              </span>
            )}
          </div>

          {/* Filters */}
          {boards.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E5EAF0] p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#5B6B75] mb-2">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value as any);
                      setItemsToShow(8);
                    }}
                    className="w-full px-4 py-2 border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  >
                    <option value="all">All Types</option>
                    <option value="card">Cards</option>
                    <option value="board">Boards</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#5B6B75] mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value as any);
                      setItemsToShow(8);
                    }}
                    className="w-full px-4 py-2 border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  >
                    <option value="all">All Statuses</option>
                    <option value="CREATED">Draft</option>
                    <option value="PUBLISHED">Active</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>

                {/* Occasion Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#5B6B75] mb-2">Occasion</label>
                  <select
                    value={filterOccasion}
                    onChange={(e) => {
                      setFilterOccasion(e.target.value);
                      setItemsToShow(8);
                    }}
                    className="w-full px-4 py-2 border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  >
                    <option value="all">All Occasions</option>
                    {uniqueOccasions.map(occasion => (
                      <option key={occasion} value={occasion}>
                        {occasion.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#5B6B75] mb-2">Recipient</label>
                  <input
                    type="text"
                    placeholder="Search by recipient..."
                    value={filterRecipient}
                    onChange={(e) => {
                      setFilterRecipient(e.target.value);
                      setItemsToShow(8);
                    }}
                    className="w-full px-4 py-2 border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] placeholder-[#5B6B75]/50 focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {(filterType !== 'all' || filterStatus !== 'all' || filterOccasion !== 'all' || filterRecipient.trim() !== '') && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setFilterType('all');
                      setFilterStatus('all');
                      setFilterOccasion('all');
                      setFilterRecipient('');
                      setItemsToShow(8);
                    }}
                    className="text-[#2CB1A6] hover:text-[#1F8F86] font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Scheduled Deliveries */}
          {!loadingBoards && boards.length > 0 && (
            <div className="bg-gradient-to-br from-[#E8F5F4] to-[#D1EDE9] rounded-xl p-6 mb-6 border border-[#2CB1A6]/20">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-[#0B1F2A]">Upcoming Scheduled Deliveries</h3>
              </div>

              {upcomingDeliveries.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 text-center">
                  <p className="text-[#5B6B75] text-sm">No upcoming scheduled deliveries</p>
                </div>
              ) : (
                <div className="space-y-3">
                {upcomingDeliveries.map((board) => (
                  <div
                    key={board.id}
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between hover:bg-white transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-[#0B1F2A]">{board.title}</h4>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#2CB1A6]/10 text-[#2CB1A6] capitalize">
                          {board.format_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#5B6B75]">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{board.recipients.map(r => r.name).join(', ')}</span>
                        </div>
                        {board.messageCount !== undefined && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span>
                              {board.format_type === 'board'
                                ? `${board.messageCount || 0} ${board.messageCount === 1 ? 'message' : 'messages'}`
                                : board.messageCount && board.messageCount > 0 ? 'Message added' : 'No message yet'
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#2CB1A6]">
                          {formatRelativeDate(board.scheduled_delivery!)}
                        </div>
                        <div className="text-xs text-[#5B6B75]">
                          {formatDate(board.scheduled_delivery!)}
                        </div>
                      </div>

                      <Link href={`/${board.format_type === 'card' ? 'cards' : 'boards'}/editor?id=${board.id}`}>
                        <button className="px-4 py-2 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          )}

          {loadingBoards ? (
            <div className="bg-white rounded-2xl p-12 border border-[#E5EAF0] text-center">
              <div className="text-[#2CB1A6] text-lg">Loading your boards...</div>
            </div>
          ) : boards.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl p-12 border border-[#E5EAF0] text-center">
              <div className="w-24 h-24 rounded-full bg-[#F7FAFC] flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">No boards yet</h3>
              <p className="text-[#5B6B75] mb-6">Create your first group board or individual card to get started!</p>
              <Link href="/boards/create">
                <button className="px-8 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-full transition-colors shadow-lg">
                  Create Your First Board
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Boards Grid - Scrollable with max 2 rows */}
              <div className="relative bg-gradient-to-br from-[#F7FAFC] to-[#EDF2F7] rounded-xl p-6 border border-[#E5EAF0]">
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(2 * (280px + 1.5rem))' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedBoards.map((board) => (
                <div
                  key={board.id}
                  className="bg-white rounded-xl border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-lg transition-all overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-[#E5EAF0]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0B1F2A] text-lg mb-1 line-clamp-2">
                          {board.title}
                        </h3>
                        <p className="text-sm text-[#5B6B75] capitalize">
                          {board.format_type} • {board.occasion_type.replace('-', ' ')}
                        </p>
                      </div>
                      {getStatusBadge(board.status)}
                    </div>

                    {/* Recipients */}
                    <div className="flex items-center gap-2 text-sm text-[#5B6B75]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="truncate">
                        For: {board.recipients.map(r => r.name).join(', ') || 'No recipients'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    {/* Creation Date */}
                    <div className="flex items-center gap-2 text-sm text-[#5B6B75]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Created {formatDate(board.created_at)}</span>
                    </div>

                    {/* Message Count */}
                    <div className="flex items-center gap-2 text-sm text-[#5B6B75]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>
                        {board.format_type === 'board'
                          ? `${board.messageCount || 0} ${board.messageCount === 1 ? 'message' : 'messages'}`
                          : board.messageCount && board.messageCount > 0 ? 'Message added' : 'No message yet'
                        }
                      </span>
                    </div>

                    {/* Scheduled Delivery */}
                    {board.delivery_type === 'SCHEDULED' && board.scheduled_delivery && (
                      <div className="flex items-center gap-2 text-sm text-[#F59E0B]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Scheduled for {formatDate(board.scheduled_delivery)}</span>
                      </div>
                    )}

                  </div>

                  {/* Card Actions */}
                  <div className="p-4 bg-[#F7FAFC] border-t border-[#E5EAF0] flex gap-2">
                    {board.status === 'DELIVERED' ? (
                      <Link href={`/${board.format_type === 'card' ? 'cards' : 'boards'}/editor?id=${board.id}`} className="flex-1">
                        <button className="w-full py-2 px-4 bg-white hover:bg-[#E8F5F4] text-[#2CB1A6] border-2 border-[#2CB1A6] rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                      </Link>
                    ) : (
                      <Link href={`/${board.format_type === 'card' ? 'cards' : 'boards'}/editor?id=${board.id}`} className="flex-1">
                        <button className="w-full py-2 px-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </Link>
                    )}

                    <button
                      onClick={() => setShowDeleteConfirm(board.id)}
                      className="py-2 px-4 bg-white hover:bg-red-50 text-red-500 border-2 border-red-200 hover:border-red-500 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Delete Confirmation */}
                  {showDeleteConfirm === board.id && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 rounded-xl">
                      <div className="text-center">
                        <p className="text-[#0B1F2A] font-medium mb-4">
                          Delete this {board.format_type}?
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 bg-white hover:bg-[#F7FAFC] text-[#5B6B75] border-2 border-[#E5EAF0] rounded-lg font-medium transition-colors text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteBoard(board.id)}
                            disabled={deletingBoardId === board.id}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                          >
                            {deletingBoardId === board.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
                  </div>
                </div>

                {/* Load More Button */}
                {displayedBoards.length < getFilteredBoardsCount() && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-white border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? 'Loading...' : `Load More (${getFilteredBoardsCount() - displayedBoards.length} remaining)`}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Templates Section */}
        <div ref={templatesRef} className="mb-8">
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-[#0B1F2A]">Templates</h2>
                <p className="text-[#5B6B75] mt-2">Choose from our pre-designed templates to get started quickly</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Format Radio Filter */}
                <div className="flex items-center bg-white border-2 border-[#E5EAF0] rounded-lg overflow-hidden">
                  {(['all', 'board', 'card'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => { setTemplateFilterFormat(format); setVisibleOccasionCount(3); }}
                      className={`px-3 py-2 text-sm font-semibold transition-colors ${
                        templateFilterFormat === format
                          ? 'bg-[#2CB1A6] text-white'
                          : 'text-[#5B6B75] hover:bg-[#F7FAFC]'
                      }`}
                    >
                      {format === 'all' ? 'All' : format === 'board' ? 'Boards' : 'Cards'}
                    </button>
                  ))}
                </div>

                {/* Occasion Dropdown */}
                <select
                  value={templateFilterOccasion}
                  onChange={(e) => { setTemplateFilterOccasion(e.target.value); setVisibleOccasionCount(3); }}
                  className="px-3 py-2 bg-white border-2 border-[#E5EAF0] rounded-lg text-sm font-semibold text-[#0B1F2A] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                >
                  <option value="all">All Occasions</option>
                  {Array.from(new Set(templates.map(t => t.occasion_type))).map((type) => (
                    <option key={type} value={type}>
                      {type === 'newbaby' ? 'New Baby' : type === 'teamcelebration' ? 'Team Celebration' : type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>

                {/* Explore All Button */}
                <Link href="/templates">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-lg transition-colors shadow-sm text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
                    </svg>
                    Explore All Templates
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {loadingTemplates ? (
            <div className="bg-white rounded-2xl p-12 border border-[#E5EAF0] text-center">
              <div className="text-[#2CB1A6] text-lg">Loading templates...</div>
            </div>
          ) : templates.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-[#E5EAF0] text-center">
              <p className="text-[#5B6B75]">No templates available yet</p>
            </div>
          ) : (() => {
            const filteredTemplates = templates.filter(t => {
              const matchesFormat = templateFilterFormat === 'all' || t.format_type === templateFilterFormat;
              const matchesOccasion = templateFilterOccasion === 'all' || t.occasion_type === templateFilterOccasion;
              return matchesFormat && matchesOccasion;
            });
            const allOccasionTypes = Array.from(new Set(filteredTemplates.map(t => t.occasion_type)));
            const visibleOccasionTypes = allOccasionTypes.slice(0, visibleOccasionCount);

            return filteredTemplates.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-[#E5EAF0] text-center">
                <p className="text-[#5B6B75]">No templates match your filters</p>
              </div>
            ) : (
            <div className="space-y-8">
              {/* Group templates by occasion_type, show only visibleOccasionCount */}
              {visibleOccasionTypes
                .map((occasionType) => {
                  const occasionTemplates = filteredTemplates.filter(t => t.occasion_type === occasionType);
                  const occasionLabel = occasionType === 'newbaby' ? 'New Baby' : occasionType === 'teamcelebration' ? 'Team Celebration' : occasionType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                  return (
                    <div key={occasionType}>
                      <h3 className="text-lg font-bold text-[#0B1F2A] mb-4 capitalize">{occasionLabel}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {occasionTemplates.map((template) => (
                          <Link
                            key={template.id}
                            href={`/${template.format_type === 'card' ? 'cards' : 'boards'}/${template.short_id}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white rounded-xl border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-lg transition-all overflow-hidden"
                          >
                            <div className="aspect-square bg-gradient-to-br from-[#E8F5F4] to-[#F7FAFC] flex items-center justify-center p-2">
                              {template.lottieData ? (
                                <Lottie animationData={template.lottieData} loop={true} style={{ width: '100%', height: '100%' }} />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-[#A7E8E2] flex items-center justify-center">
                                  <svg className="w-6 h-6 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1 ${
                                template.format_type === 'card' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {template.format_type === 'card' ? 'Card' : 'Board'}
                              </span>
                              <p className="text-xs text-[#5B6B75] group-hover:text-[#2CB1A6] transition-colors font-medium">View Template →</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}

              {/* Load More */}
              {visibleOccasionCount < allOccasionTypes.length && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setVisibleOccasionCount(prev => prev + 3)}
                    className="px-6 py-2.5 bg-white border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4] rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Load More
                  </button>
                </div>
              )}
            </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}