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
 * A client-only wrapper around the main 3D Scene.
 * Dynamically imports the heavy Scene component to split bundles.
 */
export default function ClientScene(props: SceneProps) {
    const [loadingDone, setLoadingDone] = useState(false);

    useEffect(() => {
        if (loadingDone) {
            window.dispatchEvent(new CustomEvent("portfolio-loaded"));
        }
    }, [loadingDone]);

    return (
        <>
            <Scene {...props} />
            {!loadingDone && <LoaderOverlay onComplete={() => setLoadingDone(true)} />}
        </>
    );
}
