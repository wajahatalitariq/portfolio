import ClientScene from '@/components/canvas/ClientScene';
import { prisma } from '@/lib/prisma';

/**
 * Home Page (Main Entry Point)
 *
 * This is a Server Component that fetches all portfolio data from the
 * database using Prisma. Data is fetched in parallel for optimal performance.
 *
 * SEO Note: A <noscript> block containing all textual portfolio content is
 * injected into the DOM so that search engine crawlers that do not execute
 * JavaScript can still read and index all meaningful content.
 */
export default async function Home() {
  // We use Promise.all to fetch all datasets simultaneously rather than sequentially.
  const [skills, projects, experiences, hobbies, resume, hero, certifications, contactLinks] =
    await Promise.all([
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
    <main
      className="w-screen h-screen"
      /*
       * aria-label provides an accessible landmark description for assistive
       * technologies and helps search crawlers understand the page role.
       */
      aria-label={`Portfolio of ${hero?.name ?? 'Abdullah Bin Zubair Hashmi'}`}
    >
      {/*
       * noscript SEO Fallback
       * ----------------------
       * This block is ONLY rendered when JavaScript is disabled.
       * It exposes all portfolio text content (name, title, projects, skills,
       * experience, certifications, contact) to bots that don't run JS.
       * Styled to be visually accessible but not interfering with the 3D UI.
       */}
      <noscript>
        <div
          style={{
            position: 'absolute',
            zIndex: 9999,
            background: '#050508',
            color: '#ededed',
            fontFamily: 'monospace',
            padding: '2rem',
            overflow: 'auto',
            width: '100%',
            minHeight: '100vh',
          }}
        >
          {/* Hero */}
          <h1 style={{ color: '#ffffff', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {hero?.name ?? 'Abdullah Bin Zubair Hashmi'}
          </h1>
          <p style={{ color: '#00e5ff', fontSize: '1.25rem', marginBottom: '1rem' }}>
            {hero?.title ?? 'Full Stack Developer'}
          </p>
          {hero?.intro && (
            <p style={{ color: '#aaaaaa', maxWidth: '700px', marginBottom: '2rem' }}>
              {hero.intro}
            </p>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section aria-label="Projects" style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#00e5ff', borderBottom: '1px solid #00e5ff33', paddingBottom: '0.5rem' }}>
                Projects &amp; Experience
              </h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {projects.map((proj) => (
                  <li key={proj.id} style={{ marginBottom: '1rem' }}>
                    <h3 style={{ color: '#ffffff', margin: 0 }}>{proj.title}</h3>
                    <p style={{ color: '#aaaaaa', margin: '0.25rem 0 0' }}>{proj.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section aria-label="Skills" style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#00e5ff', borderBottom: '1px solid #00e5ff33', paddingBottom: '0.5rem' }}>
                Tech Stack &amp; Skills
              </h2>
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
                {skills.map((skill, i) => (
                  <li
                    key={i}
                    style={{
                      background: '#0a192f',
                      border: '1px solid #00e5ff33',
                      borderRadius: '6px',
                      padding: '0.25rem 0.75rem',
                      color: '#00e5ff',
                      fontSize: '0.85rem',
                    }}
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section aria-label="Work Experience" style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#00e5ff', borderBottom: '1px solid #00e5ff33', paddingBottom: '0.5rem' }}>
                Work Experience
              </h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {experiences.map((exp) => (
                  <li key={exp.id} style={{ marginBottom: '1.25rem' }}>
                    <h3 style={{ color: '#ffffff', margin: 0 }}>{exp.role}</h3>
                    <p style={{ color: '#b300ff', margin: '0.2rem 0', fontSize: '0.9rem' }}>{exp.company} — {exp.duration}</p>
                    <p style={{ color: '#aaaaaa', fontSize: '0.85rem' }}>{exp.points}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section aria-label="Certifications" style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#00e5ff', borderBottom: '1px solid #00e5ff33', paddingBottom: '0.5rem' }}>
                Certifications
              </h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {certifications.map((cert) => (
                  <li key={cert.id} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: '#ffffff' }}>{cert.title}</span>
                    {' — '}
                    <span style={{ color: '#aaaaaa' }}>{cert.issuer}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hobbies */}
          {hobbies.length > 0 && (
            <section aria-label="Hobbies and Interests" style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#00e5ff', borderBottom: '1px solid #00e5ff33', paddingBottom: '0.5rem' }}>
                Hobbies &amp; Interests
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {hobbies.map((hobby) => (
                  <li key={hobby.id} style={{ color: '#aaaaaa' }}>
                    {hobby.name}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Contact Links */}
          {contactLinks.length > 0 && (
            <section aria-label="Contact" style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#00e5ff', borderBottom: '1px solid #00e5ff33', paddingBottom: '0.5rem' }}>
                Contact
              </h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {contactLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      style={{ color: '#00e5ff', textDecoration: 'underline' }}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </noscript>

      {/* 3D Interactive Canvas — requires JavaScript */}
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
