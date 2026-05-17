"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, signUp, resetPassword, signInWithGoogle, signInWithFacebook, signInWithLinkedIn } from "@/lib/auth";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsSignUp(true);
      setIsForgotPassword(false);
    } else if (mode === 'forgot') {
      setIsForgotPassword(true);
      setIsSignUp(false);
    } else {
      setIsSignUp(false);
      setIsForgotPassword(false);
    }
    // Clear messages when switching modes
    setError(null);
    setSuccess(null);
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await signUp(email, password, name);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess("Account created! Please check your email to verify your account.");
      setLoading(false);
      // Optionally redirect to login after a few seconds
      setTimeout(() => {
        router.push('/login?mode=signin');
      }, 3000);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await resetPassword(email);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess("Password reset link sent! Please check your email.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await signInWithGoogle();
    if (error) {
      setError(error);
      setLoading(false);
    }
    // Redirect is handled by OAuth flow
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await signInWithFacebook();
    if (error) {
      setError(error);
      setLoading(false);
    }
    // Redirect is handled by OAuth flow
  };

  const handleLinkedInSignIn = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await signInWithLinkedIn();
    if (error) {
      setError(error);
      setLoading(false);
    }
    // Redirect is handled by OAuth flow
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#E8F5F4] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Cloud Effects */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-[#A7E8E2] rounded-full blur-[120px] opacity-40" />
      <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] bg-[#2CB1A6] rounded-full blur-[140px] opacity-30" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#1F8F86] rounded-full blur-[100px] opacity-35" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#A7E8E2] rounded-full blur-[90px] opacity-25" />

      {/* Main Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[700px]" style={{ overflow: 'hidden' }}>
        {/* Container wrapper for both panels */}
        <div className={`relative w-[200%] h-full flex transition-transform duration-700 ${isSignUp ? '-translate-x-1/2' : 'translate-x-0'}`}>

          {/* Sign In Panel */}
          <div className="w-1/2 h-full flex">
            {/* Sign In Form */}
            <div className="w-1/2 p-12 flex flex-col justify-center overflow-y-auto">
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

              <h2 className="text-3xl font-bold text-[#2CB1A6] mb-6">
                {isForgotPassword ? 'Reset Password' : 'Sign in to Cardora'}
              </h2>

              {!isForgotPassword && (
                <>
              {/* Social Login Buttons */}
              <div className="flex gap-4 mb-5 justify-center">
                <button
                  type="button"
                  onClick={handleFacebookSignIn}
                  disabled={loading}
                  className="w-12 h-12 border-2 border-[#E5EAF0] rounded-full flex items-center justify-center hover:border-[#2CB1A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sign in with Facebook"
                >
                  <svg className="w-5 h-5 text-[#5B6B75]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-12 h-12 border-2 border-[#E5EAF0] rounded-full flex items-center justify-center hover:border-[#2CB1A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sign in with Google"
                >
                  <svg className="w-5 h-5 text-[#5B6B75]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleLinkedInSignIn}
                  disabled={loading}
                  className="w-12 h-12 border-2 border-[#E5EAF0] rounded-full flex items-center justify-center hover:border-[#2CB1A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sign in with LinkedIn"
                >
                  <svg className="w-5 h-5 text-[#5B6B75]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>

              <p className="text-center text-[#5B6B75] text-sm mb-5">or use your email account:</p>
                </>
              )}

              {isForgotPassword ? (
                /* Forgot Password Form */
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-[#5B6B75] mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "SENDING..." : "SEND RESET LINK"}
                  </button>

                  <div className="text-center">
                    <Link href="/login?mode=signin" className="text-sm text-[#5B6B75] hover:text-[#2CB1A6] transition-colors">
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              ) : (
              /* Sign In Form */
              <form onSubmit={handleSignIn} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
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
                    className="w-full pl-12 pr-4 py-3 bg-[#F7FAFC] border-2 border-transparent rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  />
                </div>

                <div className="text-center">
                  <Link href="/login?mode=forgot" className="text-sm text-[#5B6B75] hover:text-[#2CB1A6] transition-colors">
                    Forgot your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "SIGNING IN..." : "SIGN IN"}
                </button>
              </form>
              )}
            </div>

            {/* Overlay - Hello Friend */}
            <div className="w-1/2 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86] text-white p-12 flex flex-col justify-center items-center">
              <h2 className="text-4xl font-bold mb-4">
                {isForgotPassword ? 'Remember Your Password?' : 'Join the Celebration!'}
              </h2>
              <p className="text-center mb-8 opacity-90">
                {isForgotPassword
                  ? 'Sign in to access your account'
                  : 'Sign up to create and share memorable group cards'}
              </p>
              <Link href={isForgotPassword ? "/login?mode=signin" : "/login?mode=signup"}>
                <button
                  className="px-12 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#2CB1A6] transition-all"
                >
                  {isForgotPassword ? 'SIGN IN' : 'SIGN UP'}
                </button>
              </Link>
            </div>
          </div>

          {/* Sign Up Panel */}
          <div className="w-1/2 h-full flex">
            {/* Overlay - Welcome Back */}
            <div className="w-1/2 bg-gradient-to-br from-[#2CB1A6] to-[#1F8F86] text-white p-12 flex flex-col justify-center items-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Celebrate?</h2>
              <p className="text-center mb-8 opacity-90">
                Log in to access your boards and keep the celebrations going
              </p>
              <button
                onClick={() => setIsSignUp(false)}
                className="px-12 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#2CB1A6] transition-all"
              >
                SIGN IN
              </button>
            </div>

            {/* Sign Up Form */}
            <div className="w-1/2 p-12 flex flex-col justify-center overflow-y-auto">
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

              <h2 className="text-3xl font-bold text-[#2CB1A6] mb-6">
                Create Account
              </h2>

              {/* Social Login Buttons */}
              <div className="flex gap-4 mb-5 justify-center">
                <button
                  type="button"
                  onClick={handleFacebookSignIn}
                  disabled={loading}
                  className="w-12 h-12 border-2 border-[#E5EAF0] rounded-full flex items-center justify-center hover:border-[#2CB1A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sign up with Facebook"
                >
                  <svg className="w-5 h-5 text-[#5B6B75]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-12 h-12 border-2 border-[#E5EAF0] rounded-full flex items-center justify-center hover:border-[#2CB1A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sign up with Google"
                >
                  <svg className="w-5 h-5 text-[#5B6B75]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleLinkedInSignIn}
                  disabled={loading}
                  className="w-12 h-12 border-2 border-[#E5EAF0] rounded-full flex items-center justify-center hover:border-[#2CB1A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Sign up with LinkedIn"
                >
                  <svg className="w-5 h-5 text-[#5B6B75]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>

              <p className="text-center text-[#5B6B75] text-sm mb-5">or use your email for registration:</p>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="space-y-4">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-[#F7FAFC] border-2 border-transparent rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  />
                </div>

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
                  disabled={loading}
                  className="w-full py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-full transition-colors shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-[#E5EAF0] flex items-center justify-center"><div className="text-[#2CB1A6] text-xl">Loading...</div></div>}>
      <LoginPageContent />
    </Suspense>
  );
}