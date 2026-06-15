"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ScrollToTop Component
 * 
 * Displays a floating button that scrolls the page back to the top.
 * Note: Since we use R3F ScrollControls, the standard window scroll doesn't work.
 * This component automatically finds the 'overflow-y' container to scroll it.
 */
export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const findAndSetup = () => {
            // Find any div with overflow-y auto/scroll that actually has a scrollable height
            const allDivs = document.querySelectorAll("div");
            let container: HTMLElement | null = null;
            
            for (const div of Array.from(allDivs)) {
                const style = window.getComputedStyle(div);
                if ((style.overflowY === "auto" || style.overflowY === "scroll") && div.scrollHeight > div.clientHeight) {
                    container = div;
                    break;
                }
            }

            if (container) {
                containerRef.current = container;
                
                const handleScroll = () => {
                    if (container && container.scrollTop > 500) {
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                };

                container.addEventListener("scroll", handleScroll);
                handleScroll();
                return true; 
            }
            return false;
        };

        if (!findAndSetup()) {
            const interval = setInterval(() => {
                if (findAndSetup()) {
                    clearInterval(interval);
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, []);

    const scrollToTop = () => {
        const container = containerRef.current || document.querySelector(".overflow-y-auto");
        if (container instanceof HTMLElement) {
            container.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };




    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    className="fixed bottom-24 right-6 z-[9999]"
                >
                    <motion.button
                        onClick={scrollToTop}
                        whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(0,229,255,0.6)" }}
                        whileTap={{ scale: 0.9 }}
                        className="relative w-12 h-12 rounded-full bg-black/90 md:bg-black/40 md:backdrop-blur-md border border-[#00e5ff]/40 flex items-center justify-center cursor-pointer transition-colors duration-300 hover:border-[#00e5ff] group shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                        title="Scroll to Top"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-[#00e5ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Icon */}
                        <svg 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#00e5ff" 
                            strokeWidth={2.5} 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="w-5 h-5"
                        >
                            <path d="m18 15-6-6-6 6" />
                        </svg>

                        {/* Pulsing ring */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full border border-[#00e5ff]/30"
                        />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
