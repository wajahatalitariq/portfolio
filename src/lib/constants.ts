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
    skill: 1100, // Starting point for Skill Network
    cert: 1300,
    hobbies: 1450,
    cv: 1600,
    contact: 1800,
    pages: 20.0 // Total virtual pages in the scroll container
  },
  // Desktop layout is more compact.
  desktop: {
    hero: 0,
    projects: 120,
    grid: 140,
    tech: 300,
    exp: 480,
    skill: 720,
    cert: 960,
    hobbies: 1110,
    cv: 1260,
    contact: 1410,
    pages: 15.6
  }
};
