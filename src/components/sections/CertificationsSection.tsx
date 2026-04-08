"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Certification {
    id: string;
    title: string;
    issuer: string;
    issuedAt: Date | string;
    credentialUrl?: string | null;
    color: string;
    skills: string;
}

interface Skill {
    id: string;
    name: string;
    [key: string]: unknown;
}

interface Props {
    certifications: Certification[];
    skills: Skill[];
}

/**
 * StarNode Component
 * 
 * Represents a single certification as a glowing "Star" on the timeline.
 */
function StarNode({
    cert,
    isSelected,
    onClick,
    index,
}: {
    cert: Certification;
    isSelected: boolean;
    onClick: () => void;
    index: number;
}) {
    const [hovered, setHovered] = useState(false);
    const active = isSelected || hovered;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: index * 0.18, type: "spring", bounce: 0.5 }}
            className="relative flex flex-col items-center cursor-pointer select-none"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Outer glow ring */}
            <div
                className="absolute rounded-full transition-all duration-500 pointer-events-none"
                style={{
                    width: active ? "72px" : "48px",
                    height: active ? "72px" : "48px",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: `radial-gradient(circle, ${cert.color}55 0%, transparent 70%)`,
                    boxShadow: active ? `0 0 40px 8px ${cert.color}66` : "none",
                }}
            />

            {/* Star core */}
            <div
                style={{
                    width: active ? "32px" : "22px",
                    height: active ? "32px" : "22px",
                    borderRadius: "50%",
                    background: active
                        ? `radial-gradient(circle, #fff 10%, ${cert.color} 60%, transparent 100%)`
                        : `radial-gradient(circle, ${cert.color} 40%, ${cert.color}44 100%)`,
                    boxShadow: active
                        ? `0 0 20px 6px ${cert.color}, 0 0 6px #fff`
                        : `0 0 8px 2px ${cert.color}88`,
                    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                }}
            />

            {/* Twinkle rays on active */}
            {active && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: 45 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute pointer-events-none"
                    style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                >
                    {[0, 45, 90, 135].map((angle) => (
                        <div
                            key={angle}
                            style={{
                                position: "absolute",
                                width: "2px",
                                height: "18px",
                                background: `linear-gradient(to top, ${cert.color}, transparent)`,
                                top: "50%",
                                left: "50%",
                                transformOrigin: "50% 100%",
                                transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                            }}
                        />
                    ))}
                </motion.div>
            )}

            {/* Label below */}
            <div
                className="mt-4 text-center font-mono text-[10px] tracking-widest uppercase transition-all duration-300"
                style={{
                    color: active ? cert.color : "#4a6080",
                    maxWidth: "110px",
                    lineHeight: "1.4",
                }}
            >
                {cert.issuer.split(" ")[0]}
            </div>
        </motion.div>
    );
}

export default function CertificationsSection({
    certifications,
    skills,
}: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const sortedCerts = [...certifications].sort(
        (a, b) => new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime()
    );
    const selectedCert = sortedCerts.find((c) => c.id === selected) ?? null;

    // Map skill names from comma-separated string to Skill objects
    const getSkillsForCert = (cert: Certification): string[] => {
        const names = cert.skills.split(",").map((s: string) => s.trim().toLowerCase());
        return names.map((n: string) => {
            const match = skills.find((s: Skill) => s.name.toLowerCase() === n);
            return match ? match.name : n;
        });
    };

    const handleToggle = (id: string) => {
        setSelected((prev) => (prev === id ? null : id));
    };

    return (
        <div className="w-full flex flex-col items-center px-4 md:px-8">
            {/* Heading */}
            <div className="text-center mb-16">
                <p className="text-[#ffd700]/60 text-xs tracking-[0.5em] uppercase mb-2">
                    — Proof of Mastery —
                </p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    My{" "}
                    <span className="text-[#ffd700]">Certifications</span>
                </h2>
            </div>

            {/* Timeline + Nodes */}
            <div className="relative w-full max-w-4xl">
                {/* Timeline wire */}
                <div className="absolute left-0 right-0 top-[30px] h-px pointer-events-none overflow-hidden">
                    {/* Base wire */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.15) 15%, rgba(255,215,0,0.3) 50%, rgba(179,0,255,0.15) 85%, transparent 100%)",
                        }}
                    />
                    {/* Animated energy pulse */}
                    <motion.div
                        className="absolute top-0 bottom-0 w-20"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                        }}
                        animate={{ left: ["-80px", "calc(100% + 80px)"] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    />
                </div>

                {/* Year labels + Nodes row */}
                <div className="relative flex justify-around items-start pt-0">
                    {sortedCerts.map((cert, index) => {
                        const year = new Date(cert.issuedAt).getFullYear();
                        const month = new Date(cert.issuedAt).toLocaleString("default", { month: "short" });

                        return (
                            <div key={cert.id} className="flex flex-col items-center gap-1">
                                {/* Year chip above */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.18 + 0.2 }}
                                    className="font-mono text-[10px] tracking-widest uppercase mb-1"
                                    style={{ color: cert.color + "cc" }}
                                >
                                    {month} {year}
                                </motion.div>

                                <StarNode
                                    cert={cert}
                                    index={index}
                                    isSelected={selected === cert.id}
                                    onClick={() => handleToggle(cert.id)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail Card */}
            <AnimatePresence mode="wait">
                {selectedCert && (
                    <motion.div
                        key={selectedCert.id}
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="relative mt-14 w-full max-w-2xl rounded-3xl overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, rgba(2,12,24,0.96) 0%, rgba(10,25,47,0.92) 100%)",
                            border: `1px solid ${selectedCert.color}44`,
                            boxShadow: `0 0 60px ${selectedCert.color}22, 0 0 120px ${selectedCert.color}0a, inset 0 1px 0 rgba(255,255,255,0.06)`,
                            backdropFilter: "blur(24px)",
                        }}
                    >
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 rounded-tl-3xl pointer-events-none" style={{ borderColor: selectedCert.color + "99" }} />
                        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 rounded-tr-3xl pointer-events-none" style={{ borderColor: selectedCert.color + "99" }} />
                        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 rounded-bl-3xl pointer-events-none" style={{ borderColor: selectedCert.color + "55" }} />
                        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 rounded-br-3xl pointer-events-none" style={{ borderColor: selectedCert.color + "55" }} />

                        {/* Ambient glow */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full opacity-10"
                                style={{ background: `radial-gradient(circle, ${selectedCert.color}, transparent)` }} />
                        </div>

                        <div className="relative z-10 p-8 flex flex-col gap-5">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: selectedCert.color + "aa" }}>
                                        {selectedCert.issuer}
                                    </p>
                                    <h3 className="text-lg font-black tracking-tight text-white leading-tight">
                                        {selectedCert.title}
                                    </h3>
                                    <p className="text-xs font-mono text-zinc-500 mt-1">
                                        Issued{" "}
                                        {new Date(selectedCert.issuedAt).toLocaleString("default", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div
                                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: `${selectedCert.color}22`,
                                        border: `1px solid ${selectedCert.color}44`,
                                        boxShadow: `0 0 16px ${selectedCert.color}44`,
                                    }}
                                >
                                    {/* Star icon */}
                                    <svg viewBox="0 0 24 24" fill={selectedCert.color} className="w-5 h-5">
                                        <path d="M12 2l2.9 6.26L22 9.27l-5 5.14L18.18 22 12 18.56 5.82 22 7 14.41l-5-5.14 7.1-1.01L12 2z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px" style={{ background: `linear-gradient(90deg, ${selectedCert.color}55, transparent)` }} />

                            {/* Skills */}
                            <div>
                                <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-600 mb-3">
                                    Skills Covered
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {getSkillsForCert(selectedCert).map((skillName) => (
                                        <span
                                            key={skillName}
                                            className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider"
                                            style={{
                                                background: `${selectedCert.color}18`,
                                                border: `1px solid ${selectedCert.color}44`,
                                                color: selectedCert.color,
                                            }}
                                        >
                                            {skillName}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Verify Button */}
                            {selectedCert.credentialUrl && (
                                <a
                                    href={selectedCert.credentialUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105"
                                    style={{
                                        background: `${selectedCert.color}22`,
                                        border: `1px solid ${selectedCert.color}66`,
                                        color: selectedCert.color,
                                        boxShadow: `0 0 20px ${selectedCert.color}33`,
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verify Credential
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hint text when nothing selected */}
            {!selectedCert && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-10 text-xs font-mono text-zinc-600 tracking-widest uppercase"
                >
                    · Click a node to explore ·
                </motion.p>
            )}
        </div>
    );
}
