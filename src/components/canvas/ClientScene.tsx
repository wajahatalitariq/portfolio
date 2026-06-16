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
 * Simple client wrapper that renders the 3D Scene dynamically.
 * Dispatches "portfolio-loaded" after mount to dismiss StaticHero.
 */
export default function ClientScene(props: SceneProps) {
    useEffect(() => {
        // Give the canvas time to initialize before dismissing StaticHero
        const timer = setTimeout(() => {
            window.dispatchEvent(new CustomEvent("portfolio-loaded"));
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return <Scene {...props} />;
}
