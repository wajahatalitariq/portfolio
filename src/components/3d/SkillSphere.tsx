"use client";

import { useRef, useState, useEffect } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { Html, Sparkles } from "@react-three/drei";

/**
 * SkillSphere Component
 * 
 * An interactive 3D orb that represents a technical skill.
 * Uses 'react-three-rapier' for physics (collisions and impulses)
 * and generates dynamic procedurale audio on click.
 */
export default function SkillSphere({ position, name }: { position: [number, number, number], name: string }) {
    const bodyRef = useRef<RapierRigidBody>(null);
    const [hovered, setHovered] = useState(false);
    const [sparkling, setSparkling] = useState(false);

    /**
     * playClickSound
     * Generates a sci-fi sound effect using the Web Audio API (Oscillators).
     * This avoids needing to load external .mp3 files for small UI sounds.
     */
    const playClickSound = () => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Layer 1: punchy low thud
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.frequency.setValueAtTime(220, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
        gain1.gain.setValueAtTime(0.6, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.2);

        // Layer 2: high-pitched sci-fi ping
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(1200, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.35);
    };

    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        document.body.style.cursor = "grabbing";
        playClickSound();

        // Launch the sphere up on click
        if (bodyRef.current) {
            bodyRef.current.applyImpulse(
                { x: (Math.random() - 0.5) * 5, y: 8 + Math.random() * 5, z: (Math.random() - 0.5) * 5 }, true
            );
            bodyRef.current.applyTorqueImpulse(
                { x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 }, true
            );
        }

        // Trigger 2-second sparkle burst
        setSparkling(true);
        setTimeout(() => setSparkling(false), 2000);
    };

    return (
        <RigidBody ref={bodyRef} position={position} colliders="ball" restitution={0.8} friction={0.5}>
            <mesh
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "grab"; }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = "auto"; }}
                onPointerDown={handlePointerDown}
                onPointerUp={(e) => { e.stopPropagation(); document.body.style.cursor = "grab"; }}
                castShadow
            >
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial
                    color={hovered ? "#00ffff" : "#0a192f"}
                    emissive={sparkling ? "#ff00ff" : hovered ? "#0088ff" : "#0055ff"}
                    emissiveIntensity={sparkling ? 1.5 : hovered ? 0.6 : 0.2}
                    transparent
                    opacity={hovered ? 0.7 : 0.5}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>

            {/* Name label — always visible, bigger font */}
            <Html
                center
                distanceFactor={6}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: "none" }}
            >
                <div className={`
                    text-[11px] font-bold font-mono px-2 py-0.5 rounded whitespace-nowrap select-none
                    transition-all duration-200
                    ${hovered
                        ? "bg-[#00e5ff]/30 text-white border border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.9)]"
                        : "bg-black/70 text-[#00e5ff] border border-[#00e5ff]/30"
                    }
                `}>
                    {name}
                </div>
            </Html>

            {/* Sparkle burst on click — stays centered on the sphere */}
            {sparkling && (
                <Sparkles
                    count={40}
                    scale={2.5}
                    size={8}
                    speed={2}
                    opacity={1}
                    color="#00e5ff"
                    noise={1}
                />
            )}
        </RigidBody>
    );
}
