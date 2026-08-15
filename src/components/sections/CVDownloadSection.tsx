"use client";

import { useState, useCallback } from "react";
import type { Resume } from "@prisma/client";

/**
 * CVDownloadSection Component
 * 
 * Provides an interactive UI for downloading the user's résumé in multiple formats.
 * Uses a proxy API route (/api/download) to ensure reliable file downloads.
 */
export default function CVDownloadSection({ resume }: { resume: Resume | null }) {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState<string | null>(null);

    /**
     * handleDownload
     * Triggers a file download through a proxy. This is often necessary to avoid
     * CORS issues or to rename files dynamically on download.
     */
    const handleDownload = useCallback((url: string, filename: string, btnId: string) => {
        setDownloading(btnId);
        const proxyUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
        const a = document.createElement("a");
        a.href = proxyUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => setDownloading(null), 2000);
    }, []);
    const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

    const handleCopyLink = () => {
        if (resume?.linkUrl) {
            navigator.clipboard.writeText(resume.linkUrl).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            });
        }
    };

    const buttons = [];

    if (resume?.pdfUrl) {
        buttons.push({
            id: "pdf",
            label: "Download PDF",
            sub: ".pdf · Latest Version",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            ),
            color: "#00e5ff",
            glow: "rgba(0,229,255,0.3)",
            href: resume.pdfUrl,
            download: "Abdullah_Bin_Zubair_Resume.pdf",
        });
    }

    if (resume?.wordUrl) {
        buttons.push({
            id: "word",
            label: "Download Word",
            sub: ".docx · Editable Format",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            ),
            color: "#b300ff",
            glow: "rgba(179,0,255,0.3)",
            href: resume.wordUrl,
            download: "Abdullah_Bin_Zubair_Resume.docx",
        });
    }

    if (resume?.linkUrl) {
        buttons.push({
            id: "link",
            label: copied ? "Link Copied!" : "Copy CV Link",
            sub: "Share · Direct URL",
            icon: copied ? (
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
            ),
            color: copied ? "#00ff88" : "#ffd700",
            glow: copied ? "rgba(0,255,136,0.3)" : "rgba(255,215,0,0.3)",
            href: null, // Signals copy action
            download: false,
        });
    }

    if (buttons.length === 0) {
        buttons.push({
            id: "empty",
            label: "Résumé Unavailable",
            sub: "Check back later",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            color: "#64748b",
            glow: "transparent",
            href: null,
            download: false,
        });
    }

    return (
        <section className="w-full flex flex-col items-center px-6">
            {/* Heading */}
            <div className="text-center mb-12">
                <p className="text-[#00e5ff]/60 text-xs tracking-[0.5em] uppercase mb-2">— Grab a Copy —</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    My <span className="text-[#00e5ff]">Résumé</span>
                </h2>
            </div>

            {/* Glassmorphic Modal */}
            <div
                className="relative w-full max-w-xl rounded-3xl overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, rgba(2,12,24,0.92) 0%, rgba(10,25,47,0.88) 100%)",
                    border: "1px solid rgba(0,229,255,0.25)",
                    boxShadow: "0 0 60px rgba(0,229,255,0.08), 0 0 120px rgba(179,0,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)",
                    backdropFilter: "blur(24px)",
                }}
            >
                {/* Animated corner accent lines */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#00e5ff]/60 rounded-tl-3xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#b300ff]/60 rounded-tr-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#b300ff]/60 rounded-bl-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#00e5ff]/60 rounded-br-3xl pointer-events-none" />

                {/* Ambient glow blob */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #00e5ff, transparent)" }} />
                    <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #b300ff, transparent)" }} />
                </div>

                <div className="relative z-10 p-8 md:p-10 flex flex-col gap-4">
                    {/* Header row */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#00e5ff]/80 shadow-[0_0_8px_#00e5ff]" />
                            <div className="w-3 h-3 rounded-full bg-[#b300ff]/80 shadow-[0_0_8px_#b300ff]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffd700]/80 shadow-[0_0_8px_#ffd700]" />
                        </div>
                        <span className="text-xs font-mono text-zinc-500 tracking-widest">resume.terminal</span>
                    </div>

                    <p className="text-xs font-mono text-zinc-500 leading-relaxed border-b border-white/5 pb-4">
                        <span className="text-[#00e5ff]">Abdullah Bin Zubair Hashmi</span> · Full Stack Developer<br />
                        <span className="text-[#b300ff]">CGPA</span> 3.85 · Bahria University, Islamabad
                    </p>

                    {/* Download Buttons */}
                    {buttons.map((btn) => {
                        const isHovered = hoveredBtn === btn.id;
                        const content = (
                            <div
                                key={btn.id}
                                className="relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group"
                                style={{
                                    background: isHovered
                                        ? `linear-gradient(120deg, ${btn.glow} 0%, rgba(2,12,24,0.6) 100%)`
                                        : "rgba(255,255,255,0.02)",
                                    border: `1px solid ${isHovered ? btn.color : "rgba(255,255,255,0.07)"}`,
                                    boxShadow: isHovered ? `0 0 24px ${btn.glow}, inset 0 1px 0 rgba(255,255,255,0.08)` : "none",
                                    transform: isHovered ? "translateX(4px)" : "translateX(0)",
                                }}
                                onMouseEnter={() => setHoveredBtn(btn.id)}
                                onMouseLeave={() => setHoveredBtn(null)}
                                role="button"
                                tabIndex={0}
                                aria-label={btn.label}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { btn.href ? undefined : handleCopyLink(); } }}
                                onClick={btn.href ? undefined : handleCopyLink}
                            >
                                {/* Icon */}
                                <div
                                    className="flex-shrink-0 p-2 rounded-xl transition-all duration-300"
                                    style={{
                                        color: btn.color,
                                        background: isHovered ? `${btn.glow}` : "rgba(255,255,255,0.04)",
                                        boxShadow: isHovered ? `0 0 16px ${btn.glow}` : "none",
                                    }}
                                >
                                    {btn.icon}
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <div
                                        className="font-bold text-sm tracking-wide transition-colors duration-300"
                                        style={{ color: isHovered ? btn.color : "#e2e8f0" }}
                                    >
                                        {btn.label}
                                    </div>
                                    <div className="text-xs text-zinc-600 font-mono mt-0.5">{btn.sub}</div>
                                </div>

                                {/* Arrow */}
                                <svg
                                    viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor"
                                    className="w-4 h-4 flex-shrink-0 transition-all duration-300"
                                    style={{
                                        color: isHovered ? btn.color : "#334155",
                                        transform: isHovered ? "translateX(2px)" : "none",
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>

                                {/* Scan line on hover */}
                                {isHovered && (
                                    <div
                                        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                                    >
                                        <div
                                            className="absolute top-0 left-0 right-0 h-px opacity-40"
                                            style={{ background: `linear-gradient(90deg, transparent, ${btn.color}, transparent)` }}
                                        />
                                    </div>
                                )}
                            </div>
                        );

                        return btn.href ? (
                            <div
                                key={btn.id}
                                style={{ textDecoration: "none", cursor: downloading === btn.id ? "wait" : "pointer" }}
                                onClick={() => handleDownload(btn.href!, btn.download as string, btn.id)}
                            >
                                {content}
                            </div>
                        ) : (
                            <div key={btn.id} role="none">{content}</div>
                        );
                    })}

                    {/* Footer */}
                    <p className="text-[10px] text-zinc-700 font-mono text-center pt-2 border-t border-white/5">
                        Last updated · March 2026
                    </p>
                </div>
            </div>
        </section>
    );
}
