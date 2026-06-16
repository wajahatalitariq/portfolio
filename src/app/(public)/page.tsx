import dynamic from 'next/dynamic';
import CyberLoader from '@/components/ui/CyberLoader';
import StaticHero from '@/components/ui/StaticHero';
import { prisma } from '@/lib/prisma';

/**
 * Dynamic import of ClientScene with ssr: false
 * This is the ORIGINAL working pattern — dynamic() must live in page.tsx
 * (the route entry point), not nested inside a client component wrapper.
 * CyberLoader is the loading fallback while the Three.js chunk downloads.
 */
const ClientScene = dynamic(() => import('@/components/canvas/ClientScene'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-[9999]"><CyberLoader /></div>
});

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
