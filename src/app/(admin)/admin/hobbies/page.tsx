import { prisma } from "@/lib/prisma";
import { createHobby, deleteHobby } from "@/app/actions/admin";

export default async function HobbiesManagerPage() {
    const hobbies = await prisma.hobby.findMany({
        orderBy: { createdAt: 'asc' }
    });

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">Manage <span className="text-[#ffd700]">Hobbies</span></h1>
                <p className="text-zinc-500 font-mono text-sm mb-6">These generate the interactive 2D SVG components.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 border border-[#ffd700]/20 bg-[#0a192f] p-6 rounded-xl self-start sticky top-6">
                    <h2 className="text-lg font-bold text-white mb-4 uppercase">Add Hobby Node</h2>
                    <form action={createHobby} className="flex flex-col gap-4">
                        <input name="name" placeholder="Hobby Name" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none" />
                        <textarea name="description" placeholder="Description..." required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none h-24 resize-none" />

                        <select name="iconName" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none">
                            <option value="podcast">Podcast Icon</option>
                            <option value="islamic">Islamic Crescent</option>
                            <option value="fitness">Dumbbell/Runner</option>
                            <option value="calligraphy">Pen Nib</option>
                            <option value="coding">Code Brackets</option>
                            <option value="gaming">Gamepad</option>
                            <option value="music">Musical Notes</option>
                            <option value="reading">Open Book</option>
                            <option value="travel">Airplane/Globe</option>
                            <option value="photography">Camera</option>
                            <option value="cooking">Fork/Knife/Cooking</option>
                            <option value="art">Paint Palette</option>
                        </select>

                        <input name="color" placeholder="Hex Color (e.g. #ffd700)" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none" />
                        <input name="glow" placeholder="Glow RGB (e.g. rgba(255,215,0,0.3))" required className="w-full bg-[#020c18] border border-white/10 rounded p-3 text-sm text-white focus:border-[#ffd700]/50 outline-none" />

                        <button type="submit" className="w-full py-3 mt-2 rounded border border-[#ffd700]/30 bg-[#ffd700]/10 text-[#ffd700] font-bold text-sm tracking-widest uppercase hover:bg-[#ffd700]/20 transition-colors cursor-pointer">
                            Deploy Hobby
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-white uppercase">Active Tokens ({hobbies.length})</h2>
                    {hobbies.map((hobby) => (
                        <div key={hobby.id} className="flex items-center justify-between gap-4 p-5 border border-white/5 bg-[#0a192f] rounded-xl hover:border-white/10 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-3 h-3 rounded-full" style={{ background: hobby.color, boxShadow: `0 0 8px ${hobby.glow}` }} />
                                    <h3 className="text-xl font-black text-white" style={{ color: hobby.color }}>{hobby.name}</h3>
                                </div>
                                <p className="text-sm text-zinc-400">{hobby.description}</p>
                                <span className="text-xs font-mono text-zinc-600 border border-white/10 px-2 py-0.5 mt-2 inline-block rounded">
                                    Icon Binding: {hobby.iconName}
                                </span>
                            </div>
                            <form action={async () => {
                                "use server";
                                await deleteHobby(hobby.id);
                            }} className="shrink-0">
                                <button type="submit" className="px-3 py-1.5 rounded border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/10 transition-colors cursor-pointer">
                                    DELETE
                                </button>
                            </form>
                        </div>
                    ))}
                    {hobbies.length === 0 && (
                        <div className="p-8 text-center border border-white/5 border-dashed rounded-xl">
                            <p className="text-zinc-500 font-mono">No hobbies deployed yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
