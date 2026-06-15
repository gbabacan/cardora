"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";

export default function PricingFeaturesLotties() {
  const [loveAnimation, setLoveAnimation] = useState<any>(null);
  const [thankYouAnimation, setThankYouAnimation] = useState<any>(null);
  const [welcomeAnimation, setWelcomeAnimation] = useState<any>(null);
  const [weddingAnimation, setWeddingAnimation] = useState<any>(null);

  useEffect(() => {
    fetch("/lotties/love/love5.json").then(r => r.json()).then(setLoveAnimation).catch(() => {});
    fetch("/lotties/thankyou/thankYou5.json").then(r => r.json()).then(setThankYouAnimation).catch(() => {});
    fetch("/lotties/welcome/welcome4.json").then(r => r.json()).then(setWelcomeAnimation).catch(() => {});
    fetch("/lotties/wedding/wedding1.json").then(r => r.json()).then(setWeddingAnimation).catch(() => {});
  }, []);

  return (
    <>
      {loveAnimation && (
        <div className="hidden md:block absolute top-10 left-10 w-64 h-64 opacity-20 pointer-events-none">
          <Lottie animationData={loveAnimation} loop={true} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      {thankYouAnimation && (
        <div className="hidden md:block absolute top-20 right-10 w-72 h-72 opacity-20 pointer-events-none">
          <Lottie animationData={thankYouAnimation} loop={true} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      {welcomeAnimation && (
        <div className="hidden md:block absolute bottom-10 left-10 w-64 h-64 opacity-20 pointer-events-none">
          <Lottie animationData={welcomeAnimation} loop={true} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      {weddingAnimation && (
        <div className="hidden md:block absolute bottom-20 right-20 w-64 h-64 opacity-20 pointer-events-none">
          <Lottie animationData={weddingAnimation} loop={true} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
    </>
  );
}
