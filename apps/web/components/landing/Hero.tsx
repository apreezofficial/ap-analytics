'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(53,120,247,0.25)] bg-[rgba(53,120,247,0.12)] text-[#7ab4ff] text-[11px] font-semibold font-sora tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-[#3578f7] shadow-[0_0_7px_#3578f7] shrink-0" />
      {children}
    </span>
  )
}

export function Hero() {
  const tl1Ref = useRef<HTMLSpanElement>(null)
  const tl2Ref = useRef<HTMLSpanElement>(null)
  const dotGridRef = useRef<HTMLDivElement>(null)

  /* ── Typing Animation ── */
  useEffect(() => {
    const lines = [
      { ref: tl1Ref, text: 'The privacy‑first alternative', startDelay: 350, speed: 50 },
      { ref: tl2Ref, text: 'to Google Analytics', startDelay: 0, speed: 62 },
    ]

    let cursor = 0
    function typeNext() {
      if (cursor >= lines.length) return
      const { ref, text, speed } = lines[cursor]
      const el = ref.current
      if (!el) return

      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        const span = document.createElement('span')
        span.className = 'typed-char'
        span.textContent = ch === ' ' ? '\u00A0' : ch
        el.appendChild(span)
        setTimeout(() => {
          span.classList.add('on')
          setTimeout(() => span.classList.add('dim'), 700)
        }, i * speed)
      }

      const nextDelay = text.length * speed + (lines[cursor + 1]?.startDelay ?? 0)
      cursor++
      setTimeout(typeNext, nextDelay)
    }

    const t = setTimeout(typeNext, lines[0].startDelay)
    return () => clearTimeout(t)
  }, [])

  /* ── Dot Grid ── */
  useEffect(() => {
    const grid = dotGridRef.current
    if (!grid) return
    grid.innerHTML = '' // Prevent doubling in dev
    const palette = ['#111828', '#111828', '#1a2a60', '#2a3caa', '#3050e0', '#1a2a60', '#111828', '#111828']
    for (let i = 0; i < 75; i++) {
      const d = document.createElement('div')
      d.className = 'dot rounded-full'
      d.style.cssText = `width:7px;height:7px;background:${palette[Math.floor(Math.random() * palette.length)]};animation-delay:${(3.4 + i * 0.022).toFixed(2)}s;opacity:0`
      grid.appendChild(d)
    }
  }, [])

  return (
    <section className="relative z-10 flex flex-col items-center text-center px-6 pt-8 pb-4 overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hero-glow">
        <div className="absolute w-[480px] h-[480px] rounded-full -left-[120px] top-[60px] bg-[radial-gradient(circle_at_60%_40%,rgba(53,120,247,0.55),rgba(26,79,214,0.3)_40%,transparent_72%)] blur-[80px] animate-orbpulse" />
        <div className="absolute w-[380px] h-[380px] rounded-full -right-[80px] top-[40px] bg-[radial-gradient(circle_at_40%_50%,rgba(53,120,247,0.45),rgba(26,79,214,0.22)_45%,transparent_70%)] blur-[70px] animate-orbpulse2" />
      </div>

      <div className="mb-6 opacity-0 [animation:fadeup_0.7s_cubic-bezier(.22,1,.36,1)_0.2s_forwards]">
        <Badge>Privacy‑first · No cookies · GDPR ready</Badge>
      </div>

      <h1 className="font-sora font-bold leading-[1.1] tracking-tight relative z-10 mb-5" style={{ fontSize: 'clamp(2.4rem,5.5vw,4rem)' }}>
        <span ref={tl1Ref} className="block whitespace-nowrap" />
        <span ref={tl2Ref} className="block whitespace-nowrap" />
      </h1>

      <p className="text-[#8892a4] leading-relaxed max-w-md font-light text-[0.94rem] opacity-0 relative z-10 [animation:fadeup_0.9s_cubic-bezier(.22,1,.36,1)_2.6s_forwards]">
        APAnalytics helps you understand your visitors with real‑time insights —<br className="hidden md:block" />
        no cookies, no personal data, no tracking banners.
      </p>

      <div className="flex flex-wrap gap-3 mt-8 justify-center opacity-0 relative z-10 [animation:fadeup_0.9s_cubic-bezier(.22,1,.36,1)_2.9s_forwards]">
        <Link
          href="/register"
          className="font-sora text-sm font-semibold px-7 py-3 rounded-xl bg-white text-[#07090f] hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5 shadow-xl shadow-white/10"
        >
          Start for free
        </Link>
        <Link
          href="#features"
          className="font-sora text-sm font-medium px-7 py-3 rounded-xl border border-[#3a4255] text-[#c8d0e0] hover:border-[#6a7898] hover:text-white transition-all hover:-translate-y-0.5"
        >
          View Demo
        </Link>
      </div>

      {/* ── Floating Dashboard Cards ── */}
      <div className="relative z-10 mt-20 w-full max-w-[940px] mx-auto flex items-end justify-center gap-5 pb-8" style={{ perspective: '1200px' }}>
        {/* Left Card – Visitors */}
        <div className="animate-floatA" style={{ animationDelay: '4.5s' }}>
          <div
            className="glass rounded-2xl p-5 w-56 shrink-0 shadow-2xl animate-cardrise"
            style={{ transform: 'perspective(1000px) rotateY(8deg) rotateX(3deg)', animationDelay: '3s' }}
          >
            <p className="text-[11px] font-sora font-semibold mb-0.5 text-white">Visitors</p>
            <p className="text-[9px] text-[#3a4255] tracking-widest mb-5 uppercase">32 countries</p>
            {[
              { flag: '🇺🇸', label: 'United States', count: '1,385', w: '72%', delay: '3.3s' },
              { flag: '🇩🇪', label: 'Germany', count: '590', w: '42%', delay: '3.5s' },
            ].map((row) => (
              <div key={row.flag} className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="flex items-center gap-2 text-[11px] text-white">
                    <span className="w-5 h-5 rounded-full bg-[#1e2540] flex items-center justify-center text-[9px]">{row.flag}</span>
                    {row.label}
                  </span>
                  <span className="text-[10px] text-[#8892a4] font-sora">{row.count}</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e2540] rounded-full overflow-hidden">
                  <div className="bar-fill h-full rounded-full bg-gradient-to-r from-[#4040c0] to-[#6080f0]" style={{ width: row.w, animationDelay: row.delay }} />
                </div>
              </div>
            ))}
            {/* Blurred rows */}
            {[{ label: 'United Kingdom', w: '28%' }, { label: 'Other regions', w: '18%' }].map((r, i) => (
              <div key={r.label} className={i === 1 ? 'opacity-60' : ''}>
                <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
                  <span className="w-5 h-5 rounded-full bg-[#141a30] flex items-center justify-center text-[9px] shrink-0">{i === 0 ? '🇬🇧' : '🌐'}</span>
                  <span className="text-[11px] text-[#2a3250] blur-[4px] select-none truncate">{r.label}</span>
                </div>
                <div className="h-1.5 bg-[#151b30] rounded-full overflow-hidden mb-3">
                  <div className="bar-fill h-full bg-[#1e2540] rounded-full" style={{ width: r.w, animationDelay: `${3.7 + i * 0.2}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centre Card – Profile */}
        <div className="animate-floatB" style={{ animationDelay: '4.8s' }}>
          <div
            className="glass rounded-2xl p-5 w-72 shrink-0 shadow-2xl animate-cardrise mb-4"
            style={{ transform: 'perspective(1000px) rotateY(0deg) rotateX(2deg) scale(1.04)', animationDelay: '3.2s' }}
          >
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-[#1a2040]">
              <div className="relative">
                <img src="https://i.pravatar.cc/48?img=12" alt="avatar" className="w-10 h-10 rounded-full ring-2 ring-[rgba(53,120,247,0.25)]" />
                <span className="absolute -bottom-1 -right-1 text-[10px]">🇺🇸</span>
              </div>
              <div>
                <p className="text-xs font-sora font-semibold text-white leading-tight">Ralph Edwards</p>
                <p className="text-[10px] text-[#8892a4] mt-0.5">🇺🇸 United States · 🖥 Mac OS</p>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-[9px] text-[#8892a4] font-sora mb-1.5">
                Fields <span className="text-[#3578f7] bg-[#1a2a50] px-1.5 py-0.5 rounded text-[8px]">4</span>
              </p>
              <div className="flex justify-between text-[9px]">
                <span className="text-[#8892a4]">_userid</span>
                <span className="text-[#4a5580] font-mono">22961f0c-c2c6…</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {['83%', '60%', '66%'].map((w, i) => (
                  <div key={i} className="h-1.5 bg-[#151b30] rounded" style={{ width: w }} />
                ))}
              </div>
            </div>
            <p className="text-[9px] text-[#8892a4] font-sora mb-2">Activity</p>
            <div ref={dotGridRef} id="dot-grid" className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(15,1fr)' }} />
          </div>
        </div>

        {/* Right Card – Metrics */}
        <div className="animate-floatC" style={{ animationDelay: '5s' }}>
          <div
            className="glass rounded-2xl p-5 w-52 shrink-0 shadow-2xl animate-cardrise"
            style={{ transform: 'perspective(1000px) rotateY(-8deg) rotateX(3deg)', animationDelay: '3.4s' }}
          >
            <p className="font-sora font-bold text-[2.1rem] leading-none text-white tracking-tight">18,579</p>
            <p className="text-[9px] text-[#8892a4] mt-1 mb-3">Up from last 30 days</p>
            <svg viewBox="0 0 180 74" className="w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a000" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#c9a000" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 64 L14 56 L28 60 L42 48 L56 52 L70 40 L84 44 L98 32 L112 36 L126 24 L140 19 L154 12 L168 8 L180 5 L180 74 L0 74Z" fill="url(#cg)" opacity=".75" />
              <path className="chart-line" d="M0 64 L14 56 L28 60 L42 48 L56 52 L70 40 L84 44 L98 32 L112 36 L126 24 L140 19 L154 12 L168 8 L180 5" fill="none" stroke="#c9a000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="126" cy="24" r="7" fill="#c9a000" fillOpacity=".2" opacity="0" style={{ animation: 'dotpop .5s ease 4.6s forwards' }} />
              <circle cx="126" cy="24" r="3.5" fill="#c9a000" opacity="0" style={{ animation: 'dotpop .4s ease 4.8s forwards' }} />
            </svg>
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 bg-[#1e2540] rounded w-full" />
              <div className="h-1.5 rounded w-4/5" style={{ background: 'rgba(201,160,0,.2)' }} />
              <div className="h-1.5 bg-[#1e2540] rounded w-3/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
