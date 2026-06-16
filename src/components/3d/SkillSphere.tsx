"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { Sparkles } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext() {
    if (typeof window === "undefined") return null;
    if (!sharedAudioCtx) {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
            sharedAudioCtx = new AudioContextClass();
        }
    }
    return sharedAudioCtx;
}

/**
 * SkillSphere Component
 * 
 * NOTE: Uses an offscreen Canvas-generated Sprite texture for text labels.
 * This completely avoids using Drei's <Text> (which loads troika-three-text and
 * creates a Web Worker that crashes on minified Next.js bundles) and Drei's <Html>
 * (which causes portal rendering issues in dynamically imported canvas scenes).
 */
function CanvasText({ text, hovered }: { text: string; hovered: boolean }) {
    const texture = useMemo(() => {
        if (typeof window === "undefined") return null;

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            // Draw background
            ctx.fillStyle = hovered ? "rgba(0, 229, 255, 0.25)" : "rgba(0, 0, 0, 0.75)";
            ctx.strokeStyle = hovered ? "#00e5ff" : "rgba(0, 229, 255, 0.3)";
            ctx.lineWidth = 6;
            
            ctx.beginPath();
            const x = 8, y = 8, w = canvas.width - 16, h = canvas.height - 16, r = 16;
            if (typeof ctx.roundRect === "function") {
                ctx.roundRect(x, y, w, h, r);
            } else {
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);
                ctx.closePath();
            }
            ctx.fill();
            ctx.stroke();

            // Text configuration
            ctx.font = "bold 38px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Draw outline
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 8;
            ctx.strokeText(text, canvas.width / 2, canvas.height / 2);

            // Draw fill
            ctx.fillStyle = hovered ? "#ffffff" : "#00e5ff";
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        }
        
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        return tex;
    }, [text, hovered]);

    useEffect(() => {
        return () => {
            texture?.dispose();
        };
    }, [texture]);

    if (!texture) return null;

    return (
        <sprite position={[0, 1.2, 0]} scale={[1.8, 0.45, 1]}>
            <spriteMaterial map={texture} depthTest={true} />
        </sprite>
    );
}

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
        try {
            const ctx = getSharedAudioContext();
            if (!ctx) return;

            if (ctx.state === "suspended") {
                ctx.resume();
            }

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
        } catch (soundError) {
            console.warn("Failed to play procedural click sound:", soundError);
        }
    };

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = "grabbing";
        
        try {
            playClickSound();
        } catch (err) {
            console.warn("Audio play blocked or failed:", err);
        }

        // Launch the sphere up on click
        if (bodyRef.current) {
            bodyRef.current.wakeUp(); // Force wake up in case body is sleeping
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
                onClick={handlePointerDown}
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

            {/* Name label rendered via custom canvas sprite to bypass Web Worker crashes */}
            <CanvasText text={name} hovered={hovered} />

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
