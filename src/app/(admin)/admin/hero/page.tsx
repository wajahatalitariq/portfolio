import { prisma } from "@/lib/prisma";
import { updateHero } from "@/app/actions/admin";

export default async function HeroManagerPage() {
    const hero = await prisma.hero.findFirst();

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Manage <span className="text-[#00e5ff]">Identity</span></h1>
                <p className="text-zinc-500 font-mono text-sm mb-6">Modify the main introduction on the viewport.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border border-[#00e5ff]/20 bg-[#0a192f] p-6 rounded-xl self-start">
                    <h2 className="text-lg font-bold text-white mb-4 uppercase">Update Hero State</h2>
                    <form action={updateHero} className="flex flex-col gap-4">

                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Full Name</label>
                            <input name="name" type="text" defaultValue={hero?.name || "Abdullah Bin Zubair"} required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none" />
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Sub-Title / Role</label>
                            <input name="title" type="text" defaultValue={hero?.title || "Full Stack Developer"} required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none" />
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-mono uppercase mb-1 block">Introduction Paragraph</label>
                            <textarea name="intro" defaultValue={hero?.intro || "I build high-performance, dynamic digital experiences bridging the gap between elegant design and complex backend engineering."} required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#00e5ff]/50 outline-none h-32 resize-none leading-relaxed" />
                        </div>

                        <button type="submit" className="w-full py-3 mt-4 rounded border border-[#00e5ff]/30 bg-[#00e5ff]/10 text-[#00e5ff] font-bold text-sm tracking-widest uppercase hover:bg-[#00e5ff]/20 transition-colors cursor-pointer">
                            Deploy Identity
                        </button>
                    </form>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white uppercase">Active Output</h2>
                    <div className="p-8 border border-white/5 bg-[#0a192f] rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">

                        {/* Fake 3D Ambient Drop */}
                        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: "radial-gradient(circle at center, #00e5ff 0%, transparent 70%)" }} />

                        <div className="relative z-10 w-full">
                            <h3 className="text-3xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                                {hero?.name || "Abdullah Bin Zubair"}
                            </h3>
                            <p className="text-lg font-bold tracking-[0.3em] uppercase text-[#00e5ff] mt-2 drop-shadow-[0_0_10px_rgba(0,229,255,1)]">
                                {hero?.title || "Full Stack Developer"}
                            </p>
                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-sm text-zinc-400 font-mono leading-relaxed">
                                    {hero?.intro || "I build high-performance, dynamic digital experiences bridging the gap between elegant design and complex backend engineering."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
