import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client Singleton
 * 
 * In development, Next.js hot-reloading can cause multiple Prisma instances to be created,
 * which may exhaust database connection limits. This pattern ensures only one 
 * instance exists globally during the application's lifecycle.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
