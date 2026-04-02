"use client";

import { useEffect, useState } from "react";

export function HeroLogo() {
  const [opacity, setOpacity] = useState(1);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      // Fade and lift over the first 300px of scroll for a slow, gradual effect
      const progress = Math.min(scrollY / 300, 1);
      setOpacity(1 - progress);
      setTranslateY(-progress * 20);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <img
        src="/images/link_icons/white_logo.png"
        alt="TrustRefer logo"
        className="mb-4"
        style={{
          width: "300px",
          height: "300px",
          objectFit: "contain",
          opacity,
          transform: `translateY(${translateY}px)`,
          transition: "opacity 0.08s linear, transform 0.08s linear",
          willChange: "opacity, transform",
        }}
      />
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        TrustRefer
      </h1>
      <p className="mt-2 text-sm text-[#888]">
        Our trusted referral community hub
      </p>
    </div>
  );
}
