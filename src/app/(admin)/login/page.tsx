"use client";

import { useState, useEffect } from "react";
import { login, seedDatabase } from "@/app/actions/auth";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Run seed check when the login page mounts over the network
        seedDatabase().catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const res = await login(formData);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00e5ff]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a192f]/80 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                {/* Decorative circuit line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#00e5ff]/50 to-transparent" />

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">Auth<span className="text-[#00e5ff]">.Sys</span></h1>
                    <p className="text-xs font-mono text-zinc-500">PORTFOLIO COMMAND CENTER</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-mono tracking-widest text-[#00e5ff]">USERNAME</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full bg-[#020c18] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors"
                            placeholder="Enter username..."
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 mb-2">
                        <label className="text-xs font-mono tracking-widest text-[#b300ff]">PASSWORD</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full bg-[#020c18] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#b300ff]/50 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 rounded-lg border border-[#00e5ff]/30 bg-[#00e5ff]/10 text-[#00e5ff] font-bold text-sm tracking-widest uppercase hover:bg-[#00e5ff]/20 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "AUTHENTICATING..." : "INITIALIZE UPLINK"}
                    </button>
                </form>
            </div>
        </div>
    );
}
