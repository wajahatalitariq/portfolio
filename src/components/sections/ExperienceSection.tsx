"use client";

import { useState } from "react";

import type { Experience } from "@prisma/client";

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [shownCount, setShownCount] = useState(0);

    const handleReveal = () => {
        if (isOpen) {
            setIsOpen(false);
            setShownCount(0);
            return;
        }
        setIsOpen(true);
        // Stagger reveal each card one by one
        experiences.forEach((_, i) => {
            setTimeout(() => setShownCount(i + 1), i * 400);
        });
    };

    return (
        <section className="w-full flex flex-col items-center px-6" style={{ fontFamily: "'Courier New', monospace" }}>

            {/* Section label */}
            <div className="text-center mb-10">
                <p className="text-[#00e5ff]/60 text-xs tracking-[0.5em] uppercase mb-2">— Work History —</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Exp<span className="text-[#00e5ff]">erien</span>ce
                </h2>
            </div>

            {/* Reveal Button */}
            <button
                onClick={handleReveal}
                className={`group relative px-10 py-4 mb-16 text-sm tracking-[0.3em] uppercase font-bold overflow-hidden rounded border transition-all duration-500 cursor-pointer
                    ${isOpen
                        ? "border-[#b300ff] text-[#b300ff] bg-[#b300ff]/10 hover:bg-[#b300ff]/20"
                        : "border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20"
                    }`}
            >
                {/* Sweep animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">
                    {isOpen ? "▲  CLOSE CURTAIN" : "▼  OPEN CURTAIN"}
                </span>
            </button>

            {/* 
                The 'Curtain' Effect
                This container uses 'max-height' to create a smooth sliding reveal.
                We calculate a large enough height based on the number of cards 
                to ensure nothing gets clipped on mobile device screens.
            */}
            <div
                className="w-full max-w-4xl overflow-hidden transition-all duration-700 ease-in-out"
                style={{ maxHeight: isOpen ? `${experiences.length * 800}px` : "0px" }}
            >
                <div className="flex flex-col gap-6 pb-10">
                    {experiences.map((exp, i) => (
                        <article
                            key={i}
                            className={`relative border rounded-2xl p-8 bg-[#020c18]/90 backdrop-blur-md transition-all duration-500
                                ${shownCount > i
                                    ? "opacity-100 translate-y-0 border-[#00e5ff]/40 shadow-[0_0_30px_rgba(0,229,255,0.1)]"
                                    : "opacity-0 translate-y-8 border-transparent"
                                }`}
                            style={{ transitionDelay: `${i * 80}ms` }}
                        >
                            {/* Timeline dot */}
                            <div className="absolute -left-3 top-10 w-6 h-6 rounded-full bg-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.8)] border-2 border-[#050508] flex items-center justify-center">
                                {/* This div represents the timeline dot for each experience entry. */}
                                <div className="w-2 h-2 rounded-full bg-white" />
                            </div>

                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                                <div>
                                    <h3 className="text-xl font-black tracking-wide text-white uppercase">
                                        {exp.role}
                                    </h3>
                                    <p className="text-[#00e5ff] font-bold text-sm mt-0.5 tracking-widest uppercase">
                                        @ {exp.company}
                                    </p>
                                    <p className="text-zinc-500 text-xs mt-1 italic">{exp.team}</p>
                                </div>
                                <span className="text-xs font-mono text-[#b300ff] border border-[#b300ff]/40 px-3 py-1 rounded-full whitespace-nowrap self-start md:self-center">
                                    {exp.duration}
                                </span>
                            </div>

                            {/* Bullet points */}
                            <ul className="space-y-2 mb-5">
                                {exp.points.split('\n').filter(Boolean).map((pt, j) => (
                                    <li key={j} className="flex items-start gap-3 text-zinc-400 text-sm leading-relaxed">
                                        <span className="text-[#00e5ff] mt-1 text-xs flex-shrink-0">▸</span>
                                        {pt}
                                    </li>
                                ))}
                            </ul>

                            {/* Stack pills */}
                            <div className="flex flex-wrap gap-2">
                                {exp.stack.split(',').map(s => s.trim()).filter(Boolean).map((tech) => (
                                    <span key={tech} className="text-[10px] font-mono text-[#00e5ff]/80 bg-[#00e5ff]/10 border border-[#00e5ff]/20 px-2 py-0.5 rounded">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
