import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { ShaderAnimation } from "@/components/shader-hero"
import { About } from "@/components/about"
import { CursorEffect } from "@/components/cursor-effect"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { Navbar } from "@/components/navbar"
import { getAllPortfolioData } from "@/lib/data"

// Lazy load below-fold components for faster initial load
const BentoGrid = dynamic(() => import("@/components/bento-grid").then(mod => ({ default: mod.BentoGrid })), {
  loading: () => <SectionSkeleton />,
  ssr: true
})

const Experience = dynamic(() => import("@/components/experience").then(mod => ({ default: mod.Experience })), {
  loading: () => <SectionSkeleton />,
  ssr: true
})

const GithubProjects = dynamic(() => import("@/components/github-projects").then(mod => ({ default: mod.GithubProjects })), {
  loading: () => <SectionSkeleton />,
  ssr: true
})

const BlogsPapers = dynamic(() => import("@/components/blogs-papers").then(mod => ({ default: mod.BlogsPapers })), {
  loading: () => <SectionSkeleton />,
  ssr: true
})

const Certificates = dynamic(() => import("@/components/certificates").then(mod => ({ default: mod.Certificates })), {
  loading: () => <SectionSkeleton />,
  ssr: true
})

const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <SectionSkeleton />,
  ssr: true
})

// Skeleton component for loading states
function SectionSkeleton() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="h-32 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-32 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}

/**
 * Homepage - Server Component with ISR
 *
 * All portfolio data is fetched at build time and revalidated hourly.
 * This ensures instant page loads without any backend dependency at runtime.
 */
export default async function Home() {
  // Fetch all data at build time (ISR enabled - revalidates hourly)
  const { heroData, experiences, projects, blogs, certificates } = await getAllPortfolioData();

  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 selection:bg-[#6366F1]/30 dark:selection:bg-[#818CF8]/30 selection:text-zinc-900 dark:selection:text-white overflow-x-hidden cursor-none transition-colors duration-700">
      <ScrollProgress />
      <CursorEffect />

      {/* Critical above-fold content - loaded immediately */}
      <section id="hero">
        <ShaderAnimation heroData={heroData} />
      </section>

      <section id="about">
        <About data={heroData} />
      </section>

      {/* Below-fold content - lazy loaded with pre-fetched data */}
      <Suspense fallback={<SectionSkeleton />}>
        <section id="experience">
          <Experience experiences={experiences} />
        </section>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <section id="skills">
          <BentoGrid heroData={heroData} />
        </section>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <section id="projects">
          <GithubProjects projects={projects} />
        </section>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <section id="blogs">
          <BlogsPapers blogs={blogs} />
        </section>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <section id="certificates">
          <Certificates certificates={certificates} />
        </section>
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <section id="contact">
          <Footer footerData={heroData} />
        </section>
      </Suspense>

      <Navbar />
    </main>
  )
}
