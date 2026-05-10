"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Home, User, Briefcase, Zap, GitFork,
  Award, BookOpen, Mail, Sun, Moon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { LimelightNav } from "@/components/ui/limelight-nav"

// ─── Scroll-spy helper ────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "hero", label: "Home", icon: <Home /> },
  { id: "about", label: "About", icon: <User /> },
  { id: "skills", label: "Skills", icon: <Zap /> },
  { id: "experience", label: "Experience", icon: <Briefcase /> },
  { id: "projects", label: "Projects", icon: <GitFork /> },
  { id: "blogs", label: "Blog", icon: <BookOpen /> },
  { id: "certificates", label: "Certificates", icon: <Award /> },
  { id: "contact", label: "Contact", icon: <Mail /> },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

function useActiveSection() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id)
            if (idx !== -1) setActive(idx)
          }
        })
      },
      { threshold: 0.4 }
    )

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return active
}

// ─── Theme toggle button ──────────────────────────────────────────────────────

function ThemeButton() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="flex items-center justify-center w-9 h-9 rounded-lg
        text-zinc-600 dark:text-zinc-300
        hover:bg-white/20 dark:hover:bg-white/10
        transition-colors duration-200"
    >
      {resolvedTheme === "dark"
        ? <Sun className="w-[18px] h-[18px]" />
        : <Moon className="w-[18px] h-[18px]" />
      }
    </button>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const activeIndex = useActiveSection()

  const navItems = SECTIONS.map(({ id, label, icon }) => ({
    id,
    label,
    icon,
    onClick: () => scrollTo(id),
  }))

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
    >
      <LimelightNav
        items={navItems}
        defaultActiveIndex={activeIndex}
        onTabChange={() => { }}
      />

      {/* Divider + theme toggle */}
      <div
        className="flex items-center px-1.5 h-14 rounded-xl
          bg-white/10 dark:bg-black/20
          backdrop-blur-2xl
          border border-white/20 dark:border-white/10
          shadow-2xl"
      >
        <ThemeButton />
      </div>
    </motion.header>
  )
}
