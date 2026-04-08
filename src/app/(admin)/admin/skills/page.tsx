import { prisma } from "@/lib/prisma";
import { createSkill, deleteSkill } from "@/app/actions/admin";

/**
 * SkillsManagerPage Component
 * 
 * A comprehensive interface for adding, viewing, and deleting technical skills.
 * Changes made here are reflected in real-time on the 3D physics engine and the network graph.
 */
export default async function SkillsManagerPage() {
    // Fetch all current skills from the database to display in the list.
    const skills = await prisma.skill.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Manage <span className="text-[#00e5ff]">Skills</span></h1>
                <p className="text-zinc-500 font-mono text-sm mb-6">These automatically generate the 3D physics spheres and the network graph.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ADD SKILL FORM */}
                <div className="lg:col-span-1 border border-[#00e5ff]/20 bg-[#0a192f] p-6 rounded-xl self-start sticky top-6">
                    <h2 className="text-lg font-bold text-white mb-4 uppercase">Add New Node</h2>
                    <form action={createSkill} className="flex flex-col gap-4">
                        <input name="name" placeholder="Skill Name (e.g. React)" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none" />

                        <select name="category" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none">
                            <option value="Language">Language</option>
                            <option value="Framework">Framework</option>
                            <option value="Database">Database</option>
                            <option value="Cloud">Cloud</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Styling">Styling</option>
                            <option value="Animation">Animation</option>
                        </select>

                        <input name="level" type="number" min="0" max="100" placeholder="Proficiency (0-100)" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none" />

                        <textarea name="description" placeholder="Short Description..." required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none h-24 resize-none" />

                        <input name="projects" placeholder="Projects (comma separated)" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none" />

                        <button type="submit" className="w-full py-3 mt-2 rounded border border-[#00e5ff]/30 bg-[#00e5ff]/10 text-[#00e5ff] font-bold text-sm tracking-widest uppercase hover:bg-[#00e5ff]/20 transition-colors">
                            Deploy Node
                        </button>
                    </form>
                </div>

                {/* SKILLS LIST */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white uppercase">Active Nodes ({skills.length})</h2>
                    {skills.map(skill => (
                        <div key={skill.id} className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 border border-white/5 bg-[#0a192f] rounded-xl hover:border-white/10 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                                    <span className="text-xs font-mono text-[#00e5ff] border border-[#00e5ff]/30 px-2 py-0.5 rounded-full">{skill.category}</span>
                                </div>
                                <p className="text-sm text-zinc-400 mb-2">{skill.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs font-mono text-zinc-500">Projects:</span>
                                    {skill.projects.split(',').map(p => p.trim()).filter(Boolean).map(p => (
                                        <span key={p} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-300">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="text-xl font-black text-white">
                                    {skill.level}<span className="text-xs text-zinc-500">%</span>
                                </div>
                                <form action={async () => {
                                    "use server";
                                    await deleteSkill(skill.id);
                                }}>
                                    <button type="submit" className="px-3 py-1.5 rounded border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/10 transition-colors cursor-pointer">
                                        DELETE
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}

                    {skills.length === 0 && (
                        <div className="p-8 text-center border border-white/5 border-dashed rounded-xl">
                            <p className="text-zinc-500 font-mono">No skills deployed yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
