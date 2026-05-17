"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { getUserBoards, deleteBoard } from "@/lib/boards";
import type { Board, Recipient } from "@/lib/boards";
import Toast from "@/components/Toast";

interface BoardWithRecipients extends Board {
  recipients: Recipient[];
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [boards, setBoards] = useState<BoardWithRecipients[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [deletingBoardId, setDeletingBoardId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

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
        setBoards(userBoards as BoardWithRecipients[]);
      }

      setLoadingBoards(false);
    };

    if (user) {
      loadBoards();
    }
  }, [user]);

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

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-[#2CB1A6] text-white flex items-center justify-center font-bold">
                {user.user_metadata?.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </div>
              <span className="text-[#0B1F2A] font-medium">
                {user.user_metadata?.name || user.email}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#E5EAF0] py-2 z-10">
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
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0B1F2A] mb-2">
            Welcome back, {user.user_metadata?.name || 'there'}! 👋
          </h1>
          <p className="text-[#5B6B75] text-lg">
            Create and manage your group cards
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
            <h3 className="text-2xl font-bold text-[#0B1F2A] mb-2">Create New Board</h3>
            <p className="text-[#5B6B75]">Start a new group card for any occasion</p>
          </Link>

          <button className="bg-white rounded-2xl p-8 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-xl transition-all text-left group">
            <div className="w-16 h-16 rounded-full bg-[#F7FAFC] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-[#5B6B75] group-hover:text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#0B1F2A] mb-2">Browse Templates</h3>
            <p className="text-[#5B6B75]">Choose from pre-designed templates</p>
          </button>
        </div>

        {/* My Boards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0B1F2A]">My Boards & Cards</h2>
            {boards.length > 0 && (
              <span className="text-[#5B6B75]">{boards.length} {boards.length === 1 ? 'item' : 'items'}</span>
            )}
          </div>

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
              <p className="text-[#5B6B75] mb-6">Create your first group card to get started!</p>
              <Link href="/boards/create">
                <button className="px-8 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-full transition-colors shadow-lg">
                  Create Your First Board
                </button>
              </Link>
            </div>
          ) : (
            /* Boards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boards.map((board) => (
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

                    {/* Scheduled Delivery */}
                    {board.delivery_type === 'SCHEDULED' && board.scheduled_delivery && (
                      <div className="flex items-center gap-2 text-sm text-[#F59E0B]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Scheduled for {formatDate(board.scheduled_delivery)}</span>
                      </div>
                    )}

                    {/* Short Link */}
                    <div className="flex items-center gap-2 text-sm text-[#5B6B75]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <code className="text-xs bg-[#F7FAFC] px-2 py-1 rounded">
                        cardora.io/b/{board.short_id}
                      </code>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 bg-[#F7FAFC] border-t border-[#E5EAF0] flex gap-2">
                    {board.status === 'DELIVERED' ? (
                      <Link href={`/boards/editor?id=${board.id}`} className="flex-1">
                        <button className="w-full py-2 px-4 bg-white hover:bg-[#E8F5F4] text-[#2CB1A6] border-2 border-[#2CB1A6] rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                      </Link>
                    ) : (
                      <Link href={`/boards/editor?id=${board.id}`} className="flex-1">
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
          )}
        </div>
      </main>
    </div>
  );
}