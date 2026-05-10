"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { HeroData } from "@/lib/data"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Skill {
  name: string
  icon: string
  category?: string
}

interface BentoGridProps {
  heroData?: HeroData | null
}

// ─── Fallback tech stack (used when no admin data is available) ───────────────

const FALLBACK_SKILLS: Skill[] = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", category: "Frontend" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", category: "Frontend" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", category: "Language" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", category: "Backend" },
  { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", category: "Backend" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", category: "Database" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", category: "Language" },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", category: "Frontend" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", category: "Frontend" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", category: "Frontend" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", category: "Tools" },
  { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", category: "Design" },
]

// Category badge colours
const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Backend:  "bg-green-500/10 text-green-400 border-green-500/20",
  Language: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Database: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Design:   "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Tools:    "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function BentoGrid({ heroData }: BentoGridProps) {
  const skills: Skill[] = (heroData?.skills && heroData.skills.length > 0)
    ? heroData.skills
    : FALLBACK_SKILLS

  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Split into 3 staggered columns
  const col1 = skills.filter((_, i) => i % 3 === 0)
  const col2 = skills.filter((_, i) => i % 3 === 1)
  const col3 = skills.filter((_, i) => i % 3 === 2)

  return (
    <section id="skills" className="py-24 md:py-32 px-4 bg-white dark:bg-black transition-colors duration-700">
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8] text-sm font-mono mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {"•// Skills & Technologies"}
          </motion.span>
          <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white">
            Skills &amp; Technologies
          </h3>
        </motion.div>

        {/* ── Showcase: photo grid left + list right ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16 select-none"
        >
          {/* ── Left: staggered logo grid ── */}
          <div className="flex gap-2.5 md:gap-3 flex-shrink-0 overflow-x-auto pb-2 lg:pb-0">
            {/* Column 1 — top aligned */}
            <div className="flex flex-col gap-2.5 md:gap-3">
              {col1.map((skill) => (
                <TechCard
                  key={skill.name}
                  skill={skill}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[145px] md:h-[145px]"
                />
              ))}
            </div>

            {/* Column 2 — offset down */}
            <div className="flex flex-col gap-2.5 md:gap-3 mt-[52px] sm:mt-[62px] md:mt-[74px]">
              {col2.map((skill) => (
                <TechCard
                  key={skill.name}
                  skill={skill}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  className="w-[112px] h-[112px] sm:w-[134px] sm:h-[134px] md:w-[160px] md:h-[160px]"
                />
              ))}
            </div>

            {/* Column 3 — offset down less */}
            <div className="flex flex-col gap-2.5 md:gap-3 mt-[24px] sm:mt-[30px] md:mt-[36px]">
              {col3.map((skill) => (
                <TechCard
                  key={skill.name}
                  skill={skill}
                  hoveredId={hoveredId}
                  onHover={setHoveredId}
                  className="w-[106px] h-[106px] sm:w-[126px] sm:h-[126px] md:w-[152px] md:h-[152px]"
                />
              ))}
            </div>
          </div>

          {/* ── Right: skill name list ── */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-5 pt-0 lg:pt-2 flex-1 w-full">
            {skills.map((skill) => (
              <SkillRow
                key={skill.name}
                skill={skill}
                hoveredId={hoveredId}
                onHover={setHoveredId}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Tech logo card (replaces photo card) ────────────────────────────────────

function TechCard({
  skill,
  className,
  hoveredId,
  onHover,
}: {
  skill: Skill
  className: string
  hoveredId: string | null
  onHover: (id: string | null) => void
}) {
  const isActive = hoveredId === skill.name
  const isDimmed = hoveredId !== null && !isActive

  return (
    <div
      className={[
        "overflow-hidden rounded-2xl cursor-pointer flex-shrink-0",
        "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
        "flex flex-col items-center justify-center gap-2 p-3",
        "transition-all duration-300",
        isActive
          ? "ring-2 ring-[#6366F1]/60 shadow-lg shadow-[#6366F1]/10 scale-[1.04]"
          : "",
        isDimmed ? "opacity-40 scale-[0.97]" : "opacity-100",
        className,
      ].join(" ")}
      onMouseEnter={() => onHover(skill.name)}
      onMouseLeave={() => onHover(null)}
    >
      <img
        src={skill.icon}
        alt={skill.name}
        className="w-[40%] h-[40%] object-contain transition-[filter,transform] duration-400"
        style={{
          filter: isActive
            ? "grayscale(0) brightness(1) drop-shadow(0 0 8px rgba(99,102,241,0.4))"
            : "grayscale(0.3) brightness(0.8)",
          transform: isActive ? "scale(1.1)" : "scale(1)",
        }}
      />
      <span
        className={[
          "text-[10px] md:text-xs font-semibold text-center leading-tight transition-colors duration-300",
          isActive
            ? "text-zinc-900 dark:text-white"
            : "text-zinc-500 dark:text-zinc-500",
        ].join(" ")}
      >
        {skill.name}
      </span>
    </div>
  )
}

// ─── Skill name row (replaces MemberRow) ─────────────────────────────────────

function SkillRow({
  skill,
  hoveredId,
  onHover,
}: {
  skill: Skill
  hoveredId: string | null
  onHover: (id: string | null) => void
}) {
  const isActive = hoveredId === skill.name
  const isDimmed = hoveredId !== null && !isActive
  const categoryClass =
    skill.category
      ? CATEGORY_COLORS[skill.category] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
      : null

  return (
    <div
      className={[
        "cursor-pointer transition-opacity duration-300",
        isDimmed ? "opacity-40" : "opacity-100",
      ].join(" ")}
      onMouseEnter={() => onHover(skill.name)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Name + category badge */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Animated accent bar */}
        <span
          className={[
            "rounded-[5px] flex-shrink-0 transition-all duration-300 bg-[#6366F1]",
            isActive ? "w-5 h-3 opacity-100" : "w-4 h-3 opacity-25",
          ].join(" ")}
        />

        {/* Skill name */}
        <span
          className={[
            "text-base md:text-[18px] font-semibold leading-none tracking-tight transition-colors duration-300",
            isActive
              ? "text-zinc-900 dark:text-white"
              : "text-zinc-700 dark:text-zinc-300",
          ].join(" ")}
        >
          {skill.name}
        </span>

        {/* Category badge — slides in on hover */}
        {categoryClass && (
          <span
            className={[
              "px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest border transition-all duration-300",
              categoryClass,
              isActive
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none",
            ].join(" ")}
          >
            {skill.category}
          </span>
        )}
      </div>

      {/* Animated underline */}
      <div className="mt-1.5 pl-[27px]">
        <div
          className={[
            "h-px bg-[#6366F1]/40 transition-all duration-500 rounded-full",
            isActive ? "w-full opacity-100" : "w-0 opacity-0",
          ].join(" ")}
        />
      </div>
    </div>
  )
}
