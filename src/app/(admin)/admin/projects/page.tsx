import { prisma } from "@/lib/prisma";
import { createProject, deleteProject } from "@/app/actions/admin";

/**
 * ProjectsManagerPage Component
 * 
 * An interface for managing the portfolio's project gallery.
 * Deployed projects are rendered as 3D holographic cards in the main scene.
 */
export default async function ProjectsManagerPage() {
    // Fetch all projects, showing the most recently added ones first.
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Manage <span className="text-[#b300ff]">Projects</span></h1>
                <p className="text-zinc-500 font-mono text-sm mb-6">These generate the 3D holographic cards.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 border border-[#b300ff]/20 bg-[#0a192f] p-6 rounded-xl self-start sticky top-6">
                    <h2 className="text-lg font-bold text-white mb-4 uppercase">Add New Project</h2>
                    <form action={createProject} className="flex flex-col gap-4">
                        <input name="title" placeholder="Project Title" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#b300ff]/50 outline-none" />
                        <textarea name="description" placeholder="Description/Stack..." required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#b300ff]/50 outline-none h-24 resize-none" />
                        <input name="link" placeholder="External Link (Optional)" className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#b300ff]/50 outline-none" />
                        <button type="submit" className="w-full py-3 mt-2 rounded border border-[#b300ff]/30 bg-[#b300ff]/10 text-[#b300ff] font-bold text-sm tracking-widest uppercase hover:bg-[#b300ff]/20 transition-colors cursor-pointer">
                            Deploy Project
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white uppercase">Active Holograms ({projects.length})</h2>
                    {projects.map(project => (
                        <div key={project.id} className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 border border-white/5 bg-[#0a192f] rounded-xl hover:border-white/10 transition-colors">
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-white mb-1">{project.title}</h3>
                                <p className="text-sm text-zinc-400">{project.description}</p>
                            </div>
                            <form action={async () => {
                                "use server";
                                await deleteProject(project.id);
                            }} className="shrink-0">
                                <button type="submit" className="px-3 py-1.5 rounded border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/10 transition-colors cursor-pointer">
                                    DELETE
                                </button>
                            </form>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="p-8 text-center border border-white/5 border-dashed rounded-xl">
                            <p className="text-zinc-500 font-mono">No projects deployed yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
