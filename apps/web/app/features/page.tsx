'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { TypingTitle } from '@/components/landing/TypingTitle'

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

function FeatIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    live: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
    geo: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    traffic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    funnel: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>,
    events: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
    reports: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M4 19.5h16"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>,
    device: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="10" x="4" y="4" rx="2"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
    privacy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>,
    export: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  }
  return icons[type] || icons.live
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
    tag: 'Uptime Monitoring',
    title: 'Never lose a visitor to downtime',
    desc: 'Monitor your website status around the clock. Get alerted the moment your site goes down, and track response times to ensure your infrastructure is always firing on all cylinders.',
    bullets: [
      'Real-time status check frequency (1 minute)',
      'Response time (latency) monitoring chart',
      'Incidence log with status codes and history',
    ],
    image: '/features/overview-dashboard.png', // Reuse dashboard image as placeholder if no specific one
    alt: 'APAnalytics uptime monitoring dashboard showing site status and latency',
    flip: false,
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
    flip: true,
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
    flip: false,
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
    flip: true,
  },
  {
    tag: 'Campaign tracking',
    title: 'Track every marketing campaign',
    desc: 'Attribute visitors to specific marketing channels using UTM parameters. See which campaigns drive the most traffic and conversions.',
    bullets: [
      'UTM source, medium, and campaign detection',
      'Conversion attribution to specific campaigns',
      'Campaign performance dashboard',
    ],
    image: '/features/campaign-tracking.png',
    alt: 'APAnalytics campaign tracking showing attributed visitors and attribution matrix',
    flip: false,
  },
  {
    tag: 'Settings & Security',
    title: 'Fine-tuned tracking control',
    desc: 'Control where your data comes from and how it is processed. Configure whitelists, manage API keys, and set up project-specific tracking rules.',
    bullets: [
      'Domain whitelisting for security',
      'REST API access for data integration',
      'DANGER zone for project management',
    ],
    image: '/features/project-settings.png',
    alt: 'APAnalytics project settings showing tracking endpoint and whitelisting',
    flip: true,
  },
]

/* ─── page ─────────────────────────────────────────────────── */
export default function FeaturesPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null)

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

  /* Lightbox close on ESC */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveImage(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#07090f] text-white font-dm overflow-x-hidden star-bg antialiased pb-20">
      {/* ── NAV ── */}
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 pt-48 pb-24 overflow-hidden">
          {/* glow orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[600px] h-[600px] rounded-full left-1/2 -translate-x-1/2 top-[-100px] bg-[radial-gradient(ellipse_at_center,rgba(53,120,247,0.35)_0%,rgba(26,79,214,0.18)_45%,transparent_72%)] blur-[100px] animate-orbpulse" />
          </div>

          <div className="relative z-10 opacity-0 [animation:fadeup_0.7s_cubic-bezier(.22,1,.36,1)_0.1s_forwards] mt-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(53,120,247,0.25)] bg-[rgba(53,120,247,0.12)] text-[#7ab4ff] text-[11px] font-semibold font-sora tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3578f7] shadow-[0_0_7px_#3578f7] shrink-0" />
              Everything you need · Nothing you don&apos;t
            </span>
          </div>

          <TypingTitle 
            className="font-sora font-bold leading-[1.05] tracking-tight mt-12 mb-10 relative z-10 min-h-[160px] [text-wrap:balance]"
            style={{ fontSize: 'clamp(3.2rem,8.5vw,5.5rem)' }}
            delay={300}
          >
            Powerful features built for privacy-first analytics
          </TypingTitle>

          <p className="text-[#8892a4] leading-relaxed max-w-lg font-light text-[1.1rem] relative z-10 opacity-0 [animation:fadeup_0.9s_cubic-bezier(.22,1,.36,1)_2.8s_forwards] [text-wrap:balance] mb-12">
            APAnalytics gives you clean, real-time insights without cookies, without complexity,
            and without compromising your users&apos; privacy.
          </p>

          <div className="flex flex-wrap gap-4 mt-4 justify-center relative z-10 opacity-0 [animation:fadeup_0.9s_cubic-bezier(.22,1,.36,1)_3.1s_forwards]">
            <Link
              href="/register"
              className="font-sora text-sm font-semibold px-9 py-4 rounded-xl bg-white text-[#07090f] hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5 shadow-2xl shadow-white/10"
            >
              Start for free
            </Link>
            <Link
              href="/"
              className="font-sora text-sm font-medium px-9 py-4 rounded-xl border border-[#3a4255] text-[#c8d0e0] hover:border-[#6a7898] hover:text-white transition-all hover:-translate-y-0.5"
            >
              View demo
            </Link>
          </div>
        </section>

        {/* ── FEATURE ROWS ── */}
        <section className="relative z-10 px-6 md:px-14 pb-24">
          <div className="max-w-5xl mx-auto space-y-36">
            {features.map((feat, idx) => (
              <div
                key={feat.tag}
                className={`reveal flex flex-col ${feat.flip ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-20 items-center`}
                style={{ transitionDelay: `${idx * 0.05}s` }}
              >
                {/* text side */}
                <div className="flex-1 min-w-0">
                  <SectionTag>{feat.tag}</SectionTag>
                  <TypingTitle className="font-sora font-bold text-white text-3xl md:text-4xl leading-tight tracking-tight mb-5 min-h-[44px] [text-wrap:balance]">
                    {feat.title}
                  </TypingTitle>
                  <p className="text-[#8892a4] text-[0.95rem] leading-relaxed mb-8 [text-wrap:balance]">
                    {feat.desc}
                  </p>
                  <ul className="space-y-4 mb-10">
                    {feat.bullets.map((b) => (
                      <CheckItem key={b}>{b}</CheckItem>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-3 font-sora text-sm font-medium text-white hover:gap-4 transition-all group"
                  >
                    Get started free
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </Link>
                </div>

                {/* image side */}
                <div className="flex-1 min-w-0 w-full">
                  <div 
                    onClick={() => setActiveImage(feat.image)}
                    className="relative rounded-[24px] overflow-hidden border border-[rgba(53,100,200,0.22)] shadow-[0_0_0_1px_rgba(53,120,247,0.08),0_30px_90px_rgba(0,0,0,0.6)] group cursor-pointer"
                  >
                    {/* subtle glow behind image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(53,120,247,0.08)] to-transparent pointer-events-none z-10" />
                    <Image
                      src={feat.image}
                      alt={feat.alt}
                      width={1000}
                      height={625}
                      className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      quality={95}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-[rgba(53,120,247,0.05)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-pulse">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                      </div>
                    </div>
                    {/* top bar badge */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(8,12,26,0.9)] border border-[rgba(53,100,200,0.3)] backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3578f7] shadow-[0_0_8px_#3578f7]" />
                      <span className="text-[11px] font-sora font-semibold text-[#7ab4ff] tracking-wider uppercase">{feat.tag}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── QUICK FEATURE GRID ── */}
        <section className="relative z-10 px-6 md:px-14 py-24 border-t border-[#12182e]">
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-16">
              <SectionTag>Everything Included</SectionTag>
              <TypingTitle className="font-sora font-bold text-white text-3xl md:text-5xl tracking-tight min-h-[60px] [text-wrap:balance]">
                No hidden fees. No bloat.
              </TypingTitle>
              <p className="text-[#8892a4] text-sm mt-4 max-w-lg mx-auto leading-relaxed [text-wrap:balance]">
                Every plan includes every feature. We don&apos;t gate the good stuff behind expensive tiers. Simple, transparent, and powerful.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { icon: 'live', label: 'Live Visitors', desc: "See who's on your site right now, second by second" },
                { icon: 'geo', label: 'Geo Analytics', desc: 'Country, region, and city-level visitor breakdown' },
                { icon: 'traffic', label: 'Traffic Sources', desc: 'Direct, search, and referrer traffic attribution' },
                { icon: 'funnel', label: 'Funnel Builder', desc: 'Multi-step conversion funnels with drop-off rates' },
                { icon: 'events', label: 'Custom Events', desc: 'Auto-capture + custom JS events via one API call' },
                { icon: 'reports', label: 'Scheduled Reports', desc: 'Email reports delivered automatically on your schedule' },
                { icon: 'device', label: 'Device Analytics', desc: 'Desktop, mobile, and tablet visit breakdown' },
                { icon: 'privacy', label: 'Privacy-First', desc: 'No cookies, no consent banners, GDPR compliant' },
                { icon: 'export', label: 'CSV Export', desc: 'Full data export including custom events and referrers' },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="reveal group p-8 rounded-2xl bg-[rgba(12,16,32,0.8)] border border-white/[0.06] hover:border-[rgba(100,140,255,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(26,79,214,0.2)] transition-all duration-300"
                  style={{ transitionDelay: `${i * 0.04}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgba(53,120,247,0.12)] border border-[rgba(53,120,247,0.25)] flex items-center justify-center text-[#7ab4ff] mb-6 group-hover:scale-110 group-hover:bg-[rgba(53,120,247,0.25)] transition-all duration-300">
                    <FeatIcon type={item.icon} />
                  </div>
                  <h3 className="font-sora font-semibold text-white text-base mb-2">{item.label}</h3>
                  <p className="text-[#8892a4] text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative z-10 px-6 md:px-14 py-28 text-center">
          <div className="max-w-2xl mx-auto reveal relative">
            {/* glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(53,120,247,0.22)_0%,transparent_70%)] blur-[80px]" />

            <SectionTag>Get Started Today</SectionTag>
            <TypingTitle className="font-sora font-bold text-white text-4xl md:text-5xl tracking-tight mb-6 relative z-10 min-h-[60px] [text-wrap:balance]">
              Ready to understand your visitors?
            </TypingTitle>
            <p className="text-[#8892a4] text-[1rem] leading-relaxed mb-10 relative z-10 [text-wrap:balance]">
              Add one lightweight script. Start seeing real-time insights in under 2 minutes.
              No credit card required for our free tier.
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <Link
                href="/register"
                className="font-sora text-sm font-semibold px-9 py-4 rounded-xl bg-white text-[#07090f] hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5 shadow-2xl shadow-white/10"
              >
                Create free account
              </Link>
              <Link
                href="/"
                className="font-sora text-sm font-medium px-9 py-4 rounded-xl border border-[#3a4255] text-[#c8d0e0] hover:border-[#6a7898] hover:text-white transition-all hover:-translate-y-0.5"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── LIGHTBOX ── */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-black/95 backdrop-blur-sm animate-formIn"
          onClick={() => setActiveImage(null)}
        >
          <div className="absolute top-6 right-6 text-white/60 hover:text-white cursor-pointer transition-colors p-2 z-[110]" onClick={() => setActiveImage(null)}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <div 
            className="relative w-full max-w-6xl aspect-[16/10] rounded-[24px] overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image 
              src={activeImage} 
              alt="Lightboxed dashboard screenshot"
              fill
              className="object-contain bg-[#080c1c]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
