import ClientScene from '@/components/canvas/ClientScene';
import StaticHero from '@/components/ui/StaticHero';
import { prisma } from '@/lib/prisma';

/**
 * Home Page (Main Entry Point)
 * 
 * This is a Server Component that fetches all portfolio data from the 
 * database using Prisma. Data is fetched in parallel for optimal performance.
 */
export default async function Home() {
  // We use Promise.all to fetch all datasets simultaneously rather than sequentially.
  const [skills, projects, experiences, hobbies, resume, hero, certifications, contactLinks] = await Promise.all([
    prisma.skill.findMany(),
    prisma.project.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.experience.findMany({ orderBy: { order: 'asc' } }),
    prisma.hobby.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.resume.findFirst(),
    prisma.hero.findFirst(),
    prisma.certification.findMany({ orderBy: { issuedAt: 'asc' } }),
    prisma.contactLink.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return (
    <main className="w-screen h-screen relative">
      <StaticHero hero={hero} />
      <ClientScene
        skills={skills}
        projects={projects}
        experiences={experiences}
        hobbies={hobbies}
        resume={resume}
        hero={hero}
        certifications={certifications}
        contactLinks={contactLinks}
      />
    </main>
  );
}
