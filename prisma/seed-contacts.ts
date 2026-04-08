/**
 * Contact Links Seed Script
 * 
 * Initializes the social and professional links displayed in the Portfolio Footer and HUD.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Check if contacts already exist
    const count = await prisma.contactLink.count()
    if (count > 0) {
        console.log('Contact links already seeded.')
        return
    }

    // Insert primary contact methods
    await prisma.contactLink.createMany({
        data: [
            {
                label: 'Email',
                url: 'mailto:abdullahbinzubair313@gmail.com',
                icon: 'email', // Identifier for icon lookup
                color: '#00e5ff',
                order: 0,
            },
            {
                label: 'LinkedIn',
                url: 'https://linkedin.com/in/abdullah-bin-zubair',
                icon: 'linkedin',
                color: '#0077b5',
                order: 1,
            },
            {
                label: 'GitHub',
                url: 'https://github.com/abdullahzubair',
                icon: 'github',
                color: '#b300ff',
                order: 2,
            },
            {
                label: 'WhatsApp',
                url: 'https://wa.me/923001234567',
                icon: 'whatsapp',
                color: '#25d366',
                order: 3,
            },
        ],
    })

    console.log('Contact links seeded!')
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
