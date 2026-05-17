"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { signUp, signIn } from "@/lib/auth";

type FormatType = "board" | "card" | null;

export default function CreateBoardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formatType, setFormatType] = useState<FormatType>(null);

  // Auth form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Check if user is already logged in, skip to step 3
  useEffect(() => {
    if (!authLoading && user && step === 2) {
      setStep(3);
    }
  }, [user, authLoading, step]);

  const handleFormatSelect = (format: FormatType) => {
    setFormatType(format);
    setStep(2);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);

    if (isSignIn) {
      // Sign in
      const { data, error } = await signIn(email, password);
      if (error) {
        setAuthError(error);
        setAuthSubmitting(false);
      } else {
        setStep(3);
      }
    } else {
      // Sign up
      const { data, error } = await signUp(email, password, name);
      if (error) {
        setAuthError(error);
        setAuthSubmitting(false);
      } else {
        // Auto sign in after signup
        const { data: signInData, error: signInError } = await signIn(email, password);
        if (signInError) {
          setAuthError("Account created! Please sign in.");
          setIsSignIn(true);
          setAuthSubmitting(false);
        } else {
          setStep(3);
        }
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-[#2CB1A6] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
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
          </Link>
          {user && (
            <Link href="/dashboard" className="text-[#5B6B75] hover:text-[#2CB1A6] transition-colors font-medium">
              Back to Dashboard
            </Link>
          )}
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-[#2CB1A6] text-white' : 'bg-[#E5EAF0] text-[#5B6B75]'
              }`}>
                1
              </div>
              <span className={`font-medium ${step >= 1 ? 'text-[#0B1F2A]' : 'text-[#5B6B75]'}`}>
                Choose Format
              </span>
            </div>

            {/* Divider */}
            <div className="w-16 h-0.5 bg-[#E5EAF0]" />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-[#2CB1A6] text-white' : 'bg-[#E5EAF0] text-[#5B6B75]'
              }`}>
                2
              </div>
              <span className={`font-medium ${step >= 2 ? 'text-[#0B1F2A]' : 'text-[#5B6B75]'}`}>
                Account
              </span>
            </div>

            {/* Divider */}
            <div className="w-16 h-0.5 bg-[#E5EAF0]" />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 3 ? 'bg-[#2CB1A6] text-white' : 'bg-[#E5EAF0] text-[#5B6B75]'
              }`}>
                3
              </div>
              <span className={`font-medium ${step >= 3 ? 'text-[#0B1F2A]' : 'text-[#5B6B75]'}`}>
                Create Board
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Choose Format */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-[#0B1F2A] text-center mb-3">
              Choose Your Format
            </h1>
            <p className="text-[#5B6B75] text-center mb-12 text-lg">
              Select how you'd like to collect messages and memories
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Board Option */}
              <button
                onClick={() => handleFormatSelect("board")}
                className="bg-white rounded-2xl p-8 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-xl transition-all text-left group"
              >
                <div className="w-20 h-20 rounded-full bg-[#A7E8E2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Board</h3>
                <p className="text-[#5B6B75] mb-4">
                  A collaborative space where multiple people can add messages, photos, and GIFs. Perfect for group celebrations!
                </p>
                <div className="flex items-center text-[#2CB1A6] font-medium">
                  Select Board
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Card Option */}
              <button
                onClick={() => handleFormatSelect("card")}
                className="bg-white rounded-2xl p-8 border-2 border-[#E5EAF0] hover:border-[#2CB1A6] hover:shadow-xl transition-all text-left group"
              >
                <div className="w-20 h-20 rounded-full bg-[#A7E8E2] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F2A] mb-3">Card</h3>
                <p className="text-[#5B6B75] mb-4">
                  A single digital greeting card with a focused message. Great for quick, personal celebrations and thank-yous.
                </p>
                <div className="flex items-center text-[#2CB1A6] font-medium">
                  Select Card
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Authentication (only if not logged in) */}
        {step === 2 && !user && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#E5EAF0]">
              <h2 className="text-3xl font-bold text-[#2CB1A6] mb-2 text-center">
                {isSignIn ? 'Sign In to Continue' : 'Create Your Account'}
              </h2>
              <p className="text-[#5B6B75] text-center mb-6">
                {isSignIn ? 'Sign in to create your board' : 'Quick signup to save and share your board'}
              </p>

              <form onSubmit={handleAuth} className="space-y-4">
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
                  disabled={authSubmitting}
                  className="w-full py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authSubmitting ? "PROCESSING..." : (isSignIn ? "SIGN IN" : "CREATE ACCOUNT")}
                </button>

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
              </form>

              <button
                onClick={() => setStep(1)}
                className="mt-6 text-[#5B6B75] hover:text-[#2CB1A6] transition-colors text-sm flex items-center gap-1 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to format selection
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Create Board (placeholder for now) */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-[#E5EAF0] text-center">
              <div className="w-24 h-24 rounded-full bg-[#A7E8E2] flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#0B1F2A] mb-4">
                Ready to Create Your {formatType === 'board' ? 'Board' : 'Card'}!
              </h2>
              <p className="text-[#5B6B75] mb-8 text-lg">
                Welcome, {user?.user_metadata?.name || user?.email}! 👋<br />
                The board creation interface will be implemented here.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-[#2CB1A6] text-[#2CB1A6] rounded-full font-semibold hover:bg-[#2CB1A6] hover:text-white transition-colors"
                >
                  Start Over
                </button>
                <Link href="/dashboard">
                  <button className="px-6 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white rounded-full font-semibold transition-colors shadow-lg">
                    Go to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}