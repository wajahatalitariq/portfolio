import AudioPlayer from "@/components/ui/AudioPlayer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Navbar from "@/components/ui/Navbar";

/**
 * PublicLayout
 * 
 * Provides the main site's interactive UI elements like the 3D-oriented 
 * Navbar, custom cursor, and background audio. These are excluded from 
 * the admin and login sections for a cleaner utility-focused experience.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navbar: The Neural Float navigation bar fixed at the top */}
      <Navbar />
      <AudioPlayer />
      <ScrollToTop />
      {children}
    </>
  );
}
