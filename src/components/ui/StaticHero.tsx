"use client";

import { useState, useEffect } from "react";
import type { Hero } from "@prisma/client";

interface StaticHeroProps {
  hero: Hero | null;
}

export default function StaticHero({ hero }: StaticHeroProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleLoaded = () => {
      setLoaded(true);
    };
    window.addEventListener("portfolio-loaded", handleLoaded);
    return () => {
      window.removeEventListener("portfolio-loaded", handleLoaded);
    };
  }, []);

  if (loaded) return null;

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] text-white">
        {hero?.name || "Abdullah Bin Zubair"}
      </h1>
      <p className="text-xl md:text-3xl font-bold tracking-[0.3em] uppercase text-[#00e5ff] mt-4 drop-shadow-[0_0_10px_rgba(0,229,255,1)]">
        {hero?.title || "Full Stack Developer"}
      </p>

      {hero?.intro && (
        <div className="mt-8 max-w-2xl px-6 py-4 rounded-2xl bg-[#0a192f]/60 border border-[#00e5ff]/20 backdrop-blur-md shadow-[0_0_30px_rgba(0,229,255,0.1)]">
          <p className="text-zinc-300 font-mono leading-relaxed text-sm md:text-base">
            {hero.intro}
          </p>
        </div>
      )}

      <p className="mt-12 text-zinc-500 font-mono tracking-widest uppercase animate-pulse">
        [ SCROLL DOWN ]
      </p>
    </div>
  );
}
