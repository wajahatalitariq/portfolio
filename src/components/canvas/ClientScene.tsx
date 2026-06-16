"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import type { SceneProps } from "@/lib/types";
import CyberLoader from "@/components/ui/CyberLoader";

// Dynamically import the main 3D Scene with ssr: false so heavy canvas code doesn't load on SSR
const Scene = dynamic(() => import("./Scene"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 z-[9999]"><CyberLoader /></div>
});

/**
 * ClientScene Component
 *
 * A client-only wrapper around the main 3D Scene.
 * Uses next/dynamic to split the heavy Three.js bundle into a separate async chunk.
 * The CyberLoader is shown as the loading fallback while the chunk downloads.
 *
 * When Scene finishes mounting and all Three.js assets are ready, it dispatches
 * the "portfolio-loaded" event which causes StaticHero to unmount.
 */
export default function ClientScene(props: SceneProps) {
    useEffect(() => {
        // Dispatch portfolio-loaded after the canvas has had time to initialize.
        // We use a timer here because useProgress lives inside the Canvas context
        // and cannot be reliably accessed from outside it.
        const timer = setTimeout(() => {
            window.dispatchEvent(new CustomEvent("portfolio-loaded"));
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return <Scene {...props} />;
}
