import { prisma } from "@/lib/prisma";
import Link from "next/link";

/**
 * AdminHomePage (Command Center)
 * 
 * The main dashboard entry point for the Admin area.
 * It provides a high-level overview of portfolio statistics and quick navigation links.
 */
export default async function AdminHomePage() {
    // Fetch counts for all major entities in parallel to populate the dashboard cards.
    const [skillCount, projectCount, experimentCount, hobbyCount] = await Promise.all([
        prisma.skill.count(),
        prisma.project.count(),
        prisma.experience.count(),
        prisma.hobby.count(),
    ]);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Command Center</h1>
                <p className="text-zinc-500 font-mono text-sm">Overview of your 3D portfolio data modules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Skills" count={skillCount} color="#00e5ff" link="/admin/skills" icon="..." />
                <StatCard title="Projects" count={projectCount} color="#b300ff" link="/admin/projects" icon="..." />
                <StatCard title="Experiences" count={experimentCount} color="#00ff88" link="/admin/experiences" icon="..." />
                <StatCard title="Hobbies" count={hobbyCount} color="#ffd700" link="/admin/hobbies" icon="..." />
            </div>
        </div>
    );
}

function StatCard({ title, count, color, link, icon }: { title: string; count: number; color: string; link: string; icon: string }) {
    return (
        <div className="flex flex-col rounded-xl border border-white/5 bg-[#0a192f] p-6 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-widest">{title}</h3>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5" style={{ color }}>{icon}</div>
            </div>
            <div className="text-4xl font-black text-white mb-6">
                {count}
            </div>
            <Link href={link} className="text-xs font-bold tracking-widest uppercase hover:underline" style={{ color }}>
                Manage →
            </Link>
        </div>
    );
}
