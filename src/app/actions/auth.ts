"use server";

/**
 * Auth & Initial Setup Actions
 * 
 * Handles Admin login/logout and the recursive seeding of the database 
 * with comprehensive portfolio data.
 */
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setAdminSession, clearAdminSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function seedDatabase() {
    const count = await prisma.user.count();
    if (count > 0) return; // Already seeded

    const passwordHash = await bcrypt.hash('BS-it_8048', 10);
    await prisma.user.create({
        data: { username: 'Hafiz_313', password: passwordHash },
    });

    const rawSkills = [
        { name: "JavaScript", category: "Language" }, { name: "TypeScript", category: "Language" },
        { name: "Python", category: "Language" }, { name: "C++", category: "Language" },
        { name: "C#", category: "Language" }, { name: "PHP", category: "Language" },
        { name: "React.js", category: "Framework" }, { name: "Next.js", category: "Framework" },
        { name: "ASP.NET", category: "Framework" }, { name: "Django", category: "Framework" },
        { name: "Flutter", category: "Framework" }, { name: "Three.js", category: "Animation" },
        { name: "GSAP", category: "Animation" }, { name: "AWS", category: "Cloud" },
        { name: "Docker", category: "DevOps" }, { name: "Git", category: "DevOps" },
        { name: "SQL Server", category: "Database" }, { name: "PostgreSQL", category: "Database" },
        { name: "Tailwind", category: "Styling" }, { name: "Figma", category: "Design" }
    ];

    await Promise.all(rawSkills.map(s => prisma.skill.create({
        data: {
            name: s.name, category: s.category, level: 80 + Math.floor(Math.random() * 20),
            description: `Proficient standard in ${s.name} architecture.`, projects: 'Various Projects'
        }
    })));

    const PROJECTS = [
        { title: "MedZone", description: "Alzheimer and Brain Stroke Prediction using Flutter, Python, FastAPI, and ONNX.", link: "" },
        { title: "Trust Nexus HRMS", description: "Frontend Developer intern project utilizing Next.js, Tailwind CSS, TypeScript, and Redux.", link: "" },
        { title: "Hotel Management", description: "Comprehensive management system powered by Django, React.js, and Tailwind CSS.", link: "" },
        { title: "YOTA Website", description: "Responsive web platform with interactive GSAP.js animations and a PHP backend.", link: "" },
        { title: "Desktop Apps", description: "Q-Learning Platform & Q-Islam built purely with Qt and C++.", link: "" },
        { title: "Student Records", description: "Timetable Management System and Student Records Manager built in C++ and ASP.NET.", link: "" }
    ];

    await Promise.all(PROJECTS.map(p => prisma.project.create({ data: p })));

    const EXPERIENCES = [
        {
            company: "Trust Nexus", role: "Frontend Developer", team: "HRMS Project — Business Innovation Center, BUKC",
            duration: "12 Weeks · 2024", stack: "Next.js, Tailwind CSS, TypeScript, Redux",
            points: "Developed HRMS frontend collaborating with backend and design teams.\nImplemented intuitive UI components for employee management workflows.\nIntegrated Redux for complex state management across modules.", order: 0
        },
        {
            company: "Bahria University Head Office", role: "Operations Intern", team: "Directorate of Student Affairs",
            duration: "14 Weeks · 2024", stack: "Operations, Event Coordination, Admin Workflows",
            points: "Managed student operations and administrative tasks across departments.\nCoordinated university events and inter-department communications.\nStreamlined administrative workflows to improve processing efficiency.", order: 1
        },
        {
            company: "YOTA", role: "Coordinator — Competitive Programming", team: "Youth Organization for Technical Advancement",
            duration: "Apr 2024 – Jul 2024", stack: "Problem Solving, Mentorship, Event Management",
            points: "Led initiatives to boost problem-solving skills and coding passion in members.\nOrganized competitions and hackathons with participation across universities.\nMentored junior participants on algorithmic thinking and contest strategy.", order: 2
        }
    ];

    await Promise.all(EXPERIENCES.map(e => prisma.experience.create({ data: e })));

    const HOBBIES = [
        { name: "Podcasts", description: "Avid listener of tech, philosophy, and entrepreneurship podcasts.", color: "#00e5ff", glow: "rgba(0,229,255,0.3)", iconName: "podcast" },
        { name: "Islamic History", description: "Passionate about studying Islamic civilization and golden age scholars.", color: "#ffd700", glow: "rgba(255,215,0,0.3)", iconName: "islamic" },
        { name: "Physical Activity", description: "Dedicated to maintaining fitness through gym workouts and outdoor sports.", color: "#00ff88", glow: "rgba(0,255,136,0.3)", iconName: "fitness" },
        { name: "Calligraphy", description: "Practicing Arabic and Urdu calligraphy as a meditative art form.", color: "#b300ff", glow: "rgba(179,0,255,0.3)", iconName: "calligraphy" },
        { name: "Coding", description: "Building creative side projects — from game engines to AI experiments.", color: "#ff6b35", glow: "rgba(255,107,53,0.3)", iconName: "coding" }
    ];

    await Promise.all(HOBBIES.map(h => prisma.hobby.create({ data: h })));

    console.log('Comprehensive Database Seeded securely via Next.js Action.');
}
export async function login(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
        return { error: "Username and password are required." };
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        return { error: "Invalid credentials." };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return { error: "Invalid credentials." };
    }

    await setAdminSession();
    redirect("/admin");
}

export async function logout() {
    await clearAdminSession();
    redirect("/");
}
