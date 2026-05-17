"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signUp, signIn } from "@/lib/auth";
import { createBoard } from "@/lib/boards";
import Toast from "@/components/Toast";

const OCCASIONS = [
  {
    id: 'thank-you',
    name: 'Thank You',
    placeholder: 'e.g., Thank You for Your Hard Work!',
    exampleImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    id: 'birthdays',
    name: 'Birthdays',
    placeholder: 'e.g., Happy Birthday Sarah!',
    exampleImage: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
      </svg>
    ),
    gradient: 'from-purple-400 to-indigo-500',
  },
  {
    id: 'new-baby',
    name: 'New Baby',
    placeholder: 'e.g., Welcome Baby Emma!',
    exampleImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'team-celebration',
    name: 'Team Celebration',
    placeholder: 'e.g., Amazing Job on the Product Launch!',
    exampleImage: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'company-celebration',
    name: 'Company Celebration',
    placeholder: 'e.g., Celebrating 10 Years of Success!',
    exampleImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'work-anniversary',
    name: 'Work Anniversary',
    placeholder: 'e.g., 5 Years with Our Amazing Team!',
    exampleImage: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'farewell',
    name: 'Farewell',
    placeholder: 'e.g., Goodbye and Good Luck, Michael!',
    exampleImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    id: 'retirement',
    name: 'Retirement',
    placeholder: 'e.g., Happy Retirement, Bob!',
    exampleImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    id: 'congratulations',
    name: 'Congratulations',
    placeholder: 'e.g., Congrats on Your New Role!',
    exampleImage: 'https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    gradient: 'from-fuchsia-400 to-pink-500',
  },
  {
    id: 'recruiting-onboarding',
    name: 'Recruiting & Onboarding',
    placeholder: 'e.g., Welcome to the Team, Jessica!',
    exampleImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    id: 'office-competition',
    name: 'Office Competition',
    placeholder: 'e.g., Great Job Winning the Challenge!',
    exampleImage: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    gradient: 'from-red-400 to-rose-500',
  },
  {
    id: 'sympathy',
    name: 'Sympathy',
    placeholder: 'e.g., Our Thoughts Are With You',
    exampleImage: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    gradient: 'from-slate-400 to-gray-500',
  },
  {
    id: 'get-well-soon',
    name: 'Get Well Soon',
    placeholder: 'e.g., Get Well Soon, Alex!',
    exampleImage: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    gradient: 'from-lime-400 to-green-500',
  },
  {
    id: 'employee-appreciation',
    name: 'Employee Appreciation',
    placeholder: 'e.g., You Make a Difference Every Day!',
    exampleImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    ),
    gradient: 'from-orange-400 to-red-500',
  },
  {
    id: 'holiday-celebration',
    name: 'Holiday Celebration',
    placeholder: 'e.g., Happy Holidays from Our Team!',
    exampleImage: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    gradient: 'from-red-400 to-green-500',
  },
  {
    id: 'fathers-day',
    name: "Father's Day",
    placeholder: "e.g., Happy Father's Day, Dad!",
    exampleImage: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'mothers-day',
    name: "Mother's Day",
    placeholder: "e.g., Happy Mother's Day, Mom!",
    exampleImage: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'valentines-day',
    name: "Valentine's Day",
    placeholder: "e.g., Happy Valentine's Day, Sweetheart!",
    exampleImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    gradient: 'from-red-500 to-pink-600',
  },
  {
    id: 'weddings',
    name: 'Weddings',
    placeholder: 'e.g., Congratulations on Your Wedding!',
    exampleImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    gradient: 'from-rose-300 to-pink-400',
  },
  {
    id: 'any-other',
    name: 'Any Other',
    placeholder: 'e.g., Celebrating a Special Moment!',
    exampleImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=800&fit=crop',
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    gradient: 'from-gray-400 to-slate-500',
  },
];

export default function CreateBoardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipients, setRecipients] = useState<string[]>(['']);
  const [cardTitle, setCardTitle] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<'board' | 'card' | null>(null);

  // Auth form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoadingState, setAuthLoadingState] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const filteredOccasions = OCCASIONS.filter((occasion) =>
    occasion.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-select occasion from URL parameter
  useEffect(() => {
    const occasionParam = searchParams.get('occasion');
    if (occasionParam && OCCASIONS.find(o => o.id === occasionParam)) {
      setSelectedOccasion(occasionParam);
    }
  }, [searchParams]);

  const addRecipient = () => {
    setRecipients([...recipients, '']);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index: number, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index] = value;
    setRecipients(newRecipients);
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const isStep1Valid = () => {
    return cardTitle.trim() !== '' && recipients.some(r => r.trim() !== '');
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Smoke/Cloud Effects */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-[#A7E8E2] rounded-full blur-[120px] opacity-40" />
      <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] bg-[#2CB1A6] rounded-full blur-[140px] opacity-30" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#1F8F86] rounded-full blur-[100px] opacity-35" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#A7E8E2] rounded-full blur-[90px] opacity-25" />

      {/* Header */}
      <header className="border-b border-[#E5EAF0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/cardoraLogo.png"
                alt="Cardora"
                width={240}
                height={64}
                className="h-16 w-auto"
                priority
              />
              <span className="text-3xl font-bold text-[#2CB1A6]">Cardora</span>
            </Link>

            {/* Back Link */}
            <Link href="/" className="text-[#5B6B75] hover:text-[#0B1F2A] transition-colors font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#0B1F2A] mb-4">
                Choose Your Occasion
              </h1>
              <p className="text-lg text-[#5B6B75] max-w-2xl mx-auto mb-8">
                Select the perfect celebration type to create a memorable group card
              </p>

              {/* Search Box */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-[#5B6B75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search occasions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-transparent border-0 border-b-2 border-[#E5EAF0] focus:border-[#2CB1A6] focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Occasions Grid */}
            {filteredOccasions.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredOccasions.map((occasion) => (
                <button
                  key={occasion.id}
                  onClick={() => setSelectedOccasion(occasion.id)}
                  className="group relative bg-white rounded-xl p-4 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-[#E5EAF0] hover:border-[#2CB1A6]"
                >
                  {/* Icon Container */}
                  <div className="w-14 h-14 mx-auto mb-3 rounded-lg bg-transparent p-3 text-[#2CB1A6] group-hover:scale-110 transition-transform duration-300">
                    {occasion.icon}
                  </div>

                  {/* Occasion Name */}
                  <h3 className="text-center text-sm font-bold text-[#0B1F2A] group-hover:text-[#2CB1A6] transition-colors">
                    {occasion.name}
                  </h3>
                </button>
              ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-[#E5EAF0] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-[#5B6B75] mb-2">No occasions found</p>
                <p className="text-[#5B6B75]">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Modal Panel */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
          selectedOccasion ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] flex transform transition-all duration-500 overflow-hidden ${
            selectedOccasion ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Left Panel - Example Image */}
          <div className="hidden md:flex md:w-1/2 bg-[#E8F5F4] items-center justify-center p-8 relative">
            {selectedOccasion && (
              <>
                <div className="relative max-w-md">
                  <img
                    src={OCCASIONS.find(o => o.id === selectedOccasion)?.exampleImage}
                    alt={OCCASIONS.find(o => o.id === selectedOccasion)?.name + " example"}
                    className="rounded-2xl shadow-2xl w-full"
                  />
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-1/2 flex flex-col max-h-[90vh] relative overflow-hidden">
            {/* Step 1: Details */}
            <div className={`absolute inset-0 flex flex-col transition-transform duration-500 ${currentStep === 1 ? 'translate-x-0' : '-translate-x-full'}`}>
              {/* Panel Header */}
              <div className="px-8 pt-8 pb-6 relative flex-shrink-0">
                <button
                  onClick={() => setSelectedOccasion(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
                >
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {selectedOccasion && (
                  <>
                    <div className="w-16 h-16 mb-4 rounded-xl bg-[#E8F5F4] p-3 text-[#2CB1A6]">
                      {OCCASIONS.find(o => o.id === selectedOccasion)?.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-[#0B1F2A] mb-2">
                      {OCCASIONS.find(o => o.id === selectedOccasion)?.name}
                    </h2>
                    <p className="text-[#5B6B75]">
                      Create a beautiful group card for this special occasion
                    </p>
                  </>
                )}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-4">
            <div className="space-y-6">
              {/* Card Title Input */}
              <div>
                <label className="block text-sm font-semibold text-[#0B1F2A] mb-2">
                  Card Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder={OCCASIONS.find(o => o.id === selectedOccasion)?.placeholder || "e.g., Happy Birthday Sarah!"}
                  className="w-full px-4 py-3 bg-[#F7FAFC] border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                />
              </div>

              {/* Recipient Names */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-[#0B1F2A]">
                    Recipient Name(s) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addRecipient}
                    className="flex items-center gap-1 text-sm text-[#2CB1A6] hover:text-[#1F8F86] font-semibold transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Recipient
                  </button>
                </div>
                <div className="space-y-3">
                  {recipients.map((recipient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Who is this card for?"
                        value={recipient}
                        onChange={(e) => updateRecipient(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-[#F7FAFC] border-2 border-[#E5EAF0] rounded-lg focus:border-[#2CB1A6] focus:outline-none transition-colors"
                      />
                      {recipients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRecipient(index)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors flex-shrink-0"
                          title="Remove recipient"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

              {/* Panel Footer */}
              <div className="p-8 border-t border-[#E5EAF0] bg-[#F7FAFC] flex-shrink-0">
                <button
                  onClick={handleNextStep}
                  disabled={!isStep1Valid()}
                  className="w-full py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-bold rounded-lg transition-colors shadow-lg text-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Step 2: Choose Format */}
            <div className={`absolute inset-0 flex flex-col transition-transform duration-500 ${currentStep === 2 ? 'translate-x-0' : 'translate-x-full'}`}>
              {/* Panel Header */}
              <div className="px-8 pt-8 pb-6 relative flex-shrink-0">
                <button
                  onClick={() => setSelectedOccasion(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
                >
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <button
                  onClick={handleBackStep}
                  className="flex items-center gap-2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors mb-6"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <h2 className="text-3xl font-bold text-[#0B1F2A] mb-2">
                  Choose format
                </h2>
                <p className="text-[#5B6B75]">
                  What's the format?
                </p>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-4">
                  {/* Board Option */}
                  <button
                    onClick={() => setSelectedFormat('board')}
                    className={`p-6 rounded-xl border-4 transition-all hover:scale-105 ${
                      selectedFormat === 'board'
                        ? 'border-[#2CB1A6] bg-[#E8F5F4]'
                        : 'border-[#E5EAF0] bg-white'
                    }`}
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-lg p-3 flex items-center justify-center">
                      <svg className="w-full h-full text-[#2CB1A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Board</h3>
                    <p className="text-sm text-[#5B6B75]">
                      Invite <span className="font-bold">multiple</span> people to add content
                    </p>
                  </button>

                  {/* Card Option */}
                  <button
                    onClick={() => setSelectedFormat('card')}
                    className={`p-6 rounded-xl border-4 transition-all hover:scale-105 ${
                      selectedFormat === 'card'
                        ? 'border-[#2CB1A6] bg-[#E8F5F4]'
                        : 'border-[#E5EAF0] bg-white'
                    }`}
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-lg p-3 flex items-center justify-center">
                      <svg className="w-full h-full text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1F2A] mb-2">Card</h3>
                    <p className="text-sm text-[#5B6B75]">
                      Perfect if you are the <span className="font-bold">only</span> contributor
                    </p>
                  </button>
                </div>
              </div>

              {/* Panel Footer */}
              <div className="p-8 border-t border-[#E5EAF0] bg-[#F7FAFC] flex-shrink-0">
                <button
                  onClick={async () => {
                    if (user) {
                      // User is logged in, create board and redirect to editor
                      setAuthLoadingState(true);
                      const { board, error } = await createBoard({
                        title: cardTitle,
                        occasion_type: selectedOccasion || '',
                        format_type: selectedFormat || 'board',
                        recipients: recipients.filter(r => r.trim())
                      });

                      if (error) {
                        setToast({ message: 'Error creating board: ' + error, type: 'error' });
                        setAuthLoadingState(false);
                      } else if (board) {
                        router.push(`/boards/editor?id=${board.id}`);
                      }
                    } else {
                      // User not logged in, go to step 3 (auth)
                      setCurrentStep(3);
                    }
                  }}
                  disabled={!selectedFormat || authLoadingState}
                  className="w-full py-4 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-bold rounded-lg transition-colors shadow-lg text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {authLoadingState ? 'Creating...' : 'Next'}
                </button>
              </div>
            </div>

            {/* Step 3: Authentication (only if not logged in) */}
            <div className={`absolute inset-0 flex flex-col transition-transform duration-500 ${currentStep === 3 ? 'translate-x-0' : 'translate-x-full'}`}>
              {/* Panel Header */}
              <div className="px-8 pt-8 pb-6 relative flex-shrink-0">
                <button
                  onClick={() => setSelectedOccasion(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F7FAFC] transition-colors"
                >
                  <svg className="w-6 h-6 text-[#0B1F2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 text-[#5B6B75] hover:text-[#0B1F2A] transition-colors mb-6"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <h2 className="text-3xl font-bold text-[#0B1F2A] mb-2">
                  {isSignIn ? 'Sign In to Continue' : 'Create Your Account'}
                </h2>
                <p className="text-[#5B6B75]">
                  {isSignIn ? 'Sign in to create your board' : 'Quick signup to save and share your board'}
                </p>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-4">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setAuthLoadingState(true);
                  setAuthError(null);

                  if (isSignIn) {
                    const { data, error } = await signIn(email, password);
                    if (error) {
                      setAuthError(error);
                      setAuthLoadingState(false);
                    } else {
                      // Create board and redirect to editor
                      const { board, error: boardError } = await createBoard({
                        title: cardTitle,
                        occasion_type: selectedOccasion || '',
                        format_type: selectedFormat || 'board',
                        recipients: recipients.filter(r => r.trim())
                      });

                      if (boardError) {
                        setAuthError('Error creating board: ' + boardError);
                        setAuthLoadingState(false);
                      } else if (board) {
                        router.push(`/boards/editor?id=${board.id}`);
                      }
                    }
                  } else {
                    const { data, error } = await signUp(email, password, name);
                    if (error) {
                      setAuthError(error);
                      setAuthLoadingState(false);
                    } else {
                      const { data: signInData, error: signInError } = await signIn(email, password);
                      if (signInError) {
                        setAuthError("Account created! Please sign in.");
                        setIsSignIn(true);
                        setAuthLoadingState(false);
                      } else {
                        // Create board and redirect to editor
                        const { board, error: boardError } = await createBoard({
                          title: cardTitle,
                          occasion_type: selectedOccasion || '',
                          format_type: selectedFormat || 'board',
                          recipients: recipients.filter(r => r.trim())
                        });

                        if (boardError) {
                          setAuthError('Error creating board: ' + boardError);
                          setAuthLoadingState(false);
                        } else if (board) {
                          router.push(`/boards/editor?id=${board.id}`);
                        }
                      }
                    }
                  }
                }} className="space-y-4">
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
                    disabled={authLoadingState}
                    className="w-full py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {authLoadingState ? "PROCESSING..." : (isSignIn ? "SIGN IN" : "CREATE ACCOUNT")}
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
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Overlay */}
      {selectedOccasion && (
        <div
          onClick={() => setSelectedOccasion(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}
    </div>
    </>
  );
}