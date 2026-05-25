"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AudioPlayer Component
 * 
 * Provides ambient background music with a smooth fade-in effect.
 * Uses a 'signal active' HUD aesthetic to match the portfolio theme.
 */
export default function AudioPlayer() {
    // We use a Ref to directly interact with the <audio> element.
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Initial fade in
        if (isPlaying && audioRef.current) {
            audioRef.current.volume = 0;
            const fadeIn = setInterval(() => {
                if (audioRef.current && audioRef.current.volume < 0.4) {
                    audioRef.current.volume += 0.02;
                } else {
                    clearInterval(fadeIn);
                }
            }, 200);
            return () => clearInterval(fadeIn);
        }
    }, [isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => {
                console.warn("Audio play blocked by browser. User interaction required.", err);
            });
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9998] flex items-center gap-4">
            <audio
                ref={audioRef}
                src="/bg-music.mp3"
                loop
                preload="auto"
            />

            {/* Status Label (Optional, shown on hover/interaction) */}
            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-black/60 backdrop-blur-md border border-[#00e5ff]/20 px-3 py-1 rounded-full text-[10px] font-mono text-[#00e5ff] tracking-widest uppercase hidden md:block shadow-[0_0_15px_rgba(0,229,255,0.1)]"
                    >
                        SIGNAL ACTIVE
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 cursor-pointer
                    ${isPlaying 
                        ? "bg-[#00e5ff]/10 border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.4)]" 
                        : "bg-black/40 border-white/10 hover:border-[#00e5ff]/50"
                    }
                `}
            >
                {/* Pulsing Ring when playing */}
                {isPlaying && (
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border border-[#00e5ff]"
                    />
                )}

                {/* Speaker Icon */}
                <div className="relative z-10">
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={isPlaying ? "#00e5ff" : "#ffffff44"} 
                        strokeWidth={2} 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-5 h-5 transition-colors duration-500"
                    >
                        {isPlaying ? (
                            <>
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            </>
                        ) : (
                            <>
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <line x1="23" y1="9" x2="17" y2="15" />
                                <line x1="17" y1="9" x2="23" y2="15" />
                            </>
                        )}
                    </svg>
                </div>

                {/* Vertical Signal Bars */}
                {isPlaying && (
                    <div className="absolute -top-1 -right-1 flex gap-0.5 items-end h-3">
                        {[1, 2, 3].map(i => (
                            <motion.div
                                key={i}
                                animate={{ height: [4, 12, 4] }}
                                transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                                className="w-0.5 bg-[#00e5ff] rounded-full"
                            />
                        ))}
                    </div>
                )}
            </motion.button>
        </div>
    );
}
