/**
 * Portfolio Data Types
 * These definitions ensure that our components know exactly what structure 
 * to expect from the database and CMS data.
 */

import type { Project, Experience, Hobby, Resume, Hero, Skill } from "@prisma/client";

/**
 * Certification Model
 * Represents professional certificates displayed in the Certifications section.
 */
export type Certification = {
    id: string;
    title: string;
    issuer: string;
    issuedAt: Date | string;
    credentialUrl?: string | null;
    color: string;
    skills: string;
};

/**
 * Contact Link Model
 * Represents social and communication links (GitHub, LinkedIn, etc.) 
 * used in the Contact section and HUD.
 */
export type ContactLink = {
    id: string;
    label: string;
    url: string;
    icon: string;
    color: string;
    order: number;
};

/**
 * Scene Properties
 * This interface defines the props passed to the main 3D Scene component.
 * It consolidates all data fetched from the database.
 */
export interface SceneProps {
    skills: Skill[];
    projects: Project[];
    experiences: Experience[];
    hobbies: Hobby[];
    resume: Resume | null;
    hero: Hero | null;
    certifications: Certification[];
    contactLinks: ContactLink[];
}
