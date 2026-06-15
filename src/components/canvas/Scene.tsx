"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls, Scroll, Sparkles, Float, Environment, Grid } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import HolographicCard from "@/components/3d/HolographicCard";
import SkillSphere from "@/components/3d/SkillSphere";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillNetworkSection from "@/components/sections/SkillNetworkSection";
import HobbiesSection from "@/components/sections/HobbiesSection";
import CVDownloadSection from "@/components/sections/CVDownloadSection";
import CertificationsSection from "@/components/sections/CertificationsSection";
import ContactSection from "@/components/sections/ContactSection";

import { OFFSETS } from "@/lib/constants";
import type { SceneProps } from "@/lib/types";
import { useScroll as useR3FScroll } from "@react-three/drei";

/**
 * ScrollHandler Component
 * 
 * This is a hidden bridge between standard HTML (the Navbar) and the 3D world.
 * It listens for the "portfolio-scroll" event and manually moves the 
 * internal scroll container of React Three Fiber.
 */
function ScrollHandler() {
    const scroll = useR3FScroll();
    
    useEffect(() => {
        const handleScrollRequest = (e: Event) => {
            const customEvent = e as CustomEvent<{ offsetKey: string; isMobile: boolean }>;
            const { offsetKey, isMobile } = customEvent.detail;
            const offsets = isMobile ? OFFSETS.mobile : OFFSETS.desktop;
            const vh = offsets[offsetKey as keyof typeof offsets] as number;
            
            if (scroll.el) {
                const targetScroll = (vh / 100) * scroll.el.clientHeight;
                scroll.el.scrollTo({
                    top: targetScroll,
                    behavior: "smooth"
                });
            }
        };

        window.addEventListener("portfolio-scroll", handleScrollRequest as EventListener);
        return () => window.removeEventListener("portfolio-scroll", handleScrollRequest as EventListener);
    }, [scroll]);

    return null;
}

/**
 * Main 3D Scene Component
 * 
 * This component manages the 3D Canvas, Physics, and the DOM overlay system.
 * It uses 'ScrollControls' to create a unified scrolling experience for both 
 * 3D objects and HTML content.
 */
export default function Scene({ skills, projects, experiences, hobbies, resume, hero, certifications, contactLinks }: SceneProps) {
    const [isMobile, setIsMobile] = useState(false);

    // Pre-generate random positions for skill spheres to maintain purity in React 19
    const [skillPositions, setSkillPositions] = useState<[number, number, number][]>([]);

    useEffect(() => {
        const positions = skills.map(() => [
            (Math.random() - 0.5) * 10,
            5 + Math.random() * 8,
            (Math.random() - 0.5) * 4
        ] as [number, number, number]);
        
        requestAnimationFrame(() => {
            setSkillPositions(positions);
        });
    }, [skills]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const offsets = isMobile ? OFFSETS.mobile : OFFSETS.desktop;

    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={isMobile ? 1 : [1, 2]}>
            <color attach="background" args={["#050508"]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} color="#00e5ff" />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#b300ff" />
 
            <Environment preset="city" />
 
            <Sparkles count={isMobile ? 150 : 500} scale={40} size={4} speed={0.4} opacity={0.3} color="#00e5ff" position={[0, -15, -2]} />
 
            <ScrollControls pages={offsets.pages} damping={0.2}>
                <ScrollHandler />
                <Scroll>
                    {/* Hero Section */}
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
                        <mesh position={[4, 1.5, -4]}>
                            <octahedronGeometry args={[2, 0]} />
                            <meshStandardMaterial color="#b300ff" wireframe emissive="#b300ff" emissiveIntensity={0.5} />
                        </mesh>
                    </Float>
                    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                        <mesh position={[-4, -1.5, -3]}>
                            <icosahedronGeometry args={[1.5, 0]} />
                            <meshStandardMaterial color="#00e5ff" wireframe emissive="#00e5ff" emissiveIntensity={0.5} />
                        </mesh>
                    </Float>

                    {/* 3D Visual Elements */}

                    {/* Skills Physics Playground Section */}
                    <group position={[0, -12 - (offsets.tech - 120) / 20, 0]}>
                        <Physics gravity={[0, -5, 0]}>
                            <RigidBody type="fixed" position={[0, -4, 0]}>
                                <mesh>
                                    <boxGeometry args={[60, 1, 60]} />
                                    <meshBasicMaterial visible={false} />
                                </mesh>
                            </RigidBody>
                            <Grid position={[0, -3.5, 0]} args={[50, 50]} cellColor="#00e5ff" sectionColor="#b300ff" fadeDistance={30} cellThickness={1} sectionThickness={1.5} infiniteGrid={true} />

                            {/* Containment Walls (Invisible) */}
                            <RigidBody type="fixed" position={[-20, 15, 0]}>
                                <mesh><boxGeometry args={[1, 40, 60]} /><meshStandardMaterial visible={false} /></mesh>
                            </RigidBody>
                            <RigidBody type="fixed" position={[20, 15, 0]}>
                                <mesh><boxGeometry args={[1, 40, 60]} /><meshStandardMaterial visible={false} /></mesh>
                            </RigidBody>
                            <RigidBody type="fixed" position={[0, 15, -20]}>
                                <mesh><boxGeometry args={[60, 40, 1]} /><meshStandardMaterial visible={false} /></mesh>
                            </RigidBody>
                            <RigidBody type="fixed" position={[0, 15, 20]}>
                                <mesh><boxGeometry args={[60, 40, 1]} /><meshStandardMaterial visible={false} /></mesh>
                            </RigidBody>

                            {skillPositions.length === skills.length && skills.map((skill, index) => (
                                <SkillSphere
                                    key={index}
                                    position={skillPositions[index]}
                                    name={skill.name}
                                />
                            ))}
                        </Physics>
                    </group>

                </Scroll>

                {/* 
                  DOM OVERLAYS
                  These are standard HTML elements that sit accurately on top of the 3D canvas.
                  We use 'absolute' positioning with 'vh' values from constants.ts to 
                  place them exactly where they belong in the long vertical scroll.
                */}
                <Scroll html style={{ width: "100%", color: "white" }}>
                    {/* DOM Hero */}
                    <div style={{ position: "absolute", top: "0vh", width: "100%", height: "100vh" }} className="flex flex-col items-center justify-center pointer-events-none text-center px-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                            {hero?.name || "Abdullah Bin Zubair"}
                        </h1>
                        <p className="text-xl md:text-3xl font-bold tracking-[0.3em] uppercase text-[#00e5ff] mt-4 drop-shadow-[0_0_10px_rgba(0,229,255,1)]">
                            {hero?.title || "Full Stack Developer"}
                        </p>

                        {hero?.intro && (
                            <div className="mt-8 max-w-2xl px-6 py-4 rounded-2xl bg-[#0a192f]/60 border border-[#00e5ff]/20 backdrop-blur-md shadow-[0_0_30px_rgba(0,229,255,0.1)]">
                                <p className="text-zinc-300 font-mono leading-relaxed text-sm md:text-base">
                                    {hero.intro}
                                </p>
                            </div>
                        )}

                        <p className="mt-12 text-zinc-500 font-mono tracking-widest uppercase animate-pulse">
                            [ SCROLL DOWN ]
                        </p>
                    </div>

                    {/* DOM Projects Heading */}
                    <div style={{ position: "absolute", top: `${offsets.projects}vh`, width: "100%" }} className="flex items-start justify-center pointer-events-none">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.3em] uppercase opacity-80 bg-black/40 px-4 sm:px-6 py-2 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] text-center sm:text-left">
                            / Projects & Experience
                        </h2>
                    </div>

                    {/* DOM Projects Grid — 40px spacing */}
                    <div 
                        style={{ position: "absolute", top: `${offsets.grid}vh`, width: "100%" }} 
                        className="flex flex-col items-center px-4 pointer-events-none"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pointer-events-auto">
                            {projects.map((proj) => (
                                <HolographicCard
                                    key={proj.id}
                                    title={proj.title}
                                    description={proj.description}
                                />
                            ))}
                        </div>
                    </div>


                    {/* DOM Physics Heading */}
                    <div style={{ position: "absolute", top: `${offsets.tech}vh`, width: "100%" }} className="flex flex-col items-center pointer-events-none text-center">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-[0.3em] uppercase text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)] bg-black/60 px-6 py-2 rounded-xl backdrop-blur-sm">
                            / Tech Stack
                        </h2>
                        <div className="mt-8">
                            <span className="text-white bg-black/80 px-6 py-3 rounded border border-cyan-500/30 font-mono tracking-widest backdrop-blur-md">
                                INTERACT WITH THE NODES BELOW
                            </span>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div style={{ position: "absolute", top: `${offsets.exp}vh`, width: "100%" }} className="flex flex-col items-center pointer-events-auto">
                        <ExperienceSection experiences={experiences} />
                    </div>

                    {/* Skill Network */}
                    <div style={{ position: "absolute", top: `${offsets.skill}vh`, width: "100%" }} className="flex flex-col items-center pointer-events-auto">
                        <SkillNetworkSection />
                    </div>

                    {/* Certifications */}
                    <div style={{ position: "absolute", top: `${offsets.cert}vh`, width: "100%" }} className="flex flex-col items-center pointer-events-auto">
                        <CertificationsSection certifications={certifications} skills={skills} />
                    </div>

                    {/* Hobbies */}
                    <div style={{ position: "absolute", top: `${offsets.hobbies}vh`, width: "100%" }} className="flex flex-col items-center pointer-events-auto">
                        <HobbiesSection hobbies={hobbies} />
                    </div>

                    {/* CV Download */}
                    <div style={{ position: "absolute", top: `${offsets.cv}vh`, width: "100%" }} className="flex flex-col items-center pointer-events-auto">
                        <CVDownloadSection resume={resume} />
                    </div>

                    {/* Contact */}
                    <div style={{ position: "absolute", top: `${offsets.contact}vh`, width: "100%" }} className="flex flex-col items-center pointer-events-auto pb-40">
                        <ContactSection links={contactLinks} />
                    </div>


                </Scroll>
            </ScrollControls>
        </Canvas>
    );
}
