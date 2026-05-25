"use client";

import { useState } from "react";

/**
 * HolographicCard Component
 * 
 * A 3D-styled card used in the Projects grid.
 * Features a text-to-speech accessibility feature that 'reads' 
 * the project description when clicked.
 */
export default function HolographicCard({ title, description }: { title: string, description: string }) {
    const [isOpen, setIsOpen] = useState(false);

    // handleClick toggles the card and triggers the browser's SpeechSynthesis API.
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newState = !isOpen;
        setIsOpen(newState);
        if (newState) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(`${title}. ${description}`);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        } else {
            window.speechSynthesis.cancel();
        }
    };

    return (
        <div
            className={`font-mono text-white px-5 py-5 w-[90vw] max-w-[360px] rounded-xl border cursor-pointer transition-all duration-300 pointer-events-auto
                ${isOpen
                    ? "bg-[#030d1a]/95 border-[#00e5ff] shadow-[0_0_40px_rgba(0,229,255,0.5)] min-h-[200px]"
                    : "bg-[#030d1a]/85 border-[#1a3a5c] hover:border-[#00e5ff]/60 h-[180px]"
                }`}

            onMouseEnter={() => { document.body.style.cursor = "pointer"; }}
            onMouseLeave={() => { document.body.style.cursor = "auto"; }}
            onClick={handleClick}
        >
            <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${isOpen ? "bg-[#00e5ff] animate-pulse" : "bg-[#1a3a5c]"}`} />
                <h4 className={`text-base font-bold tracking-wide ${isOpen ? "text-[#00e5ff]" : "text-white"}`}>
                    {title}
                </h4>
                {isOpen && <span className="ml-auto text-[10px] text-[#b300ff] border border-[#b300ff]/50 px-2 py-0.5 rounded-full animate-pulse">◉ SPEAKING</span>}
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
                {description}
            </p>
            {isOpen && (
                <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-center text-zinc-600 hover:text-zinc-400">
                    CLICK TO CLOSE & STOP VOICE
                </div>
            )}
        </div>
    );
}

