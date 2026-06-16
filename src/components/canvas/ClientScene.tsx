"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { SceneProps } from "@/lib/types";
import { useProgress } from "@react-three/drei";
import CyberLoader from "@/components/ui/CyberLoader";
import { AnimatePresence, motion } from "framer-motion";

// Dynamically import the main 3D Scene with ssr: false so heavy canvas code doesn't load on SSR
const Scene = dynamic(() => import("./Scene"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 z-[9999]"><CyberLoader /></div>
});

/**
 * Three.js Asset Loader Overlay
 * 
 * Uses Drei's useProgress to track the loading state of textures, fonts, 
 * models, and the environment map. Keeps the CyberLoader visible until 
 * everything is fully ready, then fades it out smoothly.
 * 
 * Once loading completes and the exit animation finishes, the entire 
 * overlay unmounts to free up the useProgress subscription.
 */
function LoaderOverlay({ onComplete }: { onComplete: () => void }) {
    const { active, progress } = useProgress();
    const hasBeenActiveRef = useRef(false);

    useEffect(() => {
        if (active) {
            hasBeenActiveRef.current = true;
        }
    }, [active]);

    useEffect(() => {
        if (!active && hasBeenActiveRef.current) {
            onComplete();
        }
    }, [active, onComplete]);

    // Fallback: If 3 seconds pass and active is false, complete the loader
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!active) {
                onComplete();
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [active, onComplete]);

    return (
        <AnimatePresence onExitComplete={onComplete}>
            {active && (
                <motion.div 
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999]"
                >
                    <CyberLoader progressValue={progress} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * ClientScene Component
 * 
 * Phase 5 Optimization: Defers mounting the heavy <Canvas> until the user's
 * first interaction (scroll, touch, or click). This prevents Three.js from
 * blocking the main thread during the critical initial paint window, which
 * dramatically reduces Total Blocking Time (TBT) as measured by Lighthouse.
 * 
 * A "tap to start" prompt is shown instantly while the canvas waits.
 */
export default function ClientScene(props: SceneProps) {
    const [canvasReady, setCanvasReady] = useState(false);
    const [loadingDone, setLoadingDone] = useState(false);

    // Mount canvas on first user interaction
    useEffect(() => {
        const activate = () => {
            setCanvasReady(true);
            window.removeEventListener("scroll", activate);
            window.removeEventListener("touchstart", activate);
            window.removeEventListener("click", activate);
            window.removeEventListener("keydown", activate);
        };

        window.addEventListener("scroll", activate, { passive: true });
        window.addEventListener("touchstart", activate, { passive: true });
        window.addEventListener("click", activate);
        window.addEventListener("keydown", activate);

        // Also start canvas automatically after 2s in case user doesn't interact
        const autoStart = setTimeout(() => activate(), 2000);

        return () => {
            window.removeEventListener("scroll", activate);
            window.removeEventListener("touchstart", activate);
            window.removeEventListener("click", activate);
            window.removeEventListener("keydown", activate);
            clearTimeout(autoStart);
        };
    }, []);

    useEffect(() => {
        if (loadingDone) {
            window.dispatchEvent(new CustomEvent("portfolio-loaded"));
        }
    }, [loadingDone]);

    return (
        <>
            {canvasReady && <Scene {...props} />}
            {canvasReady && !loadingDone && <LoaderOverlay onComplete={() => setLoadingDone(true)} />}
        </>
    );
}
