"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Toast from "@/components/Toast";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name }
      });

      if (error) throw error;

      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      setToast({ message: 'Error updating profile: ' + error.message, type: 'error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!currentPassword) {
      setToast({ message: 'Please enter your current password', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: 'New password must be at least 6 characters', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    setSavingPassword(true);

    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setToast({ message: 'Password changed successfully!', type: 'success' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setToast({ message: 'Error changing password: ' + error.message, type: 'error' });
    } finally {
      setSavingPassword(false);
    }
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
                <Link href="/dashboard">
                  <button className="w-full text-left px-4 py-2 text-[#5B6B75] hover:bg-[#F7FAFC] hover:text-[#2CB1A6] transition-colors">
                    Dashboard
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
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0B1F2A] mb-2">Account Settings</h1>
          <p className="text-[#5B6B75] text-lg">
            Manage your profile and account preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl p-8 border border-[#E5EAF0]">
            <h2 className="text-2xl font-bold text-[#0B1F2A] mb-6">Profile Information</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 border-2 border-[#E5EAF0] rounded-lg text-[#5B6B75] bg-[#F7FAFC] cursor-not-allowed"
                />
                <p className="text-xs text-[#5B6B75] mt-2">
                  Email cannot be changed at this time
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-8 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-2xl p-8 border border-[#E5EAF0]">
            <h2 className="text-2xl font-bold text-[#0B1F2A] mb-6">Change Password</h2>

            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#E5EAF0] rounded-lg text-[#0B1F2A] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Change Password Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-8 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-lg font-semibold transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {savingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl p-8 border border-[#E5EAF0]">
            <h2 className="text-2xl font-bold text-[#0B1F2A] mb-6">Account Information</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#E5EAF0]">
                <div>
                  <p className="text-sm font-semibold text-[#0B1F2A]">Account Created</p>
                  <p className="text-sm text-[#5B6B75] mt-1">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-[#0B1F2A]">User ID</p>
                  <p className="text-sm text-[#5B6B75] mt-1 font-mono">{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
