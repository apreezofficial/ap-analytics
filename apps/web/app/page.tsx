'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { TrustedBy } from '@/components/landing/TrustedBy'
import { Features } from '@/components/landing/Features'
import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  /* ── GLOBAL SCROLL REVEAL ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('shown')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen bg-[#07090f] text-white font-dm overflow-x-hidden star-bg antialiased">
      {/* ══ NAV ══ */}
      <Navbar />

      <main>
        {/* ══ HERO SECTION ══ */}
        <Hero />

        {/* ══ TRUSTED BY ══ */}
        <TrustedBy />

        {/* ══ BENEFITS & FEATURES ══ */}
        <Features />

        {/* ══ STATS & PRICING ══ */}
        <Pricing />
      </main>

      {/* ══ FOOTER ══ */}
      <Footer />
    </div>
  )
}
