"use server";

/**
 * Admin Server Actions
 * 
 * This file contains 'use server' functions that perform database mutations.
 * Most actions require an active admin session to prevent unauthorized changes.
 */

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdminSession } from "@/lib/session";
import * as fs from "fs/promises";
import path from "path";

// ---- Auth Middleware ----
// This utility function is called at the start of every sensitive action.
async function requireAuth() {
    if (!(await checkAdminSession())) {
        throw new Error("Unauthorized access. Admin session required.");
    }
}

// ---- SKILLS ----
export async function createSkill(formData: FormData) {
    await requireAuth();
    await prisma.skill.create({
        data: {
            name: formData.get("name") as string,
            category: formData.get("category") as string,
            level: parseInt(formData.get("level") as string, 10),
            description: formData.get("description") as string,
            projects: formData.get("projects") as string,
        }
    });
    revalidatePath("/");
    revalidatePath("/admin/skills");
}

export async function deleteSkill(id: string) {
    await requireAuth();
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/skills");
}

// ---- PROJECTS ----
export async function createProject(formData: FormData) {
    await requireAuth();
    await prisma.project.create({
        data: {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            link: formData.get("link") as string | null,
        }
    });
    revalidatePath("/");
    revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
    await requireAuth();
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/projects");
}

// ---- EXPERIENCES ----
export async function createExperience(formData: FormData) {
    await requireAuth();
    await prisma.experience.create({
        data: {
            role: formData.get("role") as string,
            company: formData.get("company") as string,
            team: (formData.get("team") as string) || null,
            duration: formData.get("duration") as string,
            stack: formData.get("stack") as string,
            points: formData.get("points") as string,
            order: parseInt(formData.get("order") as string || "0", 10),
        }
    });
    revalidatePath("/");
    revalidatePath("/admin/experiences");
}

export async function deleteExperience(id: string) {
    await requireAuth();
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/experiences");
}

// ---- HOBBIES ----
export async function createHobby(formData: FormData) {
    await requireAuth();
    await prisma.hobby.create({
        data: {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            color: formData.get("color") as string,
            glow: formData.get("glow") as string,
            iconName: formData.get("iconName") as string,
        }
    });
    revalidatePath("/");
    revalidatePath("/admin/hobbies");
}

export async function deleteHobby(id: string) {
    await requireAuth();
    await prisma.hobby.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/hobbies");
}

/**
 * updateResume
 * Handles file uploads for the résumé (PDF and Word formats).
 * Files are stored in the 'public/uploads' directory for browser access.
 */
export async function updateResume(formData: FormData) {
    await requireAuth();

    const linkUrl = formData.get("linkUrl") as string | null;
    const pdfFile = formData.get("pdf") as File | null;
    const wordFile = formData.get("word") as File | null;

    let pdfPath: string | undefined = undefined;
    let wordPath: string | undefined = undefined;

    // Define the upload directory on the server's filesystem
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    if (pdfFile && pdfFile.size > 0) {
        const bytes = await pdfFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `resume_${Date.now()}.pdf`;
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        pdfPath = `/uploads/${fileName}`;
    }

    if (wordFile && wordFile.size > 0) {
        const bytes = await wordFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = wordFile.name.split('.').pop() || 'docx';
        const fileName = `resume_${Date.now()}.${ext}`;
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        wordPath = `/uploads/${fileName}`;
    }

    const existingResume = await prisma.resume.findFirst();

    if (existingResume) {
        await prisma.resume.update({
            where: { id: existingResume.id },
            data: {
                linkUrl: linkUrl || existingResume.linkUrl,
                pdfUrl: pdfPath || existingResume.pdfUrl,
                wordUrl: wordPath || existingResume.wordUrl,
            }
        });
    } else {
        await prisma.resume.create({
            data: {
                linkUrl: linkUrl,
                pdfUrl: pdfPath,
                wordUrl: wordPath,
            }
        });
    }

    // revalidatePath clears the Next.js cache so the visitor sees the new file immediately.
    revalidatePath("/");
    revalidatePath("/admin/resume");
}

// ---- HERO IDENTITY ----
export async function updateHero(formData: FormData) {
    await requireAuth();

    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
    const intro = formData.get("intro") as string;

    const existingHero = await prisma.hero.findFirst();

    if (existingHero) {
        await prisma.hero.update({
            where: { id: existingHero.id },
            data: { name, title, intro }
        });
    } else {
        await prisma.hero.create({
            data: { name, title, intro }
        });
    }

    revalidatePath("/");
    revalidatePath("/admin/hero");
}

// ---- CERTIFICATIONS ----
export async function createCertification(formData: FormData) {
    await requireAuth();
    await prisma.certification.create({
        data: {
            title: formData.get("title") as string,
            issuer: formData.get("issuer") as string,
            issuedAt: new Date(formData.get("issuedAt") as string),
            credentialUrl: (formData.get("credentialUrl") as string) || null,
            color: (formData.get("color") as string) || "#00e5ff",
            skills: formData.get("skills") as string,
        }
    });
    revalidatePath("/");
    revalidatePath("/admin/certifications");
}

export async function deleteCertification(id: string) {
    await requireAuth();
    await prisma.certification.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/certifications");
}

// ---- CONTACT LINKS ----
export async function createContactLink(formData: FormData) {
    await requireAuth();
    await prisma.contactLink.create({
        data: {
            label: formData.get("label") as string,
            url: formData.get("url") as string,
            icon: formData.get("icon") as string,
            color: (formData.get("color") as string) || "#00e5ff",
            order: parseInt(formData.get("order") as string || "0", 10),
        }
    });
    revalidatePath("/");
    revalidatePath("/admin/contacts");
}

export async function deleteContactLink(id: string) {
    await requireAuth();
    await prisma.contactLink.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/contacts");
}

// ---- VISITOR MESSAGES ----
export async function submitMessage(formData: FormData) {
    // PUBLIC ACTION - No requireAuth
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const content = formData.get("message") as string;

    if (!name || !email || !content) return { error: "Missing fields" };

    try {
        await prisma.message.create({
            data: { name, email, content }
        });
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to transmit signal" };
    }
}

export async function deleteMessage(id: string) {
    await requireAuth();
    await prisma.message.delete({ where: { id } });
    revalidatePath("/admin/messages");
}

export async function toggleMessageRead(id: string, isRead: boolean) {
    await requireAuth();
    await prisma.message.update({
        where: { id },
        data: { isRead }
    });
    revalidatePath("/admin/messages");
}
