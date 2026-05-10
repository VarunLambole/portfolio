"use client"

import React, { useState, useEffect, useRef, useLayoutEffect, cloneElement } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  id: string | number
  icon: React.ReactElement<{ className?: string }>
  label?: string
  onClick?: () => void
}

type LimelightNavProps = {
  items?: NavItem[]
  defaultActiveIndex?: number
  onTabChange?: (index: number) => void
  className?: string
  limelightClassName?: string
  iconContainerClassName?: string
  iconClassName?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * An adaptive-width navigation bar with a "limelight" spotlight effect
 * that slides to highlight the active item.
 */
export function LimelightNav({
  items = [],
  defaultActiveIndex = 0,
  onTabChange,
  className = '',
  limelightClassName = '',
  iconContainerClassName = '',
  iconClassName = '',
}: LimelightNavProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex)
  const [isReady, setIsReady] = useState(false)

  // Keep internal activeIndex in sync when the parent updates it (scroll-spy)
  useEffect(() => {
    setActiveIndex(defaultActiveIndex)
  }, [defaultActiveIndex])
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const limelightRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (items.length === 0) return
    const limelight = limelightRef.current
    const activeItem = navItemRefs.current[activeIndex]
    if (limelight && activeItem) {
      const newLeft =
        activeItem.offsetLeft +
        activeItem.offsetWidth / 2 -
        limelight.offsetWidth / 2
      limelight.style.left = `${newLeft}px`
      if (!isReady) setTimeout(() => setIsReady(true), 50)
    }
  }, [activeIndex, isReady, items])

  if (items.length === 0) return null

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setActiveIndex(index)
    onTabChange?.(index)
    itemOnClick?.()
  }

  return (
    <nav
      className={`relative inline-flex items-center h-14 rounded-xl
        bg-white/10 dark:bg-black/20
        backdrop-blur-2xl
        border border-white/20 dark:border-white/10
        shadow-2xl px-2 ${className}`}
    >
      {items.map(({ id, icon, label, onClick }, index) => (
        <a
          key={id}
          ref={el => { navItemRefs.current[index] = el }}
          className={`relative z-20 flex h-full cursor-pointer items-center
            justify-center px-4 gap-2 select-none ${iconContainerClassName}`}
          onClick={() => handleItemClick(index, onClick)}
          aria-label={label}
          title={label}
        >
          {cloneElement(icon, {
            className: `w-[18px] h-[18px] transition-all duration-200
              ${activeIndex === index
                ? 'opacity-100 text-zinc-900 dark:text-white'
                : 'opacity-40 text-zinc-900 dark:text-white'}
              ${icon.props.className || ''} ${iconClassName}`,
          })}
          {label && (
            <span
              className={`hidden md:inline-block text-[13px] font-medium
                transition-all duration-200 leading-none
                ${activeIndex === index
                  ? 'opacity-100 text-zinc-900 dark:text-white'
                  : 'opacity-40 text-zinc-900 dark:text-white'}`}
            >
              {label}
            </span>
          )}
        </a>
      ))}

      {/* Limelight bar + beam */}
      <div
        ref={limelightRef}
        className={`absolute top-0 z-10 w-11 h-[3px] rounded-full
          bg-[#6366F1]
          shadow-[0_0_20px_4px_rgba(99,102,241,0.6)]
          ${isReady ? 'transition-[left] duration-300 ease-in-out' : ''}
          ${limelightClassName}`}
        style={{ left: '-999px' }}
      >
        {/* Light beam cone */}
        <div
          className="absolute left-[-30%] top-[3px] w-[160%] h-12
            [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)]
            bg-gradient-to-b from-[#6366F1]/30 to-transparent
            pointer-events-none"
        />
      </div>
    </nav>
  )
}
