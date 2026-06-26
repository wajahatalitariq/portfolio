"use client";

import dynamic from "next/dynamic";
import type { SceneProps } from "@/lib/types";

// Dynamically import the main 3D Scene with ssr: false so heavy canvas code doesn't load on SSR
const Scene = dynamic(() => import("./Scene"), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050508] text-[#00e5ff] font-mono tracking-[0.2em] text-sm uppercase animate-pulse">
            Initializing neural link...
        </div>
    )
});

export default function ClientScene(props: SceneProps) {
    return <Scene {...props} />;
}
