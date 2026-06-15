"use client";

import { useRef, useState } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { Sparkles, Text, Billboard } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
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
 * An interactive 3D orb that represents a technical skill.
 * Uses 'react-three-rapier' for physics (collisions and impulses)
 * and generates dynamic procedurale audio on click.
 */
export default function SkillSphere({ position, name }: { position: [number, number, number], name: string }) {
    const bodyRef = useRef<RapierRigidBody>(null);
    const [hovered, setHovered] = useState(false);
    const [sparkling, setSparkling] = useState(false);
    const [showLabel, setShowLabel] = useState(false);

    const labelScaleRef = useRef(0);
    const labelGroupRef = useRef<THREE.Group>(null);

    // Animates the holographic tag using high-performance WebGL scaling loop
    useFrame((_, delta) => {
        if (!labelGroupRef.current) return;
        const targetScale = showLabel ? 1 : 0;
        labelScaleRef.current = THREE.MathUtils.lerp(labelScaleRef.current, targetScale, delta * 10);
        labelGroupRef.current.scale.setScalar(labelScaleRef.current);
    });

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

        // Toggle technology name label visibility on click
        setShowLabel(prev => !prev);

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
            >
                <sphereGeometry args={[0.8, 24, 24]} />
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

            {/* Holographic Name Tag — rendered in 3D WebGL for perfect z-index, coordinate sync, and zero DOM overlap issues */}
            <Billboard position={[0, 1.3, 0]}>
                <group ref={labelGroupRef} scale={0}>
                    {/* Badge Background */}
                    <mesh>
                        <planeGeometry args={[1.8, 0.55]} />
                        <meshBasicMaterial 
                            color={hovered ? "#00ffff" : "#000813"} 
                            opacity={hovered ? 0.35 : 0.85} 
                            transparent 
                            depthTest={false}
                        />
                    </mesh>

                    {/* Badge Border (clean outer rectangle outline) */}
                    <lineLoop>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                args={[new Float32Array([
                                    -0.92, -0.295, 0,
                                    -0.92,  0.295, 0,
                                     0.92,  0.295, 0,
                                     0.92, -0.295, 0
                                ]), 3]}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial 
                            color={hovered ? "#ffffff" : "#00e5ff"} 
                            opacity={hovered ? 0.9 : 0.35} 
                            transparent 
                            depthTest={false}
                        />
                    </lineLoop>

                    {/* Text Label */}
                    <Text
                        fontSize={0.2}
                        color={hovered ? "#ffffff" : "#00e5ff"}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {name}
                    </Text>
                </group>
            </Billboard>

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
