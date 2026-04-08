import { prisma } from "@/lib/prisma";
import { createExperience, deleteExperience } from "@/app/actions/admin";

export default async function ExperiencesManagerPage() {
    const experiences = await prisma.experience.findMany({
        orderBy: { order: 'asc' }
    });

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Manage <span className="text-[#00ff88]">Experiences</span></h1>
                <p className="text-zinc-500 font-mono text-sm mb-6">These generate the animated curtain timeline.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 border border-[#00ff88]/20 bg-[#0a192f] p-6 rounded-xl self-start sticky top-6">
                    <h2 className="text-lg font-bold text-white mb-4 uppercase">Add Experience</h2>
                    <form action={createExperience} className="flex flex-col gap-4">
                        <input name="role" placeholder="Role (e.g. Frontend Developer)" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00ff88]/50 outline-none" />
                        <input name="company" placeholder="Company" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00ff88]/50 outline-none" />
                        <input name="team" placeholder="Team/Context (Optional)" className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00ff88]/50 outline-none" />
                        <input name="duration" placeholder="Duration (e.g. 12 Weeks · 2024)" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00ff88]/50 outline-none" />
                        <textarea name="stack" placeholder="Tech Stack (comma separated)" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00ff88]/50 outline-none h-16 resize-none" />
                        <textarea name="points" placeholder="Bullet points (newline separated)" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00ff88]/50 outline-none h-24 resize-none" />
                        <input name="order" type="number" defaultValue="0" placeholder="Display Order (0 is Top)" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00ff88]/50 outline-none" />

                        <button type="submit" className="w-full py-3 mt-2 rounded border border-[#00ff88]/30 bg-[#00ff88]/10 text-[#00ff88] font-bold text-sm tracking-widest uppercase hover:bg-[#00ff88]/20 transition-colors cursor-pointer">
                            Deploy Record
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white uppercase">Active Timeline ({experiences.length})</h2>
                    {experiences.map((exp) => (
                        <div key={exp.id} className="flex flex-col gap-3 p-5 border border-white/5 bg-[#0a192f] rounded-xl hover:border-white/10 transition-colors">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-white">{exp.role}</h3>
                                    <div className="text-[#00ff88] text-sm font-bold uppercase tracking-widest">@ {exp.company}</div>
                                </div>
                                <form action={async () => {
                                    "use server";
                                    await deleteExperience(exp.id);
                                }}>
                                    <button type="submit" className="px-3 py-1.5 rounded border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/10 transition-colors cursor-pointer">
                                        DELETE
                                    </button>
                                </form>
                            </div>
                            <p className="text-xs text-zinc-500 font-mono py-1 border-y border-white/5">{exp.duration} | Order: {exp.order}</p>
                        </div>
                    ))}
                    {experiences.length === 0 && (
                        <div className="p-8 text-center border border-white/5 border-dashed rounded-xl">
                            <p className="text-zinc-500 font-mono">No experiences deployed yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
