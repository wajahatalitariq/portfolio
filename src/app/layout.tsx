import type { Metadata, Viewport } from "next";
import { prisma } from "@/lib/prisma";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Canonical production domain */
const SITE_URL = "https://abdullahbinzubairhashmi.dev";

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const hero = await prisma.hero.findFirst();
  const name = hero?.name || "Abdullah Bin Zubair Hashmi";
  const title = hero?.title || "Full Stack Developer";
  const description =
    hero?.intro ||
    "Professional portfolio of Abdullah Bin Zubair Hashmi — a Full Stack Developer specializing in Next.js, React, Three.js, and modern 3D web experiences.";

  return {
    title: {
      template: `%s | ${name}`,
      default: `${name} | ${title}`,
    },
    description,
    keywords: [
      "Full Stack Developer",
      "Web Developer",
      "Frontend Developer",
      "Backend Developer",
      "Abdullah Bin Zubair Hashmi",
      "Portfolio",
      "Developer",
      "Pakistani Developer",
      "Pakistan",
      "Next.js",
      "React",
      "Three.js",
      "3D Web Development",
      "Interactive Portfolio",
      "Modern Web Design",
      "TypeScript",
      "Node.js",
      "Prisma",
      "abdullahbinzubairhashmi.dev",
    ],
    authors: [{ name, url: SITE_URL }],
    creator: name,
    publisher: name,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${name} | ${title}`,
      description,
      url: SITE_URL,
      siteName: name,
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${name} — ${title} Portfolio`,
          type: "image/png",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${title}`,
      description,
      images: ["/opengraph-image.png"],
      creator: "@abdullahbzh", // update if you have a Twitter/X handle
    },
    icons: {
      icon: [
        { url: "/icon.png", type: "image/png" },
        { url: "/favicon.ico" },
      ],
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    manifest: "/manifest.webmanifest",
  };
}

// Navbar, CustomCursor, etc. are now in (public)/layout.tsx
import CustomCursor from "@/components/ui/CustomCursor";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch hero and contact links for structured data
  const hero = await prisma.hero.findFirst();
  const contactLinks = await prisma.contactLink.findMany({ orderBy: { order: "asc" } });

  const name = hero?.name || "Abdullah Bin Zubair Hashmi";
  const jobTitle = hero?.title || "Full Stack Developer";
  const description =
    hero?.intro ||
    "Professional portfolio of Abdullah Bin Zubair Hashmi — a Full Stack Developer specializing in Next.js, React, Three.js, and modern 3D web experiences.";

  // Build sameAs list from stored contact links (GitHub, LinkedIn, etc.)
  const sameAsUrls = contactLinks
    .filter((link) => link.url && link.url.startsWith("http"))
    .map((link) => link.url);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image.png`,
    jobTitle,
    description,
    ...(sameAsUrls.length > 0 && { sameAs: sameAsUrls }),
    worksFor: {
      "@type": "Organization",
      name: "Freelance / Open to Opportunities",
    },
    knowsAbout: [
      "Next.js",
      "React",
      "Three.js",
      "TypeScript",
      "Node.js",
      "Full Stack Development",
      "3D Web Development",
      "Prisma",
      "PostgreSQL",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: SITE_URL,
    description,
    author: {
      "@type": "Person",
      name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to speed up font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Person Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        {/* WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col relative">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
