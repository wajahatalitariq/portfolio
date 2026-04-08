import { prisma } from "@/lib/prisma";
import { createCertification, deleteCertification } from "@/app/actions/admin";

export default async function CertificationsAdminPage() {
    const [certifications, skills] = await Promise.all([
        prisma.certification.findMany({ orderBy: { issuedAt: "desc" } }),
        prisma.skill.findMany({ orderBy: { name: "asc" } }),
    ]);

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
                    Manage <span className="text-[#ffd700]">Certifications</span>
                </h1>
                <p className="text-zinc-500 font-mono text-sm mb-6">
                    Add certifications that appear as constellation nodes on the timeline.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="border border-[#ffd700]/20 bg-[#0a192f] p-6 rounded-xl self-start">
                    <h2 className="text-lg font-bold text-white mb-4 uppercase">Add New Certification</h2>
                    <form action={createCertification} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Title *</label>
                            <input name="title" required placeholder="e.g. AWS Solutions Architect" className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Issuer *</label>
                            <input name="issuer" required placeholder="e.g. Amazon (Coursera)" className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Issue Date *</label>
                            <input name="issuedAt" type="date" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Credential URL</label>
                            <input name="credentialUrl" type="url" placeholder="https://..." className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Node Color</label>
                            <div className="flex gap-2 items-center">
                                <input name="color" type="color" defaultValue="#00e5ff" className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
                                <span className="text-zinc-500 text-xs font-mono">Pick the star node color</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">
                                Skills (comma-separated) *
                            </label>
                            <input name="skills" required placeholder="React, JavaScript, Node.js" className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none" />
                            <p className="text-zinc-600 text-[10px] font-mono mt-1">
                                Your skills: {skills.map(s => s.name).join(", ")}
                            </p>
                        </div>
                        <button type="submit" className="w-full py-3 mt-2 rounded border border-[#ffd700]/30 bg-[#ffd700]/10 text-[#ffd700] font-bold text-sm tracking-widest uppercase hover:bg-[#ffd700]/20 transition-colors cursor-pointer">
                            Add Certification
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white uppercase">Current Certifications</h2>
                    {certifications.length === 0 ? (
                        <p className="text-zinc-600 text-sm font-mono italic">No certifications yet.</p>
                    ) : (
                        certifications.map((cert) => (
                            <div key={cert.id} className="border border-white/5 bg-[#0a192f] p-4 rounded-xl flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ background: cert.color, boxShadow: `0 0 8px ${cert.color}` }} />
                                    <div>
                                        <h3 className="text-white font-bold text-sm leading-tight">{cert.title}</h3>
                                        <p className="text-zinc-500 text-xs font-mono mt-0.5">{cert.issuer}</p>
                                        <p className="text-zinc-600 text-[10px] font-mono mt-1">
                                            {new Date(cert.issuedAt).toLocaleDateString("default", { month: "short", year: "numeric" })}
                                        </p>
                                        <p className="text-zinc-600 text-[10px] font-mono mt-1">Skills: {cert.skills}</p>
                                    </div>
                                </div>
                                <form action={deleteCertification.bind(null, cert.id)}>
                                    <button type="submit" className="text-red-500/60 hover:text-red-400 transition-colors text-xs font-mono uppercase tracking-widest cursor-pointer">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
