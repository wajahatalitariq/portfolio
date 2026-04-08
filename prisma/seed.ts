/**
 * Main Database Seed Script
 * 
 * This script initializes the database with essential data like the 
 * Admin user and primary Skill/Project entries.
 * 
 * To run: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // 1. Add/Update Admin User
    // We use bcrypt to securely hash the password before storing it.
    const passwordHash = await bcrypt.hash('BS-it_8048', 10)

    await prisma.user.upsert({
        where: { username: 'Hafiz_313' },
        update: {},
        create: {
            username: 'Hafiz_313',
            password: passwordHash,
        },
    })

    // 2. Initial Skill Seeding
    // We check if skills exist first to avoid creating duplicates.
    const skillCount = await prisma.skill.count()
    if (skillCount === 0) {
        await prisma.skill.create({
            data: {
                name: 'JavaScript',
                category: 'Language',
                level: 90,
                description: 'Primary scripting language for web development.',
                projects: 'YOTA Website, Hotel Management',
            }
        })
    }

    // 3. Initial Project Seeding
    const projectCount = await prisma.project.count()
    if (projectCount === 0) {
        await prisma.project.create({
            data: {
                title: 'MedZone',
                description: 'Alzheimer and Brain Stroke Prediction using Flutter, Python, FastAPI, and ONNX.',
                link: '#',
            }
        })
    }

    console.log('Database seeded successfully!')
}

// Execute the main function and handle the database connection lifecycle.
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
