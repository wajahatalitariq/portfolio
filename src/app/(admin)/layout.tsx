/**
 * AdminRootLayout
 * 
 * Provides a consistent "Cyberpunk Dark" theme for all admin-related routes.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    // We apply a dark futuristic theme base for the whole admin section
    return (
        <div className="h-screen bg-[#050508] text-zinc-300 font-sans selection:bg-[#00e5ff]/30">
            {children}
        </div>
    );
}
