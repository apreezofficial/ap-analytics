'use client'

import { useEffect, useState } from 'react'
import Link from 'next/image'
import NextLink from 'next/link'

function LogoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.5" fill="white" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-14 py-4 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[rgba(7,9,15,0.7)] backdrop-blur-xl border-b border-white/5 py-3' 
          : 'bg-transparent py-5'
      } animate-slidedown`}
    >
      <NextLink href="/" className="flex items-center gap-2 font-sora font-semibold text-white text-sm tracking-tight select-none group">
        <div className="w-8 h-8 rounded-lg bg-[rgba(53,120,247,0.15)] border border-[rgba(53,120,247,0.3)] flex items-center justify-center group-hover:bg-[rgba(53,120,247,0.25)] transition-colors">
          <LogoIcon size={18} />
        </div>
        APAnalytics
      </NextLink>

      <ul className="hidden md:flex gap-8 list-none">
        {[
          ['Features', '/features'],
          ['Pricing', '/#pricing'],
          ['Testimonials', '/testimonials'],
          ['Demo', '/demo'],
          ['Docs ↗', '#'],
        ].map(([label, href]) => (
          <li key={label}>
            <NextLink 
              href={href} 
              className="text-[13px] font-medium text-[#b0b8cc] hover:text-white transition-colors tracking-tight"
            >
              {label}
            </NextLink>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        <NextLink href="/login" className="hidden sm:block text-[13px] font-medium text-[#b0b8cc] hover:text-white transition-colors tracking-tight">
          Sign In
        </NextLink>
        <NextLink
          href="/register"
          className="font-sora text-[11px] font-bold px-6 py-2.5 rounded-xl bg-white text-[#07090f] hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5 shadow-lg shadow-white/5"
        >
          Start for free
        </NextLink>
      </div>
    </nav>
  )
}
