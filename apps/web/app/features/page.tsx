'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

/* ─── tiny helpers ─────────────────────────────────────────── */
function SectionTag({ children }: { children: string }) {
  return (
    <p className="font-sora text-xs font-semibold text-[#7060e0] tracking-wider mb-3 uppercase">
      {children}
    </p>
  )
}

function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-[#b0b8cc]">
      <span className="mt-[3px] flex-shrink-0 w-4 h-4 rounded-full bg-[rgba(80,120,255,0.15)] border border-[rgba(80,120,255,0.35)] flex items-center justify-center">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1.5 4L3 5.5L6.5 2" stroke="#7ab4ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </li>
  )
}

/* ─── feature data ─────────────────────────────────────────── */
const features = [
  {
    tag: 'Analytics Overview',
    title: 'Your entire website at a glance',
    desc: 'Get a real-time command center for your website. See live visitor counts, pageviews, bounce rates, average session time, and custom event completions — all updated the moment they happen.',
    bullets: [
      'Live visitor count with real-time activity feed',
      'Top pages, traffic sources & geographic breakdown',
      'Device & browser breakdown (Desktop, Mobile, Tablet)',
    ],
    image: '/features/overview-stats.png',
    alt: 'APAnalytics overview dashboard showing top pages, countries, traffic sources and devices',
    flip: false,
  },
  {
    tag: 'Funnel Analysis',
    title: 'Understand exactly where users drop off',
    desc: 'Build conversion funnels from any sequence of pages or custom events. Instantly see your overall conversion rate, total starts, and which step causes friction — so you can fix what actually matters.',
    bullets: [
      'Drag-and-drop funnel step builder',
      'Custom event or page-visit step types',
      'Conversion rate per step & overall funnel rate',
    ],
    image: '/features/funnel-analysis.png',
    alt: 'APAnalytics funnel analysis showing funnel steps and conversion rates',
    flip: true,
  },
  {
    tag: 'Custom Reports',
    title: 'Scheduled reports delivered to your inbox',
    desc: 'Create rich, saved analytics reports and schedule them to run automatically. From weekly KPI summaries to full monthly CSV dumps — your data, delivered on your terms without opening the dashboard.',
    bullets: [
      'Scheduled email reports (daily, weekly, monthly)',
      'Full CSV analytics export with geo & event data',
      'Live report preview before you commit',
    ],
    image: '/features/custom-reports.png',
    alt: 'APAnalytics custom reports with weekly KPI summary and full analytics dump',
    flip: false,
  },
  {
    tag: 'Visitors & Traffic',
    title: 'Real-time growth you can actually see',
    desc: 'Watch your visitors growth chart populate in real-time. Live activity feed shows every page being visited right now. Switch between day and week views to spot trends the moment they emerge.',
    bullets: [
      'Real-time visitors growth chart (day / week)',
      'Live activity feed with page-by-page breakdown',
      'Key metrics: people, views, avg time, bounce rate, events',
    ],
    image: '/features/overview-dashboard.png',
    alt: 'APAnalytics main overview with visitors growth chart and live activity',
    flip: true,
  },
  {
    tag: 'Custom Events',
    title: 'Track every interaction that matters',
    desc: 'APAnalytics auto-captures link clicks and button clicks without any code. For deeper tracking, fire custom JavaScript events via a single API call. See event volumes, distributions, and trends in one place.',
    bullets: [
      'Zero-config link & button click auto-capture',
      'Custom JS event API (window.apTrackEvent)',
      'Event volume chart + distribution table',
    ],
    image: '/features/custom-events.png',
    alt: 'APAnalytics custom events page showing event volume and distribution',
    flip: false,
  },
]

/* ─── page ─────────────────────────────────────────────────── */
export default function FeaturesPage() {
  /* scroll reveal */
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
      {/* ── NAV ── */}
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-20 overflow-hidden">
          {/* glow orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[520px] h-[520px] rounded-full left-1/2 -translate-x-1/2 top-[-80px] bg-[radial-gradient(ellipse_at_center,rgba(53,120,247,0.32)_0%,rgba(26,79,214,0.15)_45%,transparent_72%)] blur-[90px] animate-orbpulse" />
          </div>

          <div className="relative z-10 opacity-0 [animation:fadeup_0.7s_cubic-bezier(.22,1,.36,1)_0.1s_forwards]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(53,120,247,0.25)] bg-[rgba(53,120,247,0.12)] text-[#7ab4ff] text-[11px] font-semibold font-sora tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3578f7] shadow-[0_0_7px_#3578f7] shrink-0" />
              Everything you need · Nothing you don&apos;t
            </span>
          </div>

          <h1
            className="font-sora font-bold leading-[1.1] tracking-tight mt-6 mb-5 relative z-10 opacity-0 [animation:fadeup_0.9s_cubic-bezier(.22,1,.36,1)_0.3s_forwards]"
            style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)' }}
          >
            Powerful features built for<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7ab4ff] to-[#a78bfa]">
              {' '}privacy-first analytics
            </span>
          </h1>

          <p className="text-[#8892a4] leading-relaxed max-w-md font-light text-[0.95rem] relative z-10 opacity-0 [animation:fadeup_0.9s_cubic-bezier(.22,1,.36,1)_0.55s_forwards]">
            APAnalytics gives you clean, real-time insights without cookies, without complexity,
            and without compromising your users&apos; privacy.
          </p>

          <div className="flex flex-wrap gap-3 mt-8 justify-center relative z-10 opacity-0 [animation:fadeup_0.9s_cubic-bezier(.22,1,.36,1)_0.75s_forwards]">
            <Link
              href="/register"
              className="font-sora text-sm font-semibold px-7 py-3 rounded-xl bg-white text-[#07090f] hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5 shadow-xl shadow-white/10"
            >
              Start for free
            </Link>
            <Link
              href="/"
              className="font-sora text-sm font-medium px-7 py-3 rounded-xl border border-[#3a4255] text-[#c8d0e0] hover:border-[#6a7898] hover:text-white transition-all hover:-translate-y-0.5"
            >
              View demo
            </Link>
          </div>
        </section>

        {/* ── FEATURE ROWS ── */}
        <section className="relative z-10 px-6 md:px-14 pb-24">
          <div className="max-w-5xl mx-auto space-y-32">
            {features.map((feat, idx) => (
              <div
                key={feat.tag}
                className={`reveal flex flex-col ${feat.flip ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 md:gap-16 items-center`}
                style={{ transitionDelay: `${idx * 0.05}s` }}
              >
                {/* text side */}
                <div className="flex-1 min-w-0">
                  <SectionTag>{feat.tag}</SectionTag>
                  <h2 className="font-sora font-bold text-white text-2xl md:text-3xl leading-tight tracking-tight mb-4">
                    {feat.title}
                  </h2>
                  <p className="text-[#8892a4] text-sm leading-relaxed mb-6">
                    {feat.desc}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {feat.bullets.map((b) => (
                      <CheckItem key={b}>{b}</CheckItem>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 font-sora text-sm font-medium text-white hover:gap-3 transition-all group"
                  >
                    Get started free
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </Link>
                </div>

                {/* image side */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="relative rounded-[20px] overflow-hidden border border-[rgba(53,100,200,0.2)] shadow-[0_0_0_1px_rgba(53,120,247,0.06),0_24px_80px_rgba(0,0,0,0.55)] group">
                    {/* subtle glow behind image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(53,120,247,0.06)] to-transparent pointer-events-none z-10" />
                    <Image
                      src={feat.image}
                      alt={feat.alt}
                      width={960}
                      height={600}
                      className="w-full h-auto block group-hover:scale-[1.01] transition-transform duration-500"
                      quality={90}
                    />
                    {/* top bar badge */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(8,12,26,0.85)] border border-[rgba(53,100,200,0.25)] backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3578f7] shadow-[0_0_6px_#3578f7]" />
                      <span className="text-[10px] font-sora font-semibold text-[#7ab4ff] tracking-wider">{feat.tag}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUICK FEATURE GRID ── */}
        <section className="relative z-10 px-6 md:px-14 py-20 border-t border-[#12182e]">
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-12">
              <SectionTag>Everything Included</SectionTag>
              <h2 className="font-sora font-bold text-white text-3xl md:text-4xl tracking-tight">
                No hidden fees. No bloat.
              </h2>
              <p className="text-[#8892a4] text-sm mt-3 max-w-md mx-auto">
                Every plan includes every feature. We don&apos;t gate the good stuff behind expensive tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: '🔴', label: 'Live Visitors', desc: "See who's on your site right now, second by second" },
                { icon: '🌍', label: 'Geo Analytics', desc: 'Country, region, and city-level visitor breakdown' },
                { icon: '📊', label: 'Traffic Sources', desc: 'Direct, search, and referrer traffic attribution' },
                { icon: '🎯', label: 'Funnel Builder', desc: 'Multi-step conversion funnels with drop-off rates' },
                { icon: '⚡', label: 'Custom Events', desc: 'Auto-capture + custom JS events via one API call' },
                { icon: '📋', label: 'Scheduled Reports', desc: 'Email reports delivered automatically on your schedule' },
                { icon: '🖥️', label: 'Device Analytics', desc: 'Desktop, mobile, and tablet visit breakdown' },
                { icon: '🔒', label: 'Privacy-First', desc: 'No cookies, no consent banners, GDPR compliant' },
                { icon: '📤', label: 'CSV Export', desc: 'Full data export including custom events and referrers' },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="reveal group p-6 rounded-2xl bg-[rgba(12,16,32,0.75)] border border-white/[0.06] hover:border-[rgba(100,140,255,0.25)] hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(26,79,214,0.15)] transition-all duration-300"
                  style={{ transitionDelay: `${i * 0.04}s` }}
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-sora font-semibold text-white text-sm mb-1.5">{item.label}</h3>
                  <p className="text-[#8892a4] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative z-10 px-6 md:px-14 py-24">
          <div className="max-w-2xl mx-auto text-center reveal">
            {/* glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(53,120,247,0.18)_0%,transparent_70%)] blur-[60px]" />

            <SectionTag>Get Started Today</SectionTag>
            <h2 className="font-sora font-bold text-white text-3xl md:text-4xl tracking-tight mb-4 relative z-10">
              Ready to understand your visitors?
            </h2>
            <p className="text-[#8892a4] text-sm leading-relaxed mb-8 relative z-10">
              Add one lightweight script. Start seeing real-time insights in under 2 minutes.
              No credit card required.
            </p>
            <div className="flex flex-wrap gap-3 justify-center relative z-10">
              <Link
                href="/register"
                className="font-sora text-sm font-semibold px-8 py-3.5 rounded-xl bg-white text-[#07090f] hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5 shadow-xl shadow-white/10"
              >
                Create free account
              </Link>
              <Link
                href="/"
                className="font-sora text-sm font-medium px-8 py-3.5 rounded-xl border border-[#3a4255] text-[#c8d0e0] hover:border-[#6a7898] hover:text-white transition-all hover:-translate-y-0.5"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  )
}
