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
 * IMPORTANT: useProgress from Drei can stay `active: true` even when progress
 * reaches 100% (e.g. while the Environment HDRI map is still being processed).
 * Relying solely on `active` causes the loader to get permanently stuck at 100%.
 *
 * Fix: We track progress directly. When progress >= 100 OR active becomes false,
 * we start a short dismiss timer to allow the CyberLoader "COMPLETE" animation
 * to finish, then fade out the overlay.
 */
function LoaderOverlay({ onComplete }: { onComplete: () => void }) {
    const { active, progress } = useProgress();
    const [shouldShow, setShouldShow] = useState(true);
    const dismissedRef = useRef(false);

    const dismiss = () => {
        if (dismissedRef.current) return;
        dismissedRef.current = true;
        setShouldShow(false);
    };

    // Dismiss when progress reaches 100% — give the "COMPLETE" animation 1.2s
    useEffect(() => {
        if (progress >= 100) {
            const timer = setTimeout(dismiss, 1200);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    // Dismiss when active becomes false (normal completion path)
    useEffect(() => {
        if (!active) {
            const timer = setTimeout(dismiss, 800);
            return () => clearTimeout(timer);
        }
    }, [active]);

    // Hard fallback: if 6 seconds pass and loader is still visible, force dismiss
    useEffect(() => {
        const timer = setTimeout(dismiss, 6000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence onExitComplete={onComplete}>
            {shouldShow && (
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
