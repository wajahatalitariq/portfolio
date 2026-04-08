import { prisma } from "@/lib/prisma";
import { deleteMessage, toggleMessageRead } from "@/app/actions/admin";

/**
 * MessagesAdminPage Component
 * 
 * Provides a specialized terminal view for reviewing visitor feedback.
 * Messages can be toggled between 'read' and 'unread' states, or permanently deleted.
 */
export default async function MessagesAdminPage() {
    // Retrieve all visitor messages, showing the newest ones at the top.
    const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div className="flex flex-col gap-8 max-w-5xl">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
                    Visitor <span className="text-[#00ff88]">Messages</span>
                </h1>
                <p className="text-zinc-500 font-mono text-sm mb-6">
                    Review and manage signals received from the contact terminal.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {messages.length === 0 ? (
                    <div className="border border-white/5 bg-[#0a192f] p-12 rounded-3xl text-center">
                        <p className="text-zinc-600 font-mono italic">No messages received yet. The void is silent.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`border transition-all duration-300 p-6 rounded-3xl flex flex-col gap-4 ${
                                msg.isRead 
                                ? "border-white/5 bg-[#0a192f]/50 opacity-70" 
                                : "border-[#00ff88]/20 bg-[#0a192f] shadow-[0_0_30px_rgba(0,255,136,0.05)]"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className={`font-bold text-lg ${msg.isRead ? "text-zinc-400" : "text-white"}`}>
                                        {msg.name}
                                    </h3>
                                    <p className="text-[#00ff88]/60 text-xs font-mono">{msg.email}</p>
                                    <p className="text-zinc-600 text-[10px] font-mono mt-1">
                                        RECEIVED: {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <form action={toggleMessageRead.bind(null, msg.id, !msg.isRead)}>
                                        <button 
                                            type="submit" 
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-colors ${
                                                msg.isRead 
                                                ? "bg-zinc-800 text-zinc-500 hover:bg-zinc-700" 
                                                : "bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 hover:bg-[#00ff88]/20"
                                            }`}
                                        >
                                            {msg.isRead ? "Mark Unread" : "Mark as Read"}
                                        </button>
                                    </form>
                                    <form action={deleteMessage.bind(null, msg.id)}>
                                        <button 
                                            type="submit" 
                                            className="px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-red-500/10 text-red-500/60 border border-red-500/20 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                            
                            <div className={`p-4 rounded-2xl font-mono text-sm leading-relaxed ${
                                msg.isRead ? "bg-black/20 text-zinc-500" : "bg-black/40 text-zinc-300"
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
