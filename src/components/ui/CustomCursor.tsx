"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

/**
 * CustomCursor Component
 * 
 * Replaces the system cursor with a multi-layered interactive pointer.
 * Uses Framer Motion's 'useSpring' for a smooth "lagging" follow effect.
 */
export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // useMotionValue stores coordinates efficiently without triggering React re-renders.
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // springConfig defines the "bouncy" feel of the outer ring.
    const springConfig = { damping: 25, stiffness: 200 };
    const ringX = useSpring(mouseX, springConfig);
    const ringY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable = 
                target.tagName === "BUTTON" || 
                target.tagName === "A" || 
                target.onclick !== null ||
                target.getAttribute("role") === "button" ||
                target.classList.contains("cursor-pointer");
            
            setIsHovering(isClickable);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* Inner Dot */}
            <motion.div
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full shadow-[0_0_10px_#00e5ff]"
            />

            {/* Outer Ring */}
            <motion.div
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isHovering ? 60 : 36,
                    height: isHovering ? 60 : 36,
                    borderColor: isHovering ? "#b300ff" : "#00e5ff66",
                    borderWidth: isHovering ? 2 : 1,
                }}
                className="absolute rounded-full border border-[#00e5ff66] shadow-[0_0_15px_rgba(0,229,255,0.1)] flex items-center justify-center transition-colors duration-300"
            >
                {isHovering && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.2, scale: 1 }}
                        className="w-full h-full bg-[#b300ff] rounded-full"
                    />
                )}
            </motion.div>
        </div>
    );
}
