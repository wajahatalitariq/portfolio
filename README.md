# 🚀 3D Purple Portfolio

A stunning, interactive 3D portfolio website built with **Next.js**, **React Three.js**, and **Three.js**. Features a dynamic purple-themed UI with holographic effects, physics-enabled skill spheres, and a full-featured admin dashboard for content management.

![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.183.2-green?style=flat-square&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 🎨 Frontend Experience
- **Interactive 3D Scene**: Physics-enabled skill spheres with collision detection using Rapier
- **Holographic UI**: Custom holographic card components with glowing effects
- **Skill Network**: Interactive network graph visualization of technical skills
- **Smooth Animations**: GSAP animations and Framer Motion for smooth transitions
- **Responsive Design**: Fully responsive across desktop and mobile devices
- **SEO Optimized**: Includes noscript fallback content for search engine crawlers
- **Custom Audio**: Procedurally generated sci-fi sound effects using Web Audio API

### 🎛️ Admin Dashboard
- **Secure Authentication**: Protected admin panel with username/password authentication
- **Content Management**: Full CRUD operations for all portfolio sections:
  - Skills & Tech Stack
  - Projects & Portfolio Work
  - Work Experience & Career History
  - Hobbies & Interests
  - Certifications & Achievements
  - Hero Section & Bio
  - Contact Links & Social Media
  - Resume/CV Management
- **Real-time Updates**: Changes reflect immediately on the public portfolio
- **Dashboard Statistics**: Overview cards showing total counts of all content

### 🛠️ Technical Features
- **Database**: SQLite for lightweight, zero-config database
- **ORM**: Prisma for type-safe database operations
- **Security Headers**: Comprehensive security headers (CSP, X-Frame-Options, etc.)
- **Caching Strategy**: Aggressive caching for static assets (1 year TTL)
- **API Routes**: RESTful endpoints for downloads and data fetching
- **Password Hashing**: bcryptjs for secure password storage

---

## 📦 Tech Stack

### Frontend
- **Next.js 16.2.1** - React framework with App Router
- **React 19.2.4** - UI library
- **Three.js 0.183.2** - 3D graphics library
- **React Three Fiber 9.5.0** - React renderer for Three.js
- **React Three Rapier 2.2.0** - Physics engine integration
- **React Three Drei 10.7.7** - Useful 3D utilities
- **Framer Motion 12.38.0** - Advanced animations
- **GSAP 3.14.2** - Timeline animations
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend & Database
- **Prisma 6.19.2** - ORM for database operations
- **SQLite** - Lightweight embedded database
- **bcryptjs 3.0.3** - Password hashing

### Development
- **TypeScript 5** - Static type checking
- **ESLint 9** - Code quality linting
- **PostCSS 4** - CSS processing

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx              # Main portfolio home
│   │   └── layout.tsx            # Public layout
│   ├── (admin)/                  # Protected admin routes
│   │   ├── admin/                # Dashboard pages
│   │   │   ├── page.tsx          # Command center
│   │   │   ├── certifications/
│   │   │   ├── contacts/
│   │   │   ├── experiences/
│   │   │   ├── hobbies/
│   │   │   ├── messages/
│   │   │   ├── projects/
│   │   │   ├── skills/
│   │   │   └── resume/
│   │   └── login/                # Admin login page
│   ├── actions/                  # Server actions
│   │   ├── auth.ts               # Authentication logic
│   │   └── admin.ts              # Admin operations
│   ├── api/                      # API routes
│   │   ├── download/             # Resume download endpoint
│   │   └── skills/               # Skills API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── manifest.ts               # PWA manifest
│   ├── robots.ts                 # SEO robots.txt
│   └── sitemap.ts                # SEO sitemap
├── components/
│   ├── 3d/                       # 3D components
│   │   ├── HolographicCard.tsx   # Glowing card component
│   │   └── SkillSphere.tsx       # Interactive skill orb
│   ├── canvas/
│   │   └── Scene.tsx             # Main 3D scene
│   ├── sections/                 # Portfolio sections
│   │   ├── CertificationsSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── CVDownloadSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── HobbiesSection.tsx
│   │   └── SkillNetworkSection.tsx
│   └── ui/                       # Reusable UI components
│       ├── AudioPlayer.tsx
│       ├── CustomCursor.tsx
│       ├── Navbar.tsx
│       └── ScrollToTop.tsx
├── data/
│   └── skills.json               # Skill definitions
├── lib/
│   ├── constants.ts              # Scroll offsets & constants
│   ├── prisma.ts                 # Prisma client singleton
│   ├── session.ts                # Session management
│   └── types.ts                  # TypeScript type definitions
└── public/
    └── uploads/                  # User-uploaded files
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- SQLite (included with Node.js)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdullahHashmi663/portfolio-3js-purple.git
   cd portfolio-3js-purple
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database (SQLite)
   DATABASE_URL="file:./dev.db"
   
   # Session (can be any random string)
   SESSION_SECRET="your-super-secret-key-here"
   ```

4. **Initialize the database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed the database (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Set up admin credentials**
   
   Create an admin user by running the seed script:
   ```bash
   npm run seed
   ```
   
   Or manually use Prisma Studio:
   ```bash
   npx prisma studio
   ```
   
   Default credentials after seeding (change these immediately):
   - Username: `admin`
   - Password: `admin` (hashed with bcryptjs)

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the portfolio.

The page will auto-update as you edit files. The admin dashboard is accessible at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📚 Usage

### Public Portfolio
- Scroll through the interactive 3D portfolio
- Click on skill spheres to hear sci-fi sound effects
- Interact with the holographic UI elements
- Download your resume from the CV section
- View all your projects, experiences, and achievements

### Admin Dashboard

#### Login
Navigate to `/admin` and log in with your credentials.

#### Content Management
The admin dashboard provides easy interfaces for managing:

1. **Skills** - Add technical skills with categories and proficiency levels
2. **Projects** - Showcase your portfolio projects
3. **Experiences** - Add your work history and achievements
4. **Hobbies** - Share your interests and passions
5. **Certifications** - Display your professional certifications
6. **Hero Section** - Update your main title and bio
7. **Contact Links** - Add social media and contact information
8. **Resume** - Upload PDF/Word resume files

---

## 🛠️ Configuration

### Scroll Offsets
Edit `src/lib/constants.ts` to adjust the vertical positioning of sections for different screen sizes:

```typescript
export const OFFSETS = {
  mobile: {
    hero: 0,
    tech: 420,
    exp: 600,
    // ... more offsets
  },
  desktop: {
    hero: 0,
    tech: 300,
    exp: 480,
    // ... more offsets
  }
};
```

### Styling
- Tailwind CSS v4 is configured in `tailwind.config.ts`
- Global styles are in `src/app/globals.css`
- Custom CSS variables can be added to global styles for theming

### Security Headers
Edit `next.config.ts` to modify:
- Content Security Policy
- X-Frame-Options
- X-XSS-Protection
- Referrer Policy
- Permissions Policy

---

## 📊 Database Schema

### User Model
- `id`: Unique user ID
- `username`: Login username (unique)
- `password`: Hashed password

### Skill Model
- Technical skills with categories (Frontend, Backend, DevOps, etc.)
- Proficiency levels and project associations

### Project Model
- Portfolio projects with descriptions and links

### Experience Model
- Work history with timeline, team info, and tech stack

### Hobby Model
- Personal interests with custom colors and icons

### Certification Model
- Professional certifications with dates

### Hero Model
- Main introduction and bio section

### ContactLink Model
- Social media and contact information

---

## 🚀 Building for Production

```bash
npm run build
npm start
```

The app will be optimized and ready for deployment.

### Security Checklist Before Deployment
- [ ] Change default admin credentials
- [ ] Update `SESSION_SECRET` with a strong random string
- [ ] Review security headers in `next.config.ts`
- [ ] Enable HTTPS on your hosting platform
- [ ] Set up proper backup strategy for SQLite database
- [ ] Review environment variables in production

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
This Next.js app can be deployed to any platform supporting Node.js:
- Netlify
- Railway
- Heroku
- AWS Amplify
- DigitalOcean
- Google Cloud Run

**Note**: For persistent data, consider migrating from SQLite to PostgreSQL or MySQL for production.

---

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma migrate` | Create database migrations |
| `npx prisma studio` | Open Prisma Studio (database GUI) |

---

## 🔐 Authentication & Security

- Admin panel protected by session-based authentication
- Passwords hashed with bcryptjs
- Security headers configured for protection against common attacks
- Session tokens stored in HTTP-only cookies (secure by default)

---

## 🎨 3D Components

### SkillSphere
Interactive 3D sphere representing a technical skill. Features:
- Physics-enabled with collision detection
- Procedurally generated click sounds
- Hover effects with sparkle animation
- Customizable position and skill name

### HolographicCard
Glowing card component with holographic effects. Used for:
- Hobby cards
- Project cards
- Experience cards
- Certification cards

### Scene
Main 3D scene container that:
- Manages camera and lighting
- Handles scroll-based scene updates
- Renders all 3D objects
- Implements physics simulation

---

## 🐛 Troubleshooting

### Database Issues
- Reset database: `rm dev.db && npx prisma migrate dev --name init`
- View database: `npx prisma studio`

### Build Errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### 3D Performance
- Reduce number of skill spheres on lower-end devices
- Adjust Three.js renderer settings in Scene.tsx
- Use browser DevTools to profile performance

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Abdullah Bin Zubair Hashmi**

- GitHub: [@AbdullahHashmi663](https://github.com/AbdullahHashmi663)
- Portfolio: [Your Portfolio URL]

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Three.js](https://threejs.org/) for 3D graphics
- [Prisma](https://www.prisma.io/) for the ORM
- [Tailwind CSS](https://tailwindcss.com/) for utility styling
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) for Three.js integration
- [Framer Motion](https://www.framer.com/motion/) for animations

---

## 📞 Support

If you have any questions or run into issues, please:
- Check existing [GitHub Issues](https://github.com/AbdullahHashmi663/portfolio-3js-purple/issues)
- Create a new issue with detailed description
- Reach out via email or social media

---

**Happy coding! 🚀**
