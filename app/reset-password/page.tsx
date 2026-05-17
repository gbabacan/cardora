"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { updatePassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { data, error } = await updatePassword(password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess("Password updated successfully! Redirecting to login...");
      setLoading(false);
      setTimeout(() => {
        router.push('/login?mode=signin');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Cloud Effects */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-[#A7E8E2] rounded-full blur-[120px] opacity-40" />
      <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] bg-[#2CB1A6] rounded-full blur-[140px] opacity-30" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#1F8F86] rounded-full blur-[100px] opacity-35" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#A7E8E2] rounded-full blur-[90px] opacity-25" />

      {/* Main Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-12">
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <Image
              src="/cardoraLogo.png"
              alt="Cardora"
              width={180}
              height={48}
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold text-[#2CB1A6]">Cardora</span>
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-[#2CB1A6] mb-2">
          Reset Your Password
        </h2>
        <p className="text-[#5B6B75] mb-6">
          Enter your new password below
        </p>

        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-12 pr-4 py-3 bg-[#F7FAFC] border-2 border-transparent rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "UPDATING..." : "UPDATE PASSWORD"}
          </button>

          <div className="text-center mt-4">
            <Link href="/login?mode=signin" className="text-sm text-[#5B6B75] hover:text-[#2CB1A6] transition-colors">
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}