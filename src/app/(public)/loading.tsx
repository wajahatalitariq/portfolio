"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Loading Component
 * 
 * An instant-loading cybernetic HUD preloader page designed to display 
 * immediately during the Next.js server-side database fetching phase.
 * Features neon glowing grids, a rotating radar scanner, and dynamic console logs.
 */
const LOGS = [
    "SYS_INIT: CONNECTING TO NEURAL HUB...",
    "DB_QUERY: ESTABLISHING SECURE POSTGRES BRIDGE...",
    "SYS_SYNC: SECURING DATA ENVELOPE...",
    "CANVAS_WARP: ALIGNING PHYSICS PLAYGROUND...",
    "ENV_LIGHT: INITIALIZING VOLUMETRIC PHOTONS...",
    "HUD_INIT: BOOTING INTERACTIVE LAYERS...",
    "COMPLETE: INTERNET SHIELD ACTIVE."
];

export default function Loading() {
    const [progress, setProgress] = useState(0);
    const [logIndex, setLogIndex] = useState(0);

    useEffect(() => {
        // Fast mock progress bar increment
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 15) + 5;
            });
        }, 150);

        // Slowly cycle through cybernetic console logs
        const logInterval = setInterval(() => {
            setLogIndex((prev) => (prev < LOGS.length - 1 ? prev + 1 : prev));
        }, 220);

        return () => {
            clearInterval(interval);
            clearInterval(logInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 w-screen h-screen bg-[#050508] z-[9999] flex flex-col items-center justify-center overflow-hidden font-mono text-zinc-400 select-none">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00e5ff]/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#b300ff]/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000" />

            {/* Futuristic Tech Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Central Animated HUD Scanner */}
            <div className="relative flex items-center justify-center w-48 h-48 mb-8">
                {/* Outermost Rotating Cyan Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-[#00e5ff]/20 rounded-full"
                />

                {/* Counter-Rotating Purple Segment Ring */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-4 border border-dotted border-[#b300ff]/40 rounded-full"
                />

                {/* Inner Glowing Scanning Sweep */}
                <motion.div
                    animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute inset-10 bg-radial from-[#00e5ff]/10 via-transparent to-transparent rounded-full flex items-center justify-center"
                >
                    <div className="w-6 h-6 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_15px_#00e5ff]" />
                </motion.div>

                {/* Dynamic Percentage Counter */}
                <span className="absolute text-[#00e5ff] text-xl font-bold tracking-widest drop-shadow-[0_0_8px_#00e5ff] mt-24">
                    {Math.min(progress, 100)}%
                </span>
            </div>

            {/* Futuristic Progress Bar */}
            <div className="w-64 md:w-80 h-[4px] bg-zinc-900 border border-[#00e5ff]/10 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                <motion.div
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ ease: "easeOut", duration: 0.1 }}
                    className="h-full bg-gradient-to-r from-[#00e5ff] to-[#b300ff] shadow-[0_0_8px_#00e5ff]"
                />
            </div>

            {/* Scrolling Cybernetic Console Logs */}
            <div className="mt-8 h-20 flex flex-col items-center justify-start text-center px-4 max-w-lg">
                <div className="text-[10px] text-[#00e5ff] font-bold tracking-widest opacity-40 uppercase mb-2">
                    [ LINKING CORE SYSTEMS ]
                </div>
                
                {/* Active log item */}
                <motion.div
                    key={logIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-zinc-300 font-mono tracking-wide leading-relaxed truncate max-w-full"
                >
                    <span className="text-[#b300ff] mr-1">&gt;</span> {LOGS[logIndex]}
                </motion.div>

                {/* Previous log sneak peak */}
                {logIndex > 0 && (
                    <div className="text-[10px] text-zinc-600 font-mono mt-1 opacity-50 truncate max-w-full">
                        {LOGS[logIndex - 1]}
                    </div>
                )}
            </div>

            {/* HUD Bracket Styling Corners */}
            <div className="absolute top-8 left-8 text-xs font-bold text-[#00e5ff]/20 tracking-wider font-mono">
                SYS_VER_16.2 // SECURE_PORT
            </div>
            <div className="absolute top-8 right-8 text-xs font-bold text-[#00e5ff]/20 tracking-wider font-mono">
                HUD_ONLINE
            </div>
            <div className="absolute bottom-8 left-8 text-xs font-bold text-[#00e5ff]/20 tracking-wider font-mono">
                LATENCY_STABLE
            </div>
            <div className="absolute bottom-8 right-8 text-xs font-bold text-[#00e5ff]/20 tracking-wider font-mono">
                SECURE_CON_256
            </div>
        </div>
    );
}
