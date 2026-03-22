'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { LogoIcon } from './Icons'
import { TypingTitle } from './TypingTitle'

function SectionTag({ children }: { children: string }) {
  return <p className="font-sora text-xs font-semibold text-[#7060e0] tracking-wider mb-3 uppercase">{children}</p>
}

export function Features() {
  const dashSvgRef = useRef<SVGSVGElement>(null)
  const ddBar1Ref = useRef<HTMLDivElement>(null)
  const ddBar2Ref = useRef<HTMLDivElement>(null)

  /* ── Deep-dive observer ── */
  useEffect(() => {
    const section = document.getElementById('deepdive')
    if (!section) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (ddBar1Ref.current) ddBar1Ref.current.style.width = '72%'
            if (ddBar2Ref.current) ddBar2Ref.current.style.width = '34%'
            io.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  /* ── Dashboard SVG Observer ── */
  useEffect(() => {
    const svg = dashSvgRef.current
    if (!svg) return
    const area = svg.querySelector<SVGPathElement>('#area1')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            svg.querySelectorAll<SVGPathElement>('.chart-line-preview').forEach((l, i) => {
              l.style.strokeDasharray = '700'
              l.style.strokeDashoffset = '700'
              l.style.opacity = i === 1 ? '0.7' : '1'
              l.style.transition = `stroke-dashoffset 2.8s ease ${i * 0.4}s, opacity .5s ease`
              requestAnimationFrame(() => {
                l.style.strokeDashoffset = '0'
              })
            })
            if (area) {
              area.style.opacity = '0.75'
              area.style.transition = 'opacity 1.5s ease .5s'
            }
            io.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    io.observe(svg)
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* ── BENEFITS ── */}
      <section className="relative z-10 py-20 px-6 md:px-14" id="benefits">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 reveal">
            <SectionTag>Benefits</SectionTag>
            <TypingTitle className="font-sora font-bold text-4xl md:text-5xl text-white leading-tight tracking-tight mb-4 min-h-[120px]">
              More than just analytics. It&apos;s peace of mind
            </TypingTitle>
            <p className="text-[#8892a4] text-sm leading-relaxed max-w-lg">
              APAnalytics helps you gain valuable insights without sacrificing speed, privacy, or user trust
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '🧠',
                gradient: 'from-[rgba(80,100,200,0.5)] to-[rgba(120,80,220,0.5)]',
                title: 'No more cookie banners',
                desc: "Because APAnalytics doesn't use cookies or track personal data, you can finally remove annoying consent popups, and still stay compliant",
                delay: '0s',
              },
              {
                icon: '⚡',
                gradient: 'from-[rgba(80,120,220,0.55)] to-[rgba(60,160,220,0.55)]',
                title: 'Fast websites, happy users',
                desc: "Our ultra-light script won't drag your load time. That means better SEO, lower bounce rates, and smoother user experiences",
                delay: '0.1s',
              },
              {
                icon: null,
                gradient: 'from-[rgba(100,80,200,0.55)] to-[rgba(130,80,180,0.55)]',
                title: 'Clear insights, instantly',
                desc: 'No complex UI or cluttered reports. Just the metrics you actually need, in real‑time, right when you open your dashboard',
                delay: '0.18s',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="reveal group p-7 rounded-2xl bg-[rgba(12,16,32,0.75)] border border-white/[0.07] hover:border-[rgba(100,140,255,0.3)] hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(26,79,214,0.2)] transition-all duration-300"
                style={{ transitionDelay: card.delay }}
              >
                <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center bg-gradient-to-br ${card.gradient} shadow-[0_4px_20px_rgba(100,80,220,0.3)] text-2xl mb-6`}>
                  {card.icon ?? (
                    <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <line x1="8" y1="17" x2="8" y2="13" />
                      <line x1="12" y1="17" x2="12" y2="8" />
                      <line x1="16" y1="17" x2="16" y2="11" />
                    </svg>
                  )}
                </div>
                <h3 className="font-sora font-semibold text-white text-base mb-3 leading-tight tracking-tight">{card.title}</h3>
                <p className="text-[#8892a4] text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="relative z-10 py-20 px-6 md:px-14" id="features">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 reveal max-w-2xl">
            <SectionTag>Features</SectionTag>
            <TypingTitle className="font-sora font-bold text-4xl md:text-5xl text-white leading-[1.15] tracking-tight mb-4 min-h-[140px]">
              Powerful features designed for privacy‑first, modern web analytics
            </TypingTitle>
            <p className="text-[#8892a4] text-sm leading-relaxed max-w-lg mb-6">
              APAnalytics gives you clean, real‑time insights without cookies, without complexity, and without compromising your users&apos; privacy
            </p>
            <Link href="#" className="inline-flex items-center gap-2 text-sm text-white font-sora font-medium hover:gap-3 transition-all group">
              Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="relative reveal" style={{ transitionDelay: '.1s' }}>
            {/* Floating icon badges */}
            {[
              { style: { top: '-1.5rem', left: '42%', animationDelay: '.3s' }, bg: 'from-[rgba(40,60,160,0.9)] to-[rgba(60,40,140,0.9)]', icon: <svg width="28" height="28" fill="none" stroke="rgba(120,160,255,0.9)" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
              { style: { top: '-0.5rem', right: '14%', animationDelay: '.8s' }, bg: 'from-[rgba(50,50,180,0.9)] to-[rgba(80,50,160,0.9)]', icon: <svg width="28" height="28" fill="none" stroke="rgba(140,160,255,0.9)" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/></svg> },
            ].map((b, i) => (
              <div key={i} className={`absolute z-20 w-14 h-14 rounded-[18px] flex items-center justify-center bg-gradient-to-br ${b.bg} border border-[rgba(100,140,255,0.3)] shadow-[0_8px_32px_rgba(26,79,214,0.4)] backdrop-blur-sm animate-iconFloat`}
                   style={b.style}>
                {b.icon}
              </div>
            ))}

            <div className="rounded-[20px] overflow-hidden bg-[rgba(8,12,28,0.92)] border border-[rgba(53,100,200,0.25)] shadow-[0_0_0_1px_rgba(53,120,247,0.08),0_24px_80px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2040] flex-wrap gap-2">
                <span className="font-sora font-semibold text-sm flex items-center gap-2 text-white">
                  <LogoIcon size={16} />
                  APAnalytics
                </span>
                <div className="flex items-center gap-2 text-[10px] text-[#8892a4] flex-wrap">
                  {['📅 Aug 20 to Aug 25, 2025', 'Compared to', '▦ No Comparison', '▤ Auto'].map((t) => (
                    <span key={t} className="px-2 py-1 bg-[#111828] rounded border border-[#1e2540]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-[#1a2040]">
                {[
                  { val: '16', label: 'Realtime' },
                  { val: '50.9K', label: 'People' },
                  { val: '100.24K', label: 'Views' },
                  { val: '00:25', label: 'Avg time on site' },
                  { val: '90.5%', label: 'Bounce rate' },
                  { val: '2.45K', label: 'Event completions' },
                ].map((s) => (
                  <div key={s.label} className="bg-[#080c1c] px-3.5 py-4 flex flex-col gap-0.5">
                    <span className="font-sora font-bold text-white text-lg leading-none">{s.val}</span>
                    <span className="text-[9px] text-[#8892a4] uppercase font-medium tracking-wider">{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-6 bg-[#070b1a]">
                <div className="flex">
                  <div className="flex flex-col justify-between text-[9px] text-[#3a4255] pr-4 h-40">
                    <span>10K</span><span>7K</span><span>5K</span><span>3K</span><span>1K</span>
                  </div>
                  <div className="flex-1">
                    <svg ref={dashSvgRef} viewBox="0 0 820 160" className="w-full h-40" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4060c0" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#4060c0" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[0, 32, 64, 96, 128].map((y) => (
                        <line key={y} x1="0" y1={y} x2="820" y2={y} stroke="#1a2040" strokeWidth="1" />
                      ))}
                      <path
                        id="area1"
                        d="M0 100 L55 110 L110 95 L165 105 L220 88 L275 98 L330 80 L385 90 L440 70 L495 82 L550 65 L605 55 L660 75 L715 30 L770 20 L820 15 L820 160 L0 160Z"
                        fill="url(#lg1)"
                        opacity="0"
                      />
                      <path
                        className="chart-line-preview"
                        d="M0 100 L55 110 L110 95 L165 105 L220 88 L275 98 L330 80 L385 90 L440 70 L495 82 L550 65 L605 55 L660 75 L715 30 L770 20 L820 15"
                        fill="none"
                        stroke="#5070e0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        className="chart-line-preview"
                        d="M0 90 L55 95 L110 88 L165 94 L220 85 L275 90 L330 82 L385 88 L440 78 L495 85 L550 75 L605 70 L660 80 L715 60 L770 55 L820 50"
                        fill="none"
                        stroke="#4a5580"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="6 4"
                        opacity="0"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-between text-[9px] text-[#3a4255] pl-10 mt-2">
                  {['Aug 20', 'Aug 21', 'Aug 22', 'Aug 23', 'Aug 24', 'Aug 25'].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEEP DIVE ── */}
      <section className="relative z-10 py-20 px-6 md:px-14" id="deepdive">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Privacy card */}
          <div className="reveal flex flex-col" style={{ transitionDelay: '.04s' }}>
            <div className="mb-6">
              <TypingTitle className="font-sora font-bold text-xl text-white mb-3 tracking-tight">Privacy‑first by design</TypingTitle>
              <p className="text-[#8892a4] text-sm leading-relaxed mb-4">
                APAnalytics doesn&apos;t use cookies or store personal data. You stay fully compliant with GDPR, CCPA, and other privacy laws — without needing consent banners
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-sm text-white font-sora font-medium hover:gap-3 transition-all group">
                Learn More <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </div>
            <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[260px] bg-gradient-to-br from-[#0a0e1e] to-[#0e1428] border border-[rgba(53,80,180,0.2)]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(53,80,180,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(53,80,180,.15) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[180px] h-[180px] bg-[radial-gradient(circle,rgba(80,60,200,0.45),rgba(40,30,160,0.2)_45%,transparent_72%)] blur-[24px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="110" height="126" viewBox="0 0 110 126" fill="none">
                  <path d="M55 4L8 22V60C8 88 28 112 55 122C82 112 102 88 102 60V22L55 4Z" fill="rgba(20,16,50,0.9)" stroke="rgba(100,80,220,0.6)" strokeWidth="2"/>
                  <path d="M55 14L18 29V60C18 83 34 103 55 112C76 103 92 83 92 60V29L55 14Z" fill="rgba(30,22,70,0.8)" stroke="rgba(100,80,220,0.25)" strokeWidth="1"/>
                  <rect x="43" y="55" width="24" height="20" rx="3" fill="rgba(100,80,220,0.5)" stroke="rgba(140,120,255,0.6)" strokeWidth="1.5"/>
                  <path d="M48 55V49C48 45.7 51.1 43 55 43C58.9 43 62 45.7 62 49V55" stroke="rgba(140,120,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <circle cx="55" cy="65" r="3" fill="rgba(160,140,255,0.9)"/>
                  <circle cx="55" cy="62" r="32" stroke="rgba(90,60,200,0.2)" strokeWidth="18" fill="none"/>
                </svg>
              </div>
              <div className="absolute left-6 bottom-10 animate-floatA" style={{ animationDuration: '4s' }}>
                <div className="rounded-[14px] p-2.5 bg-gradient-to-br from-[rgba(50,40,120,0.95)] to-[rgba(70,50,160,0.95)] border border-[rgba(100,80,200,0.4)] shadow-[0_8px_28px_rgba(60,40,160,0.35)]">
                  <div className="grid grid-cols-3 gap-1.5">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-sm flex items-center justify-center text-[8px] ${i === 0 || i === 4 ? 'bg-[rgba(100,80,200,0.6)]' : 'bg-[rgba(80,60,180,0.5)]'}`}>{i === 0 ? '⚙' : ''}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute right-6 bottom-12 animate-floatB" style={{ animationDuration: '5.5s' }}>
                <div className="rounded-[10px] px-3 py-1.5 bg-[rgba(10,12,28,0.95)] border border-[rgba(80,100,200,0.35)] flex flex-col gap-0.5 shadow-xl">
                  <p className="text-[9px] font-sora font-bold text-[#8892a4] uppercase tracking-tighter">GDPR</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-[9px] font-sora text-white">Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Realtime card */}
          <div className="reveal flex flex-col" style={{ transitionDelay: '.12s' }}>
            <div className="mb-6">
              <TypingTitle className="font-sora font-bold text-xl text-white mb-3 tracking-tight">Real‑time user insights</TypingTitle>
              <p className="text-[#8892a4] text-sm leading-relaxed mb-4">
                Track visitors as they interact with your site. See page views, top referrers, active users, bounce rate, and more in real‑time
              </p>
              <Link href="#" className="inline-flex items-center gap-2 text-sm text-white font-sora font-medium hover:gap-3 transition-all group">
                Learn More <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </div>
            <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[260px] bg-gradient-to-br from-[#0a0e1e] to-[#0c1122] border border-[rgba(53,80,180,0.2)]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(53,80,180,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(53,80,180,.15) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
              <div className="absolute inset-0 flex items-start justify-center pt-8 px-6">
                <div className="w-full bg-[rgba(8,12,26,0.85)] border border-[rgba(40,60,160,0.25)] rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
                  <p className="font-sora font-semibold text-sm mb-0.5 text-white">Visitors</p>
                  <p className="text-[10px] text-[#3a4560] mb-5 tracking-widest uppercase">30 countries</p>
                  {[
                    { flag: '🇺🇸', label: 'United States', ref: ddBar1Ref, count: '1,385' },
                    { flag: '🇩🇪', label: 'Germany',       ref: ddBar2Ref, count: '89' },
                  ].map((row) => (
                    <div key={row.flag} className="mb-3.5">
                      <div className="flex justify-between items-center mb-2 text-[11px] text-white">
                        <span className="flex items-center gap-2"><span>{row.flag}</span> {row.label}</span>
                        <span className="text-[#8892a4] font-sora">{row.count}</span>
                      </div>
                      <div className="h-2 bg-[#111828] rounded-full overflow-hidden">
                        <div ref={row.ref} className="h-full rounded-full bg-gradient-to-r from-[#3050b0] to-[#5070e0] transition-[width] duration-[1500ms] ease-out" style={{ width: '0%' }} />
                      </div>
                    </div>
                  ))}
                  {[0, 1].map((i) => (
                    <div key={i} className="mb-2" style={{ opacity: 0.4 - i * 0.15 }}>
                      <div className="h-2 bg-[#111828] rounded-full overflow-hidden">
                        <div className="h-full bg-[#1e2540] rounded-full" style={{ width: i === 0 ? '22%' : '14%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none bg-[radial-gradient(circle_at_80%_80%,rgba(40,60,200,0.25),transparent_65%)] blur-[20px]" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
