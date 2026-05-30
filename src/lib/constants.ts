/**
 * Scroll Offsets Configuration
 * 
 * In this 3D portfolio, sections are positioned vertically using 'vh' (Viewport Height).
 * This file centralizes those positions so that both the 3D Scene and the 
 * Navbar stay perfectly synchronized.
 * 
 * Each value (e.g., tech: 420) means that section starts 420% of the screen height 
 * down from the top.
 */

export const OFFSETS = {
  // Mobile layout usually requires more vertical space because text wraps and stacks.
  mobile: {
    hero: 0,
    projects: 120,
    grid: 140,
    tech: 420,
    exp: 600,
    skill: 900, // Starting point for Skill Network
    cert: 1100,
    hobbies: 1250,
    cv: 1400,
    contact: 1550,
    pages: 17.2 // Total virtual pages in the scroll container
  },
  // Desktop layout is more compact.
  desktop: {
    hero: 0,
    projects: 120,
    grid: 140,
    tech: 220,
    exp: 340,
    skill: 460,
    cert: 580,
    hobbies: 700,
    cv: 810,
    contact: 920,
    pages: 10.3
  }
};
