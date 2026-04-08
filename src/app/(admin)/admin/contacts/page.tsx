import { prisma } from "@/lib/prisma";
import { createContactLink, deleteContactLink } from "@/app/actions/admin";

const ICON_OPTIONS = ["email", "linkedin", "github", "discord", "youtube", "whatsapp", "instagram", "twitter", "portfolio", "default"];

export default async function ContactsAdminPage() {
    const links = await prisma.contactLink.findMany({ orderBy: { order: "asc" } });

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
                    Manage <span className="text-[#00e5ff]">Contact Links</span>
                </h1>
                <p className="text-zinc-500 font-mono text-sm mb-6">
                    These appear as neural nodes on the contact section signal board.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="border border-[#00e5ff]/20 bg-[#0a192f] p-6 rounded-xl self-start">
                    <h2 className="text-lg font-bold text-white mb-4 uppercase">Add New Link</h2>
                    <form action={createContactLink} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Label *</label>
                            <input name="label" required placeholder="e.g. LinkedIn" className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">URL *</label>
                            <input name="url" required placeholder="https:// or mailto:" className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Icon</label>
                            <select name="icon" className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none">
                                {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Node Color</label>
                            <div className="flex gap-2 items-center">
                                <input name="color" type="color" defaultValue="#00e5ff" className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
                                <span className="text-zinc-500 text-xs font-mono">Star node color</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Order</label>
                            <input name="order" type="number" defaultValue={links.length} className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none" />
                        </div>
                        <button type="submit" className="w-full py-3 mt-2 rounded border border-[#00e5ff]/30 bg-[#00e5ff]/10 text-[#00e5ff] font-bold text-sm tracking-widest uppercase hover:bg-[#00e5ff]/20 transition-colors cursor-pointer">
                            Add Link
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white uppercase">Current Links</h2>
                    {links.length === 0 ? (
                        <p className="text-zinc-600 text-sm font-mono italic">No links yet.</p>
                    ) : (
                        links.map((link) => (
                            <div key={link.id} className="border border-white/5 bg-[#0a192f] p-4 rounded-xl flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: link.color, boxShadow: `0 0 8px ${link.color}` }} />
                                    <div>
                                        <p className="text-white font-bold text-sm">{link.label}</p>
                                        <p className="text-zinc-600 text-xs font-mono break-all">{link.url}</p>
                                        <p className="text-zinc-700 text-[10px] font-mono">icon: {link.icon} · order: {link.order}</p>
                                    </div>
                                </div>
                                <form action={deleteContactLink.bind(null, link.id)}>
                                    <button type="submit" className="text-red-500/60 hover:text-red-400 transition-colors text-xs font-mono uppercase tracking-widest cursor-pointer flex-shrink-0">
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
