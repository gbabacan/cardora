"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";

export default function NotFound() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Load 404 animation
    fetch('/404.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Error loading 404 animation:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Animated Smoke Effect Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="smoke-1"></div>
        <div className="smoke-2"></div>
        <div className="smoke-3"></div>
        <div className="smoke-4"></div>
        <div className="smoke-5"></div>
      </div>

      <style jsx>{`
        .smoke-1, .smoke-2, .smoke-3, .smoke-4, .smoke-5 {
          position: absolute;
          background: radial-gradient(circle, rgba(44, 177, 166, 0.4) 0%, rgba(44, 177, 166, 0.2) 40%, transparent 70%);
          border-radius: 50%;
          filter: blur(80px);
          animation: float 20s ease-in-out infinite;
        }

        .smoke-1 {
          width: 800px;
          height: 800px;
          top: -300px;
          left: -300px;
          animation-delay: 0s;
        }

        .smoke-2 {
          width: 1000px;
          height: 1000px;
          bottom: -400px;
          right: -400px;
          animation-delay: 7s;
          animation-duration: 25s;
        }

        .smoke-3 {
          width: 900px;
          height: 900px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 14s;
          animation-duration: 30s;
        }

        .smoke-4 {
          width: 700px;
          height: 700px;
          top: 20%;
          right: -200px;
          animation-delay: 10s;
          animation-duration: 22s;
        }

        .smoke-5 {
          width: 750px;
          height: 750px;
          bottom: 10%;
          left: -250px;
          animation-delay: 5s;
          animation-duration: 28s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% {
            transform: translate(100px, -100px) scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-100px, 100px) scale(0.9);
            opacity: 0.7;
          }
          75% {
            transform: translate(150px, 50px) scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>

      {/* Logo and Company Name - Upper Left */}
      <Link href="/" className="fixed top-8 left-8 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        <Image
          src="/cardoraLogo.png"
          alt="Cardora Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-2xl font-bold text-[#2CB1A6]">Cardora</span>
      </Link>

      {/* Main Content */}
      <div className="relative text-center w-full z-10">
        {/* 404 Lottie Animation */}
        {animationData && (
          <div className="w-[900px] h-[900px] mx-auto">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-4 justify-center">
          <Link href="/">
            <button className="px-8 py-3 bg-[#2CB1A6] hover:bg-[#1F8F86] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
              Go Home
            </button>
          </Link>
          <Link href="/boards/create">
            <button className="px-8 py-3 bg-white hover:bg-gray-50 text-[#2CB1A6] font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-[#2CB1A6]">
              Create a Board
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
