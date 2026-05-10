/**
 * Server-Side Data Fetching Layer
 * 
 * This module provides functions to fetch portfolio data at build time
 * with Incremental Static Regeneration (ISR) enabled.
 * 
 * - Data is fetched during static generation
 * - Pages revalidate every hour (3600 seconds)
 * - Backend cold starts don't affect visitors
 * - All users see the same cached content
 */

// Use the server-side API URL (not the client proxy)
const API_URL = process.env.API_URL || 'http://localhost:5000';

// Revalidate every hour (3600 seconds)
// Set to 0 for development to always fetch fresh data
const REVALIDATE_SECONDS = process.env.NODE_ENV === 'production' ? 3600 : 60;

// ==========================================
// Type Definitions
// ==========================================

export interface HeroData {
    heroTitle?: string;
    heroSubtitle?: string;
    aboutTitle?: string;
    aboutSubtitle?: string;
    aboutDescription?: string;
    email?: string;
    socialLinks?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
    };
    footerText?: string;
    skills?: Array<{ name: string; icon: string }>;
    resumeUrl?: string;
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    githubUrl?: string;
    category: "project" | "internship" | "job";
    featured: boolean;
    image?: string;
}

export interface Blog {
    _id: string;
    title: string;
    summary?: string;
    content?: string;
    author?: string;
    image?: string;
    date?: string;
    createdAt?: string;
    tags: string[];
    slug?: string;
}

export interface Certificate {
    _id: string;
    title: string;
    serialId: string;
    image: string;
    pdf?: string;
}

export interface Experience {
    _id: string;
    company: string;
    role: string;
    period: string;
    description: string;
    tags: string[];
    order: number;
}

// ==========================================
// Fallback Data (used when API is unavailable)
// ==========================================

const fallbackHeroData: HeroData = {
    heroTitle: "Varun Lambole",
    heroSubtitle: "Web Developer • UI/UX Designer",
    aboutTitle: "// About Me",
    aboutSubtitle: "I craft seamless digital experiences — from robust backends to polished, pixel-perfect interfaces.",
    aboutDescription: "I'm a full-stack web developer well-versed in the MERN stack (MongoDB, Express.js, React, Node.js). I love building products that are as solid under the hood as they are beautiful on the surface.\n\nMy journey spans both frontend and backend development — designing intuitive UI/UX flows with React and then powering them with scalable Node.js APIs and MongoDB databases.\n\nI have hands-on internship experience working with real-world clients and teams, which has sharpened my ability to deliver production-ready solutions on time.\n\nWhen I'm not building apps, I'm exploring new frontend frameworks, contributing to open-source projects, or leveling up my design skills.",
    email: "varunlambole@example.com",
    socialLinks: {
        github: "https://github.com/VarunLambole",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        website: "",
    },
    footerText: "",
};

const fallbackExperiences: Experience[] = [
    {
        _id: "1",
        company: "Neotechking Global Solutions Private Limited",
        role: "Web Development Intern",
        period: "Jan 2026 – Jun 2026",
        description: "Working as a Web Development intern, contributing to full-stack features using the MERN stack. Involved in building RESTful APIs with Node.js and Express, designing responsive React UIs, and integrating MongoDB databases for client-facing web applications.",
        tags: ["React", "Node.js", "Express", "MongoDB", "MERN"],
        order: 0,
    },
    {
        _id: "2",
        company: "Sphurti WebApp Pvt Ltd",
        role: "Frontend Developer Intern",
        period: "Feb 2025 – Jul 2025",
        description: "6-month frontend internship focused on building and optimizing responsive web interfaces. Worked with modern frontend technologies to deliver pixel-perfect, accessible, and performant UI components for production web applications.",
        tags: ["HTML", "CSS", "JavaScript", "React", "UI/UX"],
        order: 1,
    },
];

const fallbackCertificates: Certificate[] = [
    {
        _id: "1",
        title: "Oracle Certified AI Foundation Associate",
        serialId: "OCI-AI-2024",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
    },
    {
        _id: "2",
        title: "Microsoft Azure AI Fundamentals",
        serialId: "AZ-900-AI",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    },
    {
        _id: "3",
        title: "AWS Certified Machine Learning",
        serialId: "AWS-ML-2024",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    },
];

const fallbackBlogs: Blog[] = [
    {
        _id: "1",
        title: "Optimizing Transformer Inference",
        summary: "A deep dive into KV-cache optimization and quantization techniques for serving LLMs at scale.",
        date: "2024-03-15",
        tags: ["Paper", "LLM", "Systems"],
        slug: "optimizing-transformer-inference"
    },
    {
        _id: "2",
        title: "The Future of Agentic AI",
        summary: "Exploring how autonomous agents will reshape software engineering workflows.",
        date: "2024-02-10",
        tags: ["Article", "Agents", "Future"],
        slug: "future-of-agentic-ai"
    }
];

// ==========================================
// Data Fetching Functions
// ==========================================

/**
 * Fetch hero/about data with ISR caching
 */
export async function getHeroData(): Promise<HeroData> {
    try {
        const res = await fetch(`${API_URL}/api/hero`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!res.ok) {
            console.warn(`[ISR] Hero fetch failed with status ${res.status}, using fallback`);
            return fallbackHeroData;
        }

        const json = await res.json();
        return json.data || fallbackHeroData;
    } catch (error) {
        console.warn('[ISR] Hero fetch error, using fallback:', error);
        return fallbackHeroData;
    }
}

/**
 * Fetch projects with ISR caching
 */
export async function getProjects(): Promise<Project[]> {
    try {
        const res = await fetch(`${API_URL}/api/projects`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!res.ok) {
            console.warn(`[ISR] Projects fetch failed with status ${res.status}`);
            return [];
        }

        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.warn('[ISR] Projects fetch error:', error);
        return [];
    }
}

/**
 * Fetch blogs with ISR caching
 */
export async function getBlogs(): Promise<Blog[]> {
    try {
        const res = await fetch(`${API_URL}/api/blogs`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!res.ok) {
            console.warn(`[ISR] Blogs fetch failed with status ${res.status}, using fallback`);
            return fallbackBlogs;
        }

        const json = await res.json();
        return json.data && json.data.length > 0 ? json.data : fallbackBlogs;
    } catch (error) {
        console.warn('[ISR] Blogs fetch error, using fallback:', error);
        return fallbackBlogs;
    }
}

/**
 * Fetch certificates with ISR caching
 */
export async function getCertificates(): Promise<Certificate[]> {
    try {
        const res = await fetch(`${API_URL}/api/certificates`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!res.ok) {
            console.warn(`[ISR] Certificates fetch failed with status ${res.status}, using fallback`);
            return fallbackCertificates;
        }

        const json = await res.json();
        return json.data && json.data.length > 0 ? json.data : fallbackCertificates;
    } catch (error) {
        console.warn('[ISR] Certificates fetch error, using fallback:', error);
        return fallbackCertificates;
    }
}

/**
 * Fetch experiences with ISR caching
 */
export async function getExperiences(): Promise<Experience[]> {
    try {
        const res = await fetch(`${API_URL}/api/experiences`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });

        if (!res.ok) {
            console.warn(`[ISR] Experiences fetch failed with status ${res.status}, using fallback`);
            return fallbackExperiences;
        }

        const json = await res.json();
        return json.data && json.data.length > 0 ? json.data : fallbackExperiences;
    } catch (error) {
        console.warn('[ISR] Experiences fetch error, using fallback:', error);
        return fallbackExperiences;
    }
}

/**
 * Fetch all portfolio data in parallel (for homepage)
 */
export async function getAllPortfolioData() {
    const [heroData, experiences, projects, blogs, certificates] = await Promise.all([
        getHeroData(),
        getExperiences(),
        getProjects(),
        getBlogs(),
        getCertificates(),
    ]);

    return {
        heroData,
        experiences,
        projects,
        blogs,
        certificates,
    };
}
