"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import type { Hobby } from "@prisma/client";

const ICONS: Record<string, (isHovered: boolean) => React.ReactNode> = {
    podcast: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeWidth={1.5}>
            <circle cx="32" cy="32" r="18" stroke={isHovered ? "#00e5ff" : "#1a3a5c"} strokeWidth="2" style={{ transition: "stroke 0.4s" }} />
            <circle cx="32" cy="32" r="8" fill={isHovered ? "#00e5ff" : "#0a192f"} style={{ transition: "fill 0.4s" }} />
            <circle cx="32" cy="32" r="3" fill={isHovered ? "#fff" : "#00e5ff"} style={{ transition: "fill 0.4s" }} />
            <path d="M14 32 Q10 24 14 16" stroke={isHovered ? "#00e5ff" : "#1a3a5c"} strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke 0.4s", opacity: isHovered ? 1 : 0.3 }} />
            <path d="M8 32 Q2 20 8 8" stroke={isHovered ? "#00e5ff" : "#1a3a5c"} strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke 0.4s", opacity: isHovered ? 1 : 0.15 }} />
            <path d="M50 32 Q54 24 50 16" stroke={isHovered ? "#00e5ff" : "#1a3a5c"} strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke 0.4s", opacity: isHovered ? 1 : 0.3 }} />
            <path d="M56 32 Q62 20 56 8" stroke={isHovered ? "#00e5ff" : "#1a3a5c"} strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke 0.4s", opacity: isHovered ? 1 : 0.15 }} />
        </svg>
    ),
    islamic: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
            <path d="M32 8 C18 8 8 18 8 32 C8 46 18 56 32 56 C22 48 16 40 18 30 C20 18 28 12 40 14 C38 10 35 8 32 8Z" fill={isHovered ? "#ffd700" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <g transform="translate(42,14) scale(0.7)" style={{ transition: "opacity 0.4s", opacity: isHovered ? 1 : 0.4 }}>
                <polygon points="10,0 12,7 20,7 14,11 16,18 10,14 4,18 6,11 0,7 8,7" fill={isHovered ? "#ffd700" : "#334"} />
            </g>
        </svg>
    ),
    fitness: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="26" width="8" height="12" rx="3" fill={isHovered ? "#00ff88" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <rect x="2" y="29" width="6" height="6" rx="2" fill={isHovered ? "#00ff88" : "#0a3a1a"} style={{ transition: "fill 0.4s" }} />
            <rect x="50" y="26" width="8" height="12" rx="3" fill={isHovered ? "#00ff88" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <rect x="56" y="29" width="6" height="6" rx="2" fill={isHovered ? "#00ff88" : "#0a3a1a"} style={{ transition: "fill 0.4s" }} />
            <rect x="14" y="30" width="36" height="4" rx="2" fill={isHovered ? "#00ff88" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <circle cx="32" cy="14" r="4" fill={isHovered ? "#00ff88" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
        </svg>
    ),
    calligraphy: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
            <path d="M14 50 L28 18 L36 22 L22 54Z" fill={isHovered ? "#b300ff" : "#1a1a2e"} stroke={isHovered ? "#b300ff" : "#2a1a4e"} strokeWidth="1.5" style={{ transition: "all 0.4s" }} />
            <path d="M28 18 L46 8 L36 22Z" fill={isHovered ? "#d966ff" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <ellipse cx="18" cy="52" rx="4" ry="5" fill={isHovered ? "#b300ff" : "#0a0a1a"} style={{ transition: "fill 0.4s", opacity: isHovered ? 0.8 : 0.3 }} />
            <path d="M38 36 Q50 30 56 40" stroke={isHovered ? "#d966ff" : "#1a3a5c"} strokeWidth="2" strokeLinecap="round" style={{ transition: "stroke 0.4s" }} />
            <path d="M36 42 Q52 38 56 50" stroke={isHovered ? "#b300ff" : "#1a1a2e"} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.4s" }} />
        </svg>
    ),
    coding: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 16 L8 32 L24 48" stroke={isHovered ? "#ff6b35" : "#1a3a5c"} strokeWidth="3" style={{ transition: "stroke 0.4s" }} />
            <path d="M40 16 L56 32 L40 48" stroke={isHovered ? "#ff6b35" : "#1a3a5c"} strokeWidth="3" style={{ transition: "stroke 0.4s" }} />
            <path d="M36 10 L28 54" stroke={isHovered ? "#ff6b35" : "#1a3a5c"} strokeWidth="2" style={{ transition: "stroke 0.4s", opacity: isHovered ? 1 : 0.4 }} />
        </svg>
    ),
    gaming: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeLinecap="round" strokeLinejoin="round">
            <rect x="10" y="20" width="44" height="24" rx="12" stroke={isHovered ? "#ff3366" : "#1a3a5c"} strokeWidth="2" fill={isHovered ? "rgba(255,51,102,0.1)" : "none"} style={{ transition: "all 0.4s" }} />
            <path d="M22 28 V36 M18 32 H26" stroke={isHovered ? "#ff3366" : "#1a3a5c"} strokeWidth="2" style={{ transition: "stroke 0.4s" }} />
            <circle cx="44" cy="34" r="2" fill={isHovered ? "#ff3366" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <circle cx="38" cy="28" r="2" fill={isHovered ? "#ff3366" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
        </svg>
    ),
    music: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeLinecap="round" strokeLinejoin="round">
            <path d="M28 44 V16 L48 12 V40" stroke={isHovered ? "#ff00ff" : "#1a3a5c"} strokeWidth="2" style={{ transition: "stroke 0.4s" }} />
            <path d="M28 24 L48 20" stroke={isHovered ? "#ff00ff" : "#1a3a5c"} strokeWidth="2" style={{ transition: "stroke 0.4s", opacity: isHovered ? 1 : 0.5 }} />
            <circle cx="24" cy="44" r="4" fill={isHovered ? "#ff00ff" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <circle cx="44" cy="40" r="4" fill={isHovered ? "#ff00ff" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
        </svg>
    ),
    reading: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeLinecap="round" strokeLinejoin="round">
            <path d="M32 16 V50" stroke={isHovered ? "#ffaa00" : "#1a3a5c"} strokeWidth="2" style={{ transition: "stroke 0.4s" }} />
            <path d="M32 16 C32 16 26 12 14 14 V48 C26 46 32 50 32 50 C32 50 38 46 50 48 V14 C38 12 32 16 32 16 Z" stroke={isHovered ? "#ffaa00" : "#1a3a5c"} strokeWidth="2" fill={isHovered ? "rgba(255,170,0,0.1)" : "none"} style={{ transition: "all 0.4s" }} />
            <path d="M18 24 H26 M18 32 H26 M38 24 H46 M38 32 H46" stroke={isHovered ? "#ffaa00" : "#1a3a5c"} strokeWidth="1.5" style={{ transition: "stroke 0.4s", opacity: isHovered ? 1 : 0.3 }} />
        </svg>
    ),
    travel: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="32" cy="32" r="18" stroke={isHovered ? "#00aaff" : "#1a3a5c"} strokeWidth="2" style={{ transition: "stroke 0.4s" }} />
            <ellipse cx="32" cy="32" rx="8" ry="18" stroke={isHovered ? "#00aaff" : "#1a3a5c"} strokeWidth="1.5" style={{ transition: "stroke 0.4s", opacity: isHovered ? 1 : 0.4 }} />
            <path d="M14 32 H50" stroke={isHovered ? "#00aaff" : "#1a3a5c"} strokeWidth="1.5" style={{ transition: "stroke 0.4s", opacity: isHovered ? 1 : 0.4 }} />
            <path d="M46 22 L42 18 L36 24 L22 22 L20 26 L30 32 L22 38 L16 36 L14 40 L24 42 L42 34 Z" fill={isHovered ? "#00aaff" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
        </svg>
    ),
    photography: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 24 H22 L26 18 H38 L42 24 H50 V46 H14 Z" stroke={isHovered ? "#ffffaa" : "#1a3a5c"} strokeWidth="2" fill={isHovered ? "rgba(255,255,170,0.1)" : "none"} style={{ transition: "all 0.4s" }} />
            <circle cx="32" cy="34" r="8" stroke={isHovered ? "#ffffaa" : "#1a3a5c"} strokeWidth="2" style={{ transition: "stroke 0.4s" }} />
            <circle cx="32" cy="34" r="3" fill={isHovered ? "#ffffaa" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <circle cx="44" cy="28" r="1.5" fill={isHovered ? "#ffffaa" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
        </svg>
    ),
    cooking: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 46 V26 M18 16 V26 M22 16 V26 M26 16 V26 M18 26 C18 30 26 30 26 26" stroke={isHovered ? "#ff7700" : "#1a3a5c"} strokeWidth="2" style={{ transition: "stroke 0.4s" }} />
            <path d="M42 46 V16 M42 16 C38 16 38 28 42 30" stroke={isHovered ? "#ff7700" : "#1a3a5c"} strokeWidth="2" fill={isHovered ? "#ff7700" : "none"} style={{ transition: "all 0.4s" }} />
        </svg>
    ),
    art: (isHovered: boolean) => (
        <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 32 C12 24 24 12 36 16 C48 20 56 36 48 48 C40 60 20 60 16 48 C14 42 28 40 20 32 Z" stroke={isHovered ? "#00ffcc" : "#1a3a5c"} strokeWidth="2" fill={isHovered ? "rgba(0,255,204,0.1)" : "none"} style={{ transition: "all 0.4s" }} />
            <circle cx="28" cy="24" r="3" fill={isHovered ? "#ff3366" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <circle cx="40" cy="28" r="3" fill={isHovered ? "#ffd700" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <circle cx="42" cy="40" r="3" fill={isHovered ? "#00ffcc" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <circle cx="30" cy="46" r="3" fill={isHovered ? "#b300ff" : "#1a3a5c"} style={{ transition: "fill 0.4s" }} />
            <circle cx="22" cy="38" r="4" stroke={isHovered ? "#00ffcc" : "#1a3a5c"} strokeWidth="2" fill="#050508" style={{ transition: "stroke 0.4s" }} />
        </svg>
    )
};

export default function HobbiesSection({ hobbies }: { hobbies: Hobby[] }) {
    const [hovered, setHovered] = useState<string | null>(null);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
        });
    }, []);

    return (
        <div className="w-full flex flex-col items-center px-4">
            {/* Heading */}
            <div className="text-center mb-12">
                <p className="text-[#00e5ff]/60 text-xs tracking-[0.5em] uppercase mb-2">— Beyond the Screen —</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    My <span className="text-[#b300ff]">Hobbies</span>
                </h2>
            </div>

            {/* Hobby Cards Row */}
            <div className="flex flex-wrap justify-center gap-5 w-full max-w-3xl">
                {hobbies.map((hobby, index) => {
                    const isH = hovered === hobby.id;
                    const isEven = index % 2 === 0;

                    return (
                        <motion.div
                            key={hobby.id}
                            initial={{ y: isEven ? -100 : 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: false, amount: 0.4 }}
                            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: index * 0.05 }}
                            className="relative flex flex-col items-center cursor-pointer select-none"
                            style={{ width: "130px" }}
                            onMouseEnter={() => !isTouch && setHovered(hobby.id)}
                            onMouseLeave={() => !isTouch && setHovered(null)}
                            onClick={() => {
                                if (isTouch) {
                                    setHovered(hovered === hobby.id ? null : hobby.id);
                                }
                            }}
                        >
                            {/* Icon Container */}
                            <div
                                className="flex items-center justify-center rounded-2xl transition-all duration-400"
                                style={{
                                    width: "96px",
                                    height: "96px",
                                    background: isH
                                        ? `radial-gradient(circle at center, ${hobby.glow} 0%, rgba(2,12,24,0.95) 80%)`
                                        : "rgba(10,25,47,0.6)",
                                    border: `1.5px solid ${isH ? hobby.color : "rgba(255,255,255,0.06)"}`,
                                    boxShadow: isH
                                        ? `0 0 30px ${hobby.glow}, 0 0 60px ${hobby.glow.replace("0.3", "0.1")}, inset 0 1px 0 rgba(255,255,255,0.1)`
                                        : "none",
                                    transform: isH ? "translateY(-8px) scale(1.05)" : "translateY(0) scale(1)",
                                    transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                }}
                            >
                                {ICONS[hobby.iconName] ? ICONS[hobby.iconName](isH) : ICONS["coding"](isH)}
                            </div>

                            {/* Name (always visible) */}
                            <p
                                className="mt-3 text-xs font-bold font-mono tracking-widest uppercase text-center transition-all duration-300"
                                style={{ color: isH ? hobby.color : "#4a6080" }}
                            >
                                {hobby.name}
                            </p>

                            {/* Hover Description Tooltip */}
                            <div
                                className="absolute left-1/2 z-50 w-56 rounded-xl p-3 text-xs text-zinc-300 font-mono leading-relaxed pointer-events-none"
                                style={{
                                    top: "calc(100% + 12px)",
                                    transform: isH ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-6px)",
                                    background: "rgba(2,12,24,0.97)",
                                    border: `1px solid ${hobby.color}40`,
                                    boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 16px ${hobby.glow}`,
                                    opacity: isH ? 1 : 0,
                                    transition: "opacity 0.25s ease, transform 0.25s ease",
                                    transitionDelay: isH ? "0.05s" : "0s",
                                }}
                            >
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: hobby.color, boxShadow: `0 0 6px ${hobby.color}` }} />
                                    <span className="font-bold uppercase text-[10px] tracking-wider" style={{ color: hobby.color }}>{hobby.name}</span>
                                </div>
                                {hobby.description}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
