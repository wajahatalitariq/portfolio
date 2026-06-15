"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

/**
 * Navigation Links Configuration
 * 'offset' matches the keys in constants.ts
 * 'id' is a decorative hex-style string for the HUD effect.
 */
const NAV_LINKS = [
    { label: "Home", offset: "hero", id: "0x-HME" },
    { label: "Projects", offset: "projects", id: "0x-PRJ" },
    { label: "Skills", offset: "skill", id: "0x-SKL" },
    { label: "Experience", offset: "exp", id: "0x-EXP" },
    { label: "Contact", offset: "contact", id: "0x-CON" },
];

/**
 * Navbar Component
 * 
 * A "Neural Float" hybrid navbar that combines glassmorphism with 
 * interactive cybernetic elements.
 */
export default function Navbar() {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 50], [0.8, 1]);
    const scale = useTransform(scrollY, [0, 50], [1, 0.95]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setIsOpen(false); // Close mobile menu if resized to desktop
        };
        
        handleResize();
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, [scrollY]);

    /**
     * scrollToSection
     * Dispatches a custom event that the 3D Scene listens for.
     * This allows a standard HTML link to control the R3F ScrollControls.
     */
    const scrollToSection = (offsetKey: string) => {
        window.dispatchEvent(new CustomEvent("portfolio-scroll", {
            detail: { offsetKey, isMobile }
        }));
    };

    return (
        <>
            {/* SVG Definitions (Global scope for URL refs) */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <linearGradient id="neural-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
                        <stop offset="50%" stopColor="#00e5ff" stopOpacity="1" />
                        <stop offset="100%" stopColor="#b300ff" stopOpacity="1" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Neural Tether (Option 2 Hybrid) - MOVED OUTSIDE SCALED CONTAINER */}
            <AnimatePresence>
                {hoveredLink && !isMobile && (
                    <motion.svg
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none z-[49]"
                    >
                        <NeuralLine mousePos={mousePos} targetId={hoveredLink} />
                    </motion.svg>
                )}
            </AnimatePresence>

            {/* Desktop Navbar - Hidden on Mobile */}
            <motion.nav
                style={{ opacity, scale }}
                className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-[50] items-center justify-center pointer-events-auto"
            >
                <div className="relative px-6 py-3 rounded-full bg-[#0a192f]/40 border border-[#00e5ff]/20 backdrop-blur-xl shadow-[0_0_30px_rgba(0,229,255,0.1)] flex items-center gap-6 md:gap-8">
                    {NAV_LINKS.map((link) => (
                        <div
                            key={link.label}
                            id={`nav-${link.label}`}
                            className="relative group cursor-pointer"
                            onMouseEnter={() => setHoveredLink(link.label)}
                            onMouseLeave={() => setHoveredLink(null)}
                            onClick={() => scrollToSection(link.offset)}
                        >
                            <span className="text-zinc-400 font-mono text-xs md:text-sm tracking-[0.2em] uppercase group-hover:text-[#00e5ff] transition-colors duration-300">
                                {link.label}
                            </span>
                            
                            {/* Data HUD (Option 2 Hybrid) */}
                            <AnimatePresence>
                                {hoveredLink === link.label && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-[#b300ff] font-bold tracking-tighter opacity-70 whitespace-nowrap font-mono"
                                    >
                                        [{link.id}]
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Hover Glow */}
                            {hoveredLink === link.label && (
                                <motion.div
                                    layoutId="nav-glow"
                                    className="absolute -inset-x-3 -inset-y-1.5 bg-[#00e5ff]/5 rounded-lg blur-sm z-[-1]"
                                />
                            )}
                        </div>
                    ))}

                    <div className="hidden md:block w-1 h-1 bg-[#00e5ff] rounded-full animate-pulse shadow-[0_0_5px_#00e5ff]" />
                </div>
            </motion.nav>

            {/* Mobile Navbar - Flex on Mobile, Hidden on Desktop */}
            <motion.nav
                style={{ opacity }}
                className="flex md:hidden fixed top-4 left-4 right-4 z-[50] flex-col pointer-events-auto"
            >
                {/* Header Pill */}
                <div className="relative w-full px-5 py-3 rounded-full bg-[#0a192f]/95 border border-[#00e5ff]/30 shadow-[0_0_30px_rgba(0,229,255,0.15)] flex items-center justify-between">
                    {/* Brand / Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-pulse shadow-[0_0_5px_#00e5ff]" />
                        <span className="text-zinc-200 font-mono text-xs tracking-[0.25em] font-bold">
                            ABZ // <span className="text-[#00e5ff]">HUD</span>
                        </span>
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative w-8 h-8 flex flex-col items-center justify-center gap-1 focus:outline-none cursor-pointer"
                        aria-label="Toggle Menu"
                    >
                        {/* Custom Animated Hamburger / Close Icon */}
                        <motion.span
                            animate={isOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-5 h-[2px] bg-[#00e5ff] rounded-full shadow-[0_0_4px_rgba(0,229,255,0.5)]"
                        />
                        <motion.span
                            animate={isOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="w-5 h-[2px] bg-[#00e5ff] rounded-full shadow-[0_0_4px_rgba(0,229,255,0.5)]"
                        />
                        <motion.span
                            animate={isOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-5 h-[2px] bg-[#00e5ff] rounded-full shadow-[0_0_4px_rgba(0,229,255,0.5)]"
                        />
                    </button>
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden mt-2 w-full rounded-2xl bg-[#0a192f]/95 border border-[#00e5ff]/30 shadow-[0_10px_30px_rgba(0,229,255,0.1)]"
                        >
                            <div className="p-5 flex flex-col gap-4">
                                {NAV_LINKS.map((link, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: idx * 0.05, duration: 0.2 }}
                                        key={link.label}
                                        onClick={() => {
                                            scrollToSection(link.offset);
                                            setIsOpen(false);
                                        }}
                                        className="relative flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-[#00e5ff]/10 hover:bg-[#00e5ff]/5 group cursor-pointer transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-[#b300ff] font-mono opacity-80 group-hover:text-[#00e5ff] transition-colors">
                                                {link.id}
                                            </span>
                                            <span className="text-zinc-300 font-mono text-xs tracking-[0.15em] uppercase group-hover:text-[#00e5ff] transition-colors">
                                                {link.label}
                                            </span>
                                        </div>
                                        
                                        {/* Glowing dot for active hover */}
                                        <div className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_6px_#00e5ff] scale-0 group-hover:scale-100 duration-300" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
}

/**
 * NeuralLine Component
 * 
 * Draws the animated dotted line connecting the cursor to the link.
 * It tracks both mouse movement and the link's viewport position.
 */
function NeuralLine({ mousePos, targetId }: { mousePos: { x: number, y: number }, targetId: string }) {
    const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        /**
         * updateTarget
         * Calculates the exact center of the hovered link in viewport coordinates.
         */
        const updateTarget = () => {
            const el = document.getElementById(`nav-${targetId}`);
            if (el) {
                const rect = el.getBoundingClientRect();
                setTargetPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }
        };
        
        // Initial update
        updateTarget();
        
        // Listen to scroll to update position since the navbar might scale/move slightly
        window.addEventListener('scroll', updateTarget, { passive: true });
        window.addEventListener('resize', updateTarget);
        
        // Use an interval for extra precision during fast scrolling or layout shifts
        const interval = setInterval(updateTarget, 100);

        return () => {
            window.removeEventListener('scroll', updateTarget);
            window.removeEventListener('resize', updateTarget);
            clearInterval(interval);
        };
    }, [targetId]);

    return (
        <motion.line
            x1={mousePos.x}
            y1={mousePos.y}
            x2={targetPos.x}
            y2={targetPos.y}
            stroke="url(#neural-grad)"
            strokeWidth="2"
            strokeDasharray="6 4"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
        />
    );
}
