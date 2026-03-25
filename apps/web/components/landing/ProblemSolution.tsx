'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TypingTitle } from './TypingTitle'

const problems = [
  {
    tag: 'The Reality Check',
    title: "You've had a website for years and you're still flying blind?",
    desc: "Most analytics tools are so bloated you need a PhD to find a simple metric. Meanwhile, your users are dropping off and you have no idea why. wtf is the point of having data if you can't read it?",
    image: '/features/overview-stats.png',
    alt: 'Clean dashboard with real-time stats',
    flip: false,
    delay: 0.1
  },
  {
    tag: 'Cookie Chaos',
    title: 'Ditch the "Accept Cookies" nightmare.',
    desc: "Traditional trackers force you to plague your users with consent banners that kill conversion. APAnalytics is 100% cookie-free and GDPR compliant by default. Remove the friction and let your users breathe.",
    image: '/features/funnel-analysis.png',
    alt: 'Funnel analysis without cookie tracking',
    flip: true,
    delay: 0.2
  },
  {
    tag: 'Performance First',
    title: 'Stop slowing down your site with legacy bloat.',
    desc: "Google Analytics is massive. Every millisecond extra on your load time is money lost. Our script is less than 1KB—so fast your Lighthouse score won't even notice it's there.",
    image: '/features/overview-dashboard.png',
    alt: 'Lighthouse scoring 100 with APAnalytics',
    flip: false,
    delay: 0.3
  }
]

export function ProblemSolution() {
  return (
    <section className="relative z-10 py-32 px-6 md:px-14 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-ap/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-48">
        {problems.map((p, idx) => (
          <div 
            key={idx} 
            className={`reveal flex flex-col ${p.flip ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 md:gap-24 items-center`}
            style={{ transitionDelay: `${p.delay}s` }}
          >
            {/* Image Side */}
            <div className="flex-1 w-full">
               <div className="relative group p-1 rounded-[32px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-2xl">
                  <div className="relative rounded-[28px] overflow-hidden">
                    <Image 
                      src={p.image} 
                      alt={p.alt}
                      width={800}
                      height={500}
                      className="w-full h-auto block group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-blue-ap/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  {/* Floating badge for effect */}
                  <div className="absolute -top-6 -right-6 md:-right-10 bg-[#07090f] border border-white/10 p-4 rounded-2xl shadow-2xl animate-floatA hidden sm:block">
                     <p className="text-[10px] text-blue-ap font-bold uppercase tracking-widest mb-1">{p.tag}</p>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-ap animate-pulse" />
                        <span className="text-white text-xs font-semibold">Live Insight</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Text Side */}
            <div className="flex-1 text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-ap/10 border border-blue-ap/25 text-blue-ap text-[11px] font-bold tracking-widest uppercase mb-6">
                 {p.tag}
              </span>
              <h2 className="font-sora font-bold text-3xl md:text-5xl text-white leading-[1.15] mb-8 tracking-tight [text-wrap:balance]">
                 {p.title}
              </h2>
              <p className="text-[#8892a4] text-lg leading-relaxed mb-10 font-light [text-wrap:balance]">
                 {p.desc}
              </p>
              <div className="flex items-center gap-6">
                <Link 
                  href="/register" 
                  className="px-8 py-3.5 rounded-xl bg-white text-[#07090f] font-bold text-sm hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5"
                >
                  Start for free
                </Link>
                <Link 
                  href="/features" 
                  className="text-sm font-semibold text-[#c8d0e0] hover:text-white flex items-center gap-2 transition-colors group"
                >
                  See all features <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Break Out Section */}
      <div className="max-w-4xl mx-auto mt-48 reveal text-center p-12 rounded-[32px] bg-gradient-to-b from-blue-ap/10 to-transparent border border-blue-ap/20">
         <TypingTitle className="font-sora font-bold text-3xl md:text-4xl text-white mb-6 min-h-[50px]">
           Still not convinced?
         </TypingTitle>
         <p className="text-[#8892a4] text-lg mb-10 [text-wrap:balance]">
           Your competitors are already optimizing their conversion with clear data. What are you waiting for? Zero cookies. One script. Zero complexity.
         </p>
         <Link 
            href="/demo" 
            className="inline-block px-10 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all hover:scale-105"
         >
           View the Live Demo
         </Link>
      </div>
    </section>
  )
}
