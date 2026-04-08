"use client";

import { useState, useRef, useEffect } from "react";

type Skill = {
    id: string;
    name: string;
    x: number;
    y: number;
    category: string;
    level: number; // 0-100
    description: string;
    projects: string[];
};

type Edge = { from: string; to: string };

const SKILLS: Skill[] = [
    // Core Languages
    { id: "js", name: "JavaScript", x: 400, y: 200, category: "Language", level: 90, description: "Primary scripting language for web development.", projects: ["YOTA Website", "Hotel Management"] },
    { id: "ts", name: "TypeScript", x: 560, y: 140, category: "Language", level: 85, description: "Statically typed superset of JavaScript.", projects: ["Trust Nexus HRMS", "Portfolio"] },
    { id: "py", name: "Python", x: 240, y: 140, category: "Language", level: 80, description: "Used for AI/ML pipelines and backend APIs.", projects: ["MedZone", "Hotel Management"] },
    { id: "cpp", name: "C++", x: 100, y: 240, category: "Language", level: 75, description: "Systems programming and desktop applications.", projects: ["Desktop Apps", "Timetable System"] },
    { id: "csharp", name: "C#", x: 120, y: 380, category: "Language", level: 70, description: "ASP.NET MVC and desktop application development.", projects: ["Student Records"] },
    // Frameworks
    { id: "react", name: "React.js", x: 400, y: 340, category: "Framework", level: 88, description: "Component-driven UI library for modern SPAs.", projects: ["Trust Nexus HRMS", "Hotel Management"] },
    { id: "next", name: "Next.js", x: 540, y: 280, category: "Framework", level: 85, description: "Full-stack React framework with SSR & App Router.", projects: ["Trust Nexus HRMS", "Portfolio"] },
    { id: "django", name: "Django", x: 240, y: 320, category: "Framework", level: 72, description: "High-level Python web framework for rapid dev.", projects: ["Hotel Management"] },
    { id: "flutter", name: "Flutter", x: 140, y: 480, category: "Framework", level: 68, description: "Cross-platform mobile/desktop UI toolkit.", projects: ["MedZone"] },
    { id: "aspnet", name: "ASP.NET", x: 280, y: 460, category: "Framework", level: 65, description: "Microsoft web framework for .NET ecosystem.", projects: ["Student Records"] },
    // Styling & Tools
    { id: "tailwind", name: "Tailwind", x: 560, y: 400, category: "Styling", level: 90, description: "Utility-first CSS framework for rapid UI.", projects: ["Trust Nexus HRMS", "Portfolio", "Hotel Management"] },
    { id: "gsap", name: "GSAP", x: 660, y: 260, category: "Animation", level: 78, description: "Industry-standard animation library for the web.", projects: ["YOTA Website", "Portfolio"] },
    { id: "threejs", name: "Three.js", x: 660, y: 360, category: "Animation", level: 74, description: "3D rendering library built on WebGL.", projects: ["Portfolio"] },
    // Database
    { id: "sqlserver", name: "SQL Server", x: 400, y: 480, category: "Database", level: 76, description: "Microsoft relational database management system.", projects: ["Student Records", "Trust Nexus HRMS"] },
    { id: "postgres", name: "PostgreSQL", x: 520, y: 480, category: "Database", level: 72, description: "Open-source advanced relational database.", projects: ["Hotel Management"] },
    // Cloud & DevOps
    { id: "aws", name: "AWS", x: 700, y: 160, category: "Cloud", level: 60, description: "Amazon Web Services for hosting & cloud infra.", projects: ["YOTA Website"] },
    { id: "docker", name: "Docker", x: 720, y: 460, category: "DevOps", level: 58, description: "Container platform for reproducible environments.", projects: ["Hotel Management"] },
    { id: "git", name: "Git", x: 640, y: 480, category: "DevOps", level: 88, description: "Version control system for collaborative development.", projects: ["All Projects"] },
];

const EDGES: Edge[] = [
    { from: "js", to: "ts" }, { from: "js", to: "react" }, { from: "js", to: "gsap" }, { from: "js", to: "threejs" },
    { from: "ts", to: "react" }, { from: "ts", to: "next" }, { from: "ts", to: "tailwind" },
    { from: "py", to: "django" }, { from: "py", to: "flutter" },
    { from: "cpp", to: "csharp" }, { from: "csharp", to: "aspnet" },
    { from: "react", to: "next" }, { from: "react", to: "tailwind" }, { from: "react", to: "sqlserver" },
    { from: "next", to: "tailwind" }, { from: "next", to: "aws" },
    { from: "django", to: "postgres" }, { from: "aspnet", to: "sqlserver" },
    { from: "flutter", to: "aspnet" }, { from: "gsap", to: "threejs" },
    { from: "sqlserver", to: "postgres" }, { from: "postgres", to: "docker" },
    { from: "docker", to: "git" }, { from: "git", to: "aws" }, { from: "tailwind", to: "git" },
];

const CATEGORY_COLORS: Record<string, string> = {
    Language: "#00e5ff",
    Framework: "#b300ff",
    Styling: "#ff6b35",
    Animation: "#00ff88",
    Database: "#ffd700",
    Cloud: "#ff4466",
    DevOps: "#aaa",
};

function getConnected(nodeId: string) {
    const ids = new Set<string>();
    EDGES.forEach(e => {
        if (e.from === nodeId) ids.add(e.to);
        if (e.to === nodeId) ids.add(e.from);
    });
    return ids;
}

/**
 * SkillNetworkSection Component (Frontend Version)
 * 
 * Visualizes technical skills as an interactive graph (nodes and edges).
 * Allows users to see how different technologies relate to each other.
 */
export default function SkillNetworkSection() {
    const [selected, setSelected] = useState<Skill | null>(null);
    const [connected, setConnected] = useState<Set<string>>(new Set());
    const svgRef = useRef<SVGSVGElement>(null);

    const handleClick = (skill: Skill) => {
        if (selected?.id === skill.id) {
            setSelected(null);
            setConnected(new Set());
        } else {
            setSelected(skill);
            setConnected(getConnected(skill.id));
        }
    };

    const isActive = (id: string) => !selected || selected.id === id || connected.has(id);
    const isEdgeActive = (e: Edge) => !selected || (e.from === selected.id || e.to === selected.id);

    return (
        <div className="w-full flex flex-col items-center px-4">
            {/* Heading */}
            <div className="text-center mb-10">
                <p className="text-[#00e5ff]/60 text-xs tracking-[0.5em] uppercase mb-2">— Interconnected —</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    Skill <span className="text-[#b300ff]">Network</span>
                </h2>
                <p className="text-zinc-500 text-sm mt-3 font-mono">Click a node to explore connections</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                    <span key={cat} className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                        <span style={{ background: color }} className="w-2.5 h-2.5 rounded-full inline-block" />
                        {cat}
                    </span>
                ))}
            </div>

            <div className="relative w-full max-w-[820px]">
                {/* SVG Graph */}
                <svg
                    ref={svgRef}
                    viewBox="60 100 720 430"
                    className="w-full"
                    style={{ height: "clamp(340px, 55vw, 520px)" }}
                >
                    {/* Edges */}
                    {EDGES.map((e, i) => {
                        const from = SKILLS.find(s => s.id === e.from)!;
                        const to = SKILLS.find(s => s.id === e.to)!;
                        const active = isEdgeActive(e);
                        return (
                            <line
                                key={i}
                                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                                stroke={active ? "#00e5ff" : "#1a3a5c"}
                                strokeWidth={active ? 1.5 : 0.6}
                                strokeOpacity={active ? 0.6 : 0.2}
                                style={{ transition: "all 0.3s" }}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {SKILLS.map(skill => {
                        const color = CATEGORY_COLORS[skill.category];
                        const active = isActive(skill.id);
                        const isSelected = selected?.id === skill.id;
                        const r = isSelected ? 16 : 10;
                        return (
                            <g key={skill.id} onClick={() => handleClick(skill)} style={{ cursor: "pointer" }}>
                                {/* Glow ring on selected */}
                                {isSelected && (
                                    <circle cx={skill.x} cy={skill.y} r={24} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={0.4}>
                                        <animate attributeName="r" values="22;28;22" dur="1.5s" repeatCount="indefinite" />
                                        <animate attributeName="stroke-opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
                                    </circle>
                                )}
                                <circle
                                    cx={skill.x} cy={skill.y} r={r}
                                    fill={color}
                                    fillOpacity={active ? (isSelected ? 0.9 : 0.7) : 0.15}
                                    stroke={color}
                                    strokeWidth={active ? 1.5 : 0.5}
                                    strokeOpacity={active ? 1 : 0.2}
                                    style={{ transition: "all 0.3s" }}
                                />
                                <text
                                    x={skill.x} y={skill.y + r + 12}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fontFamily="monospace"
                                    fill={active ? "#ffffff" : "#334"}
                                    fillOpacity={active ? 1 : 0.3}
                                    style={{ transition: "all 0.3s", pointerEvents: "none", userSelect: "none" }}
                                >
                                    {skill.name}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Info Panel */}
                {selected && (
                    <div
                        className="mt-6 w-full rounded-2xl border border-[#00e5ff]/40 bg-[#020c18]/95 backdrop-blur-md p-6 shadow-[0_0_40px_rgba(0,229,255,0.12)] transition-all duration-300"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span style={{ background: CATEGORY_COLORS[selected.category] }} className="w-3 h-3 rounded-full" />
                                    <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">{selected.category}</span>
                                </div>
                                <h3 className="text-2xl font-black uppercase text-white tracking-tight">{selected.name}</h3>
                            </div>
                            {/* Proficiency Bar */}
                            <div className="flex flex-col items-end gap-1 min-w-[140px]">
                                <span className="text-xs font-mono text-zinc-500">PROFICIENCY</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-28 h-2 bg-[#0a192f] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${selected.level}%`,
                                                background: `linear-gradient(90deg, #00e5ff, ${CATEGORY_COLORS[selected.category]})`,
                                                boxShadow: `0 0 8px ${CATEGORY_COLORS[selected.category]}`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-white">{selected.level}%</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">{selected.description}</p>

                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-mono text-zinc-500 mr-1">USED IN:</span>
                            {selected.projects.map(p => (
                                <span key={p} className="text-xs font-mono text-[#b300ff] bg-[#b300ff]/10 border border-[#b300ff]/30 px-2 py-0.5 rounded">
                                    {p}
                                </span>
                            ))}
                        </div>

                        {connected.size > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <span className="text-xs font-mono text-zinc-500 mb-2 block">CONNECTED TO:</span>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(connected).map(id => {
                                        const s = SKILLS.find(sk => sk.id === id)!;
                                        return (
                                            <button
                                                key={id}
                                                onClick={() => handleClick(s)}
                                                className="text-xs font-mono text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/30 px-2 py-0.5 rounded hover:bg-[#00e5ff]/20 transition-colors cursor-pointer"
                                            >
                                                {s.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
