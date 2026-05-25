"use client";

import { useState, useEffect } from "react";
import Scene from "./Scene";
import type { SceneProps } from "@/lib/types";

/**
 * ClientScene Component
 * 
 * A client-only wrapper around the main 3D Scene.
 * Next.js SSR tries to pre-render the 3D Canvas on the server, which leads to 
 * WebGL errors, hydration mismatches, and double createRoot() crashes.
 * 
 * This wrapper guarantees the Canvas is only initialized on the client side 
 * after mount, preventing hydration errors and bypassing compiler bugs.
 */
export default function ClientScene(props: SceneProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
        });
    }, []);

    if (!mounted) {
        // Render a dark matching background during SSR/Hydration
        return <div className="w-screen h-screen bg-[#050508]" />;
    }

    return <Scene {...props} />;
}
