"use client";

import { useEffect } from "react";
import Scene from "./Scene";
import type { SceneProps } from "@/lib/types";

/**
 * ClientScene Component
 *
 * Simple client wrapper that renders the 3D Scene directly.
 * No dynamic imports here — the dynamic() import lives in page.tsx
 * which is the original working architecture.
 *
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
