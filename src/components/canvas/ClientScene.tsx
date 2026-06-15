"use client";

import { useState, useEffect } from "react";
import Scene from "./Scene";
import type { SceneProps } from "@/lib/types";
import { useProgress } from "@react-three/drei";
import CyberLoader from "@/components/ui/CyberLoader";
import { AnimatePresence, motion } from "framer-motion";

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
 * Next.js SSR tries to pre-render the 3D Canvas on the server, which leads to 
 * WebGL errors, hydration mismatches, and double createRoot() crashes.
 * 
 * This wrapper guarantees the Canvas is only initialized on the client side 
 * after mount, preventing hydration errors and bypassing compiler bugs.
 */
export default function ClientScene(props: SceneProps) {
    const [mounted, setMounted] = useState(false);
    const [loadingDone, setLoadingDone] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
        });
    }, []);

    return (
        <>
            {mounted && <Scene {...props} />}
            {!loadingDone && <LoaderOverlay onComplete={() => setLoadingDone(true)} />}
            {!mounted && (
                <div className="fixed inset-0 z-[9999]">
                     <CyberLoader />
                </div>
            )}
        </>
    );
}

