"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { Github, Linkedin, Mail, Twitter, MapPin, ArrowRight } from "lucide-react"
import { ContactModal } from "@/components/contact-modal"
import type { HeroData } from "@/lib/data"

interface FooterProps {
  footerData: HeroData | null;
}

// Default values used when no data is provided
const defaultFooterData = {
  email: "varunlambole@example.com",
  socialLinks: {
    github: "https://github.com/VarunLambole",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    website: "",
  },
  footerText: "",
};

// Magnetic social icon component
function MagneticSocialIcon({
  href,
  icon: Icon,
  label,
  color,
}: {
  href: string
  icon: React.ElementType
  label: string
  color: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  if (!href) return null

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className="relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors group"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      <motion.div
        animate={{
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <motion.div
          animate={{
            rotate: isHovered ? [0, -10, 10, 0] : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Icon
            className="w-7 h-7 transition-colors duration-300"
            style={{ color: isHovered ? color : undefined }}
          />
        </motion.div>
      </motion.div>
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
    </motion.a>
  )
}

// Magnetic contact button (opens modal instead of mailto)
function MagneticContactButton({
  onClick,
  icon: Icon,
  label,
  color,
}: {
  onClick: () => void
  icon: React.ElementType
  label: string
  color: string
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className="relative flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-colors group cursor-pointer"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      <motion.div
        animate={{
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <motion.div
          animate={{
            rotate: isHovered ? [0, -10, 10, 0] : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Icon
            className="w-7 h-7 transition-colors duration-300"
            style={{ color: isHovered ? color : undefined }}
          />
        </motion.div>
      </motion.div>
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
    </motion.button>
  )
}


/**
 * Footer Section Component
 * 
 * This component receives footer data as props from the parent server component.
 * No client-side fetching - data is pre-rendered at build time via ISR.
 */
export function Footer({ footerData }: FooterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [buttonHovered, setButtonHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Use provided data or fall back to defaults
  const data = {
    email: footerData?.email || defaultFooterData.email,
    socialLinks: footerData?.socialLinks || defaultFooterData.socialLinks,
    footerText: footerData?.footerText || defaultFooterData.footerText,
  };

  const handleButtonMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <footer id="contact" className="py-32 px-4 bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-500 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#6366F1]/5 blur-[200px] rounded-full" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#4F46E5]/5 blur-[200px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main CTA Section */}
        <div className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] dark:text-[#818CF8] text-sm font-mono mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              •// Let&apos;s Connect
            </motion.span>

            <h2 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
              Got a project in
              <br />
              <span className="bg-gradient-to-r from-[#818CF8] via-[#6366F1] to-[#4F46E5] bg-clip-text text-transparent">
                mind?
              </span>
            </h2>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-12">
              I&apos;m always excited to collaborate on web projects and bring your ideas to life with clean code and great design.
            </p>

            {/* Spotlight CTA Button */}
            <motion.button
              ref={buttonRef}
              onClick={() => setIsModalOpen(true)}
              onMouseMove={handleButtonMouseMove}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative inline-flex items-center gap-3 px-10 py-5 rounded-full font-semibold text-lg overflow-hidden bg-zinc-900 dark:bg-white text-white dark:text-black border border-zinc-800 dark:border-zinc-200"
            >
              {/* Spotlight effect */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{
                  background: buttonHovered
                    ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.4) 0%, transparent 50%)`
                    : "transparent",
                }}
                transition={{ duration: 0.15 }}
              />

              <span className="relative z-10 flex items-center gap-3">
                Contact Me
                <motion.span
                  animate={{ x: buttonHovered ? 5 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Social Links & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white leading-tight">
              Let&apos;s build something{" "}
              <span className="text-[#6366F1] dark:text-[#818CF8]">extraordinary</span>
              <br />
              together.
            </h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 text-zinc-600 dark:text-zinc-300 hover:text-[#6366F1] dark:hover:text-[#818CF8] transition-colors group cursor-pointer"
              >
                <div className="p-3 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-[#6366F1]/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-medium">Send me a message</span>
              </button>
              <div className="inline-flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                <div className="p-3 rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium">Available for Remote & On-site Work</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Social Icons Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-sm font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">
              Connect with me
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MagneticSocialIcon
                href={data.socialLinks.github || ""}
                icon={Github}
                label="GitHub"
                color="#6366F1"
              />
              <MagneticSocialIcon
                href={data.socialLinks.linkedin || ""}
                icon={Linkedin}
                label="LinkedIn"
                color="#0A66C2"
              />
              <MagneticSocialIcon
                href={data.socialLinks.twitter || ""}
                icon={Twitter}
                label="Twitter"
                color="#1DA1F2"
              />
              <MagneticContactButton
                onClick={() => setIsModalOpen(true)}
                icon={Mail}
                label="Email"
                color="#6366F1"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="mt-24 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-zinc-500">
            © 2025 Varun Lambole. All rights reserved.
          </p>
          <p className="text-sm text-zinc-500">
            Crafted with <span className="text-[#6366F1]">♥</span> and caffeine
          </p>
        </motion.div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </footer>
  )
}
