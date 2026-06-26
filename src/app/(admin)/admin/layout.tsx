import { checkAdminSession, clearAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/actions/auth";

/**
 * AdminDashboardLayout Component
 * 
 * This layout is nested within the AdminRootLayout. It enforces authentication 
 * at the layout level and provides the global Sidebar navigation for the CMS.
 */
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    // Check if the user is authenticated before rendering any admin content.
    const isAuth = await checkAdminSession();

    if (!isAuth) {
        // Redirection to login happens server-side if no session is found.
        redirect("/login");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#020c18] text-zinc-300">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0a192f] flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl font-black tracking-widest text-white uppercase">Ctrl<span className="text-[#00e5ff]">.Alt</span></h2>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                    <Link href="/admin" className="px-4 py-2.5 rounded text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">Overview</Link>
                    <Link href="/admin/skills" className="px-4 py-2.5 rounded text-sm text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-colors">Manage Skills</Link>
                    <Link href="/admin/certifications" className="px-4 py-2.5 rounded text-sm text-[#ffd700] hover:bg-[#ffd700]/10 transition-colors">Manage Certifications</Link>
                    <Link href="/admin/projects" className="px-4 py-2.5 rounded text-sm text-[#b300ff] hover:bg-[#b300ff]/10 transition-colors">Manage Projects</Link>
                    <Link href="/admin/experiences" className="px-4 py-2.5 rounded text-sm text-[#00ff88] hover:bg-[#00ff88]/10 transition-colors">Manage Experience</Link>
                    <Link href="/admin/hobbies" className="px-4 py-2.5 rounded text-sm text-[#ffd700] hover:bg-[#ffd700]/10 transition-colors">Manage Hobbies</Link>
                    <Link href="/admin/resume" className="px-4 py-2.5 rounded text-sm text-[#ff3366] hover:bg-[#ff3366]/10 transition-colors">Manage Resume</Link>
                    <Link href="/admin/hero" className="px-4 py-2.5 rounded text-sm text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-colors">Manage Identity</Link>
                    <Link href="/admin/contacts" className="px-4 py-2.5 rounded text-sm text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-colors">Manage Contacts</Link>
                    <Link href="/admin/messages" className="px-4 py-2.5 rounded text-sm text-[#00ff88] hover:bg-[#00ff88]/10 transition-colors">Manage Messages</Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <form action={logout}>
                        <button type="submit" className="w-full py-2 rounded border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/10 transition-colors cursor-pointer">
                            DISCONNECT
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {children}
            </main>
        </div>
    );
}
