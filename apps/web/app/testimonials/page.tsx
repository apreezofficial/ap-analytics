'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { TypingTitle } from '@/components/landing/TypingTitle'

const testimonials = [
  {
    content: "I've tried every analytics tool out there, from GA to specialized privacy trackers. APAnalytics is the only one that hits the perfect balance of depth and simplicity. The setup is truly instant.",
    author: "Precious Adedokun",
    role: "Founder & Full-stack Developer",
    avatar: "PA",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    content: "The real-time dashboard is addictive. Being able to see exact entry points and drop-offs without the bloat of traditional tools has changed how we optimize our landing pages.",
    author: "Sarah Mitchell",
    role: "Senior Product Manager",
    avatar: "SM",
    gradient: "from-purple-500 to-pink-600"
  },
  {
    content: "Finally, a tool that respects user privacy without sacrificing the insights I need to grow my business. The lightweight nature of the script is just the icing on the cake.",
    author: "Alex Thompson",
    role: "Independent SEO Consultant",
    avatar: "AT",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    content: "I initially switched for the privacy features, but I stayed for the UX. The funnel analysis tool is more intuitive than enterprise competitors costing 10x as much.",
    author: "Chioma Okonkwo",
    role: "CEO, TechStack",
    avatar: "CO",
    gradient: "from-orange-500 to-red-600"
  },
  {
    content: "APAnalytics managed to make data analytics beautiful. My team actually enjoys checking our stats now. It's transformed our data culture from 'scary' to 'insightful'.",
    author: "Marcus Chen",
    role: "Lead UI/UX Designer",
    avatar: "MC",
    gradient: "from-cyan-500 to-blue-600"
  },
  {
    content: "The zero-cookie approach is a massive win for us. We removed all our cookie banners and our conversion rate jumped by 15% immediately. Truly a game-changer.",
    author: "David Oyelaran",
    role: "Performance Marketer",
    avatar: "DO",
    gradient: "from-rose-500 to-orange-600"
  }
]

export default function TestimonialsPage() {
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
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen bg-[#07090f] text-white font-dm overflow-x-hidden star-bg antialiased">
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 pt-40 pb-20 overflow-hidden">
          {/* glow orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[600px] h-[600px] rounded-full left-1/2 -translate-x-1/2 top-[-100px] bg-[radial-gradient(ellipse_at_center,rgba(53,120,247,0.3)_0%,rgba(26,79,214,0.15)_45%,transparent_72%)] blur-[100px] animate-orbpulse" />
          </div>

          <div className="reveal opacity-0 [animation:fadeup_0.7s_cubic-bezier(.22,1,.36,1)_0.1s_forwards] mt-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(53,120,247,0.25)] bg-[rgba(53,120,247,0.12)] text-[#7ab4ff] text-[11px] font-semibold font-sora tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3578f7] shadow-[0_0_7px_#3578f7] shrink-0" />
              Trusted by 50,000+ developers
            </span>
          </div>

          <TypingTitle 
            className="font-sora font-bold leading-[1.1] tracking-tight mt-10 mb-8 relative z-10 min-h-[140px] [text-wrap:balance]"
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 4rem)' }}
            delay={300}
          >
            Don&apos;t just take our word for it.
          </TypingTitle>

          <p className="text-[#8892a4] leading-relaxed max-w-lg font-light text-[1.1rem] relative z-10 opacity-0 [animation:fadeup_0.9s_cubic-bezier(.22,1,.36,1)_2.8s_forwards] [text-wrap:balance]">
            Join thousands of teams who switched to APAnalytics for a faster, cleaner, and more private web.
          </p>
        </section>

        {/* ── GRID ── */}
        <section className="relative z-10 px-6 md:px-14 pb-32">
          <div className="max-w-6xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t, idx) => (
              <div 
                key={t.author} 
                className="reveal break-inside-avoid p-8 rounded-[24px] bg-[rgba(12,16,32,0.8)] border border-white/[0.06] hover:border-[rgba(100,140,255,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(26,79,214,0.2)] transition-all duration-500 group"
                style={{ transitionDelay: `${idx * 0.05}s` }}
              >
                {/* quote icon */}
                <div className="mb-6 text-[#3578f7]/20 group-hover:text-[#3578f7]/40 transition-colors">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                    <path d="M0 24V14.4L4.8 0H12.8L9.6 14.4H14.4V24H0ZM17.6 24V14.4L22.4 0H30.4L27.2 14.4H32V24H17.6Z"/>
                  </svg>
                </div>

                <p className="text-[#c8d0e0] leading-relaxed mb-8 italic">
                  &quot;{t.content}&quot;
                </p>

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-xl`}>
                    {t.avatar}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-sora font-bold text-white text-sm">{t.author}</h4>
                    <span className="text-[#8892a4] text-xs">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS SECTION ── */}
        <section className="relative z-10 px-6 md:px-14 py-24 border-y border-[#12182e]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Cloud Users', val: '50K+' },
              { label: 'Pageviews / Mo', val: '2.4B+' },
              { label: 'Uptime', val: '99.99%' },
              { label: 'Open Source', val: '100%' },
            ].map((stat, i) => (
              <div key={stat.label} className="reveal text-center" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-sora font-black text-white mb-2">{stat.val}</div>
                <div className="text-[#8892a4] text-xs font-semibold tracking-widest uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative z-10 px-6 md:px-14 py-32 text-center">
          <div className="max-w-2xl mx-auto reveal relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(53,120,247,0.22)_0%,transparent_70%)] blur-[80px]" />
            <TypingTitle className="font-sora font-bold text-white text-4xl md:text-5xl tracking-tight mb-8 relative z-10 min-h-[60px] [text-wrap:balance]">
              Ready to see your own data?
            </TypingTitle>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <Link
                href="/register"
                className="font-sora text-sm font-semibold px-9 py-4 rounded-xl bg-white text-[#07090f] hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5 shadow-2xl shadow-white/10"
              >
                Start for free
              </Link>
              <Link
                href="/demo"
                className="font-sora text-sm font-medium px-9 py-4 rounded-xl border border-[#3a4255] text-[#c8d0e0] hover:border-[#6a7898] hover:text-white transition-all hover:-translate-y-0.5"
              >
                View demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
