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
  const description = hero?.intro || "Professional portfolio of Abdullah Bin Zubair Hashmi, a Full Stack Developer specializing in Next.js, React, Three.js, and modern 3D web experiences.";
  const url = "https://abdullahbinzubairhashmi.me";

  return {
    title: {
      template: `%s | ${name}`,
      default: `${name} | ${title}`,
    },
    description,
    keywords: [
      "Full stack developer", "Web developer", "frontend developer", "Backend developer", 
      "Abdullah Bin Zubair Hashmi", "Portfolio", "Developer", "Pakistani developer", "Pakistan",
      "Next.js", "React", "Three.js", "3D Web Development", "Interactive Portfolio", "Modern Web Design"
    ],
    authors: [{ name: name }],
    creator: name,
    publisher: name,
    metadataBase: new URL(url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${name} | ${title}`,
      description,
      url: "/",
      siteName: name,
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: `${name} Portfolio`,
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
    },
    icons: {
      icon: "/icon.png",
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
  };
}

// Navbar, CustomCursor, etc. are now in (public)/layout.tsx
import CustomCursor from "@/components/ui/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Abdullah Bin Zubair Hashmi",
              "url": "https://abdullahbinzubairhashmi.me",
              "image": "https://abdullahbinzubairhashmi.me/opengraph-image.png",
              "jobTitle": "Full Stack Developer",
              "description": "Professional portfolio of Abdullah Bin Zubair Hashmi, a Full Stack Developer specializing in Next.js, React, Three.js, and modern 3D web experiences.",
              "sameAs": [
                // Add your social links here if available
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
