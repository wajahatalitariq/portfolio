/**
 * Certifications Seed Script
 * 
 * Specifically initializes the Certification table with preset professional certificates.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Avoid double-seeding if data already exists
    const count = await prisma.certification.count()
    if (count > 0) {
        console.log('Certifications already seeded. Skipping.')
        return
    }

    // createMany is a performance-efficient way to insert multiple records at once.
    await prisma.certification.createMany({
        data: [
            {
                title: 'Meta Front-End Developer Professional Certificate',
                issuer: 'Meta (Coursera)',
                issuedAt: new Date('2024-03-15'),
                credentialUrl: 'https://www.coursera.org/account/accomplishments/professional-cert',
                color: '#00e5ff',
                skills: 'React,JavaScript,HTML,CSS,Next.js',
            },
            {
                title: 'Full Stack Web Development Bootcamp',
                issuer: 'Udemy — Dr. Angela Yu',
                issuedAt: new Date('2023-08-20'),
                credentialUrl: 'https://www.udemy.com/certificate',
                color: '#b300ff',
                skills: 'Node.js,Express,MongoDB,JavaScript,React',
            },
            {
                title: 'Introduction to Databases and SQL',
                issuer: 'IBM (Coursera)',
                issuedAt: new Date('2023-02-10'),
                credentialUrl: 'https://www.coursera.org/account/accomplishments',
                color: '#ffd700',
                skills: 'SQL,PostgreSQL,Database Design',
            },
        ],
    })

    console.log('Certifications seeded!')
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
