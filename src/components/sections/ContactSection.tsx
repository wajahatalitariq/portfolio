"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitMessage } from "@/app/actions/admin";

interface ContactLink {
    id: string;
    label: string;
    url: string;
    icon: string;
    color: string;
    order: number;
}

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICONS: Record<string, (color: string) => React.ReactNode> = {
    email: (c) => (
        <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    ),
    linkedin: (c) => (
        <svg viewBox="0 0 24 24" fill={c} className="w-6 h-6">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    ),
    github: (c) => (
        <svg viewBox="0 0 24 24" fill={c} className="w-6 h-6">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
    ),
    whatsapp: (c) => (
        <svg viewBox="0 0 24 24" fill={c} className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M11.956 0C5.33 0 0 5.33 0 11.956c0 2.09.544 4.043 1.49 5.741L.058 23.37a.5.5 0 0 0 .613.612l5.782-1.461A11.889 11.889 0 0 0 11.956 24C18.58 24 24 18.67 24 12.044 24 5.33 18.67 0 11.956 0zm0 21.818a9.753 9.753 0 0 1-4.967-1.356l-.356-.21-3.694.933.979-3.587-.232-.369a9.734 9.734 0 0 1-1.548-5.273c0-5.39 4.39-9.78 9.818-9.78 5.39 0 9.78 4.39 9.78 9.78 0 5.39-4.39 9.862-9.78 9.862z" />
        </svg>
    ),
    instagram: (c) => (
        <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    ),
    twitter: (c) => (
        <svg viewBox="0 0 24 24" fill={c} className="w-6 h-6">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    discord: (c) => (
        <svg viewBox="0 0 24 24" fill={c} className="w-6 h-6">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.862-1.297 1.197-1.99a.076.076 0 0 0-.041-.105 13.11 13.11 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.191 1.99a.075.075 0 0 0 .085.029 19.839 19.839 0 0 0 6.002-3.03.083.083 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
        </svg>
    ),
    youtube: (c) => (
        <svg viewBox="0 0 24 24" fill={c} className="w-6 h-6">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
    ),
    portfolio: (c) => (
        <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    default: (c) => (
        <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    ),
};

// ── Ripple component ──────────────────────────────────────────────────────────
function Ripple({ color }: { color: string }) {
    return (
        <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)` }}
        />
    );
}

// ── Node positions: evenly spaced in a horizontal arc ────────────────────────
function getNodePositions(count: number, containerW: number, containerH: number) {
    if (count === 0) return [];
    const padding = 80;
    const usableW = containerW - padding * 2;
    return Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const x = padding + t * usableW;
        // Gentle sine arc: middle nodes float up slightly
        const arc = Math.sin(Math.PI * t) * 30;
        const y = containerH / 2 - arc;
        return { x, y };
    });
}

// ── Main component ────────────────────────────────────────────────────────────
/**
 * ContactSection Component
 * 
 * A highly interactive "Neural Terminal" contact form.
 * Features a node-based network visualization that leads to the message form.
 */
export default function ContactSection({ links }: { links: ContactLink[] }) {
    const sorted = [...links].sort((a, b) => a.order - b.order);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ w: 700, h: 180 });
    const [activeId, setActiveId] = useState<string | null>(null);
    const [rippleId, setRippleId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [sent, setSent] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [drawProgress, setDrawProgress] = useState(0);
    const animFrameRef = useRef<number | null>(null);

    // Track drawing animation for form line
    useEffect(() => {
        if (formOpen) {
            let start: number | null = null;
            const animate = (ts: number) => {
                if (!start) start = ts;
                const p = Math.min((ts - start) / 600, 1);
                setDrawProgress(p);
                if (p < 1) animFrameRef.current = requestAnimationFrame(animate);
            };
            animFrameRef.current = requestAnimationFrame(animate);
        } else {
            requestAnimationFrame(() => setDrawProgress(0));
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        }
        return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
    }, [formOpen]);

    useEffect(() => {
        const measure = () => {
            if (containerRef.current) {
                setDims({ w: containerRef.current.offsetWidth, h: 180 });
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const positions = getNodePositions(sorted.length, dims.w, dims.h);

    const handleNodeClick = (link: ContactLink) => {
        setRippleId(link.id);
        setActiveId((prev) => (prev === link.id ? null : link.id));
        setTimeout(() => setRippleId(null), 800);

        if (link.url.startsWith("mailto:")) {
            navigator.clipboard.writeText(link.url.replace("mailto:", "")).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
            });
        } else {
            window.open(link.url, "_blank", "noreferrer");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const res = await submitMessage(formData);

        if (res.success) {
            setSent(true);
            setTimeout(() => {
                setSent(false);
                setFormOpen(false);
                setFormData({ name: "", email: "", message: "" });
            }, 3000);
        } else {
            alert(res.error || "Failed to transmit signal");
        }
    };



    return (
        <motion.section 
            id="contact"
            animate={{ 
                backgroundColor: formOpen ? "rgba(2,12,24,0.4)" : "rgba(2,12,24,0)",
                padding: formOpen ? "60px 20px" : "40px 20px"
            }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl flex flex-col items-center rounded-[4rem] border border-transparent hover:border-white/5 transition-colors duration-700"
        >
            {/* Heading */}
            <div className="text-center mb-14">
                <p className="text-[#00e5ff]/60 text-xs tracking-[0.5em] uppercase mb-2">— Open a Channel —</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Contact <span className="text-[#00e5ff]">Me</span>
                </h2>
            </div>

            {/* Node Network SVG Canvas */}
            <div ref={containerRef} className="relative w-full max-w-3xl" style={{ height: `${dims.h}px` }}>
                {/* SVG pulse lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${dims.w} ${dims.h}`}>
                    <defs>
                        {sorted.map((link) => (
                            <radialGradient key={`rg-${link.id}`} id={`rg-${link.id}`} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor={link.color} stopOpacity="0.8" />
                                <stop offset="100%" stopColor={link.color} stopOpacity="0" />
                            </radialGradient>
                        ))}
                    </defs>

                    {/* Connection lines between adjacent nodes */}
                    {positions.map((pos, i) => {
                        if (i === positions.length - 1) return null;
                        const next = positions[i + 1];
                        const linkA = sorted[i];
                        const linkB = sorted[i + 1];
                        const isActive = activeId === linkA.id || activeId === linkB.id;
                        return (
                            <g key={`line-${i}`}>
                                <line
                                    x1={pos.x} y1={pos.y}
                                    x2={next.x} y2={next.y}
                                    stroke={isActive ? linkA.color : "rgba(255,255,255,0.06)"}
                                    strokeWidth={isActive ? 1.5 : 1}
                                    strokeDasharray={isActive ? "none" : "4 6"}
                                    style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
                                />
                                {/* Animated pulse dot along line */}
                                <motion.circle
                                    r={2}
                                    fill={linkA.color}
                                    opacity={0.7}
                                    animate={{
                                        cx: [pos.x || 0, next.x || 0],
                                        cy: [pos.y || 0, next.y || 0],
                                    }}

                                    transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                                />
                            </g>
                        );
                    })}

                    {/* Form draw line from last node */}
                    {formOpen && positions.length > 0 && (
                        <line
                            x1={positions[positions.length - 1]?.x ?? dims.w / 2}
                            y1={positions[positions.length - 1]?.y ?? dims.h / 2}
                            x2={(positions[positions.length - 1]?.x ?? dims.w / 2) * (1 - drawProgress) + (dims.w / 2) * drawProgress}
                            y2={dims.h * drawProgress + (positions[positions.length - 1]?.y ?? dims.h / 2) * (1 - drawProgress)}
                            stroke="#00e5ff"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            opacity={0.5}
                        />
                    )}
                </svg>

                {/* Node buttons */}
                {sorted.map((link, i) => {
                    const pos = positions[i];
                    if (!pos) return null;
                    const isActive = activeId === link.id;
                    const hasRipple = rippleId === link.id;
                    const icon = ICONS[link.icon] ?? ICONS.default;

                    return (
                        <motion.button
                            key={link.id}
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: i * 0.12, type: "spring", bounce: 0.5 }}
                            onClick={() => handleNodeClick(link)}
                            aria-label={`Open ${link.label} link`}
                            className="absolute flex flex-col items-center gap-2 group focus:outline-none"
                            style={{
                                left: `${pos.x}px`,
                                top: `${pos.y}px`,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <div className="relative">
                                {hasRipple && <Ripple color={link.color} />}
                                {/* Outer glow ring */}
                                <div
                                    className="absolute inset-0 rounded-full transition-all duration-400"
                                    style={{
                                        boxShadow: isActive
                                            ? `0 0 30px 8px ${link.color}55`
                                            : `0 0 10px 2px ${link.color}22`,
                                    }}
                                />
                                {/* Node circle */}
                                <div
                                    className="relative flex items-center justify-center rounded-full transition-all duration-300"
                                    style={{
                                        width: isActive ? "68px" : "56px",
                                        height: isActive ? "68px" : "56px",
                                        background: isActive
                                            ? `radial-gradient(circle, ${link.color}44 0%, rgba(2,12,24,0.95) 80%)`
                                            : "rgba(10,25,47,0.7)",
                                        border: `1.5px solid ${isActive ? link.color : link.color + "44"}`,
                                    }}
                                >
                                    {icon(isActive ? link.color : link.color + "99")}
                                </div>
                            </div>
                            <span
                                className="font-mono text-[10px] tracking-widest uppercase transition-colors duration-300"
                                style={{ color: isActive ? link.color : "#4a6080" }}
                            >
                                {link.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Active link hint */}
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="mt-4 px-4 py-2 rounded-lg font-mono text-xs text-[#00ff88] border border-[#00ff88]/30 bg-[#00ff88]/10"
                    >
                        ✓ Email address copied to clipboard
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Send Message Button */}
            <motion.button
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.6 }}
                onClick={() => setFormOpen((v) => !v)}
                aria-label={formOpen ? "Close contact form" : "Open contact form"}
                className="mt-12 flex items-center gap-2 px-6 py-3 rounded-xl font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105"
                style={{
                    background: formOpen ? "rgba(0,229,255,0.15)" : "rgba(0,229,255,0.08)",
                    border: "1px solid rgba(0,229,255,0.4)",
                    color: "#00e5ff",
                    boxShadow: formOpen ? "0 0 30px rgba(0,229,255,0.2)" : "0 0 10px rgba(0,229,255,0.1)",
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
                </svg>
                {formOpen ? "Close Form" : "Send a Message"}
            </motion.button>

            {/* Message Form */}
            <AnimatePresence>
                {formOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: 20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="mt-6 w-full max-w-lg overflow-hidden"
                    >
                        <div
                            className="rounded-3xl overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, rgba(2,12,24,0.96) 0%, rgba(10,25,47,0.92) 100%)",
                                border: "1px solid rgba(0,229,255,0.2)",
                                boxShadow: "0 0 60px rgba(0,229,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
                                backdropFilter: "blur(24px)",
                            }}
                        >
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-3xl border-cyan-500/40 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-3xl border-cyan-500/20 pointer-events-none" />

                            <div className="relative p-8">
                                <AnimatePresence mode="wait">
                                    {sent ? (
                                        <motion.div
                                            key="sent"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-6 flex flex-col items-center gap-3"
                                        >
                                            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.4)" }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                                    <path d="M20 6 9 17l-5-5" />
                                                </svg>
                                            </div>
                                            <p className="text-[#00ff88] font-mono font-bold tracking-widest uppercase text-sm">Signal Transmitted!</p>
                                            <p className="text-zinc-500 font-mono text-xs">I&apos;ll get back to you soon.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onSubmit={handleSubmit}
                                            className="flex flex-col gap-4"
                                        >
                                            <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase border-b border-white/5 pb-3">
                                                <span className="text-[#00e5ff]">new_connection</span> ·  Initialize
                                            </p>
                                            <div className="flex gap-3">
                                                <input
                                                    required
                                                    name="name"
                                                    placeholder="Your name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                                                    className="flex-1 bg-[#020c18] border border-white/8 rounded-xl p-3 text-sm text-white placeholder-zinc-700 focus:border-[#00e5ff]/40 outline-none transition-colors font-mono"
                                                />
                                                <input
                                                    required
                                                    name="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                                                    className="flex-1 bg-[#020c18] border border-white/8 rounded-xl p-3 text-sm text-white placeholder-zinc-700 focus:border-[#00e5ff]/40 outline-none transition-colors font-mono"
                                                />
                                            </div>
                                            <textarea
                                                required
                                                name="message"
                                                rows={4}
                                                placeholder="Your message..."
                                                value={formData.message}
                                                onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                                                className="bg-[#020c18] border border-white/8 rounded-xl p-3 text-sm text-white placeholder-zinc-700 focus:border-[#00e5ff]/40 outline-none transition-colors font-mono resize-none"
                            />
                                            <button
                                                type="submit"
                                                className="w-full py-3 rounded-xl font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-[1.02]"
                                                style={{
                                                    background: "linear-gradient(120deg, rgba(0,229,255,0.2), rgba(179,0,255,0.15))",
                                                    border: "1px solid rgba(0,229,255,0.35)",
                                                    color: "#00e5ff",
                                                    boxShadow: "0 0 20px rgba(0,229,255,0.15)",
                                                }}
                                            >
                                                Transmit Signal →
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-16 text-[10px] font-mono text-zinc-700 tracking-widest uppercase"
            >
                © {new Date().getFullYear()} Abdullah Bin Zubair · Built with Next.js & Three.js
            </motion.p>
        </motion.section>
    );
}
