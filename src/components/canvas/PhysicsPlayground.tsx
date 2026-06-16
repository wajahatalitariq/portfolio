"use client";

import { Physics, RigidBody } from "@react-three/rapier";
import { Grid } from "@react-three/drei";
import SkillSphere from "@/components/3d/SkillSphere";
import type { Skill } from "@prisma/client";

interface PhysicsPlaygroundProps {
    skills: Skill[];
    skillPositions: [number, number, number][];
}

export default function PhysicsPlayground({ skills, skillPositions }: PhysicsPlaygroundProps) {
    return (
        <Physics gravity={[0, -5, 0]}>
            <RigidBody type="fixed" position={[0, -4, 0]}>
                <mesh>
                    <boxGeometry args={[60, 1, 60]} />
                    <meshBasicMaterial visible={false} />
                </mesh>
            </RigidBody>
            
            <Grid 
                position={[0, -3.5, 0]} 
                args={[50, 50]} 
                cellColor="#00e5ff" 
                sectionColor="#b300ff" 
                fadeDistance={30} 
                cellThickness={1} 
                sectionThickness={1.5} 
                infiniteGrid={true} 
            />

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
    );
}
