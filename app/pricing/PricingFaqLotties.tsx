"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";

export default function PricingFaqLotties() {
  const [anim1, setAnim1] = useState<any>(null);
  const [anim2, setAnim2] = useState<any>(null);
  const [anim3, setAnim3] = useState<any>(null);
  const [anim4, setAnim4] = useState<any>(null);

  useEffect(() => {
    fetch("/lotties/birthday/birthday3.json").then(r => r.json()).then(setAnim1).catch(() => {});
    fetch("/lotties/christmas/christmas3.json").then(r => r.json()).then(setAnim2).catch(() => {});
    fetch("/lotties/newbaby/baby2.json").then(r => r.json()).then(setAnim3).catch(() => {});
    fetch("/lotties/farewell/farewell3.json").then(r => r.json()).then(setAnim4).catch(() => {});
  }, []);

  return (
    <>
      {anim1 && (
        <div className="hidden md:block absolute top-10 left-10 w-64 h-64 opacity-15 pointer-events-none">
          <Lottie animationData={anim1} loop={true} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      {anim2 && (
        <div className="hidden md:block absolute top-10 right-10 w-64 h-64 opacity-15 pointer-events-none">
          <Lottie animationData={anim2} loop={true} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      {anim3 && (
        <div className="hidden md:block absolute bottom-10 left-10 w-64 h-64 opacity-15 pointer-events-none">
          <Lottie animationData={anim3} loop={true} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      {anim4 && (
        <div className="hidden md:block absolute bottom-10 right-10 w-64 h-64 opacity-15 pointer-events-none">
          <Lottie animationData={anim4} loop={true} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
    </>
  );
}
