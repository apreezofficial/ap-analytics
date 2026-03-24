import Link from 'next/link'

export default function FeaturesPage() {
    return (
        <>
            {/* Navigation */}
            <nav className="navbar">
                <div className="container">
                    <Link href="/" className="nav-logo">APAnalytics</Link>
                    <div className="nav-links">
                        <Link href="/features" style={{ color: 'var(--primary)' }}>Features</Link>
                        <Link href="/testimonials">Testimonials</Link>
                        <Link href="/demo">Demo</Link>
                        <Link href="/login" className="btn btn-secondary">Login</Link>
                        <Link href="/register" className="btn btn-primary">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Powerful Features</h1>
                    <p>Everything you need to understand your website visitors</p>
                </div>
            </section>

            {/* Features List */}
            <section className="features-list">
                <div className="container">
                    {/* Feature 1 */}
                    <div className="feature-row">
                        <div>
                            <h3>Real-time Dashboard</h3>
                            <p>
                                Watch your visitors arrive in real-time. See which pages they're viewing,
                                how long they stay, and where they came from. The live dashboard updates
                                instantly as events happen.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Live visitor count
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Real-time events
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Live referrer data
                                </li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            📊 Real-time Dashboard
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="feature-row">
                        <div>
                            <h3>Privacy-First Design</h3>
                            <p>
                                We believe privacy is a fundamental right. APAnalytics doesn't use cookies,
                                doesn't store personal information, and never sells data. Fully compliant
                                with GDPR, CCPA, and PECR.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> No cookies required
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> No personal data stored
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> GDPR compliant
                                </li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            🔒 Privacy First
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="feature-row">
                        <div>
                            <h3>Beautiful Analytics</h3>
                            <p>
                                Get detailed insights with beautiful, easy-to-understand charts and graphs.
                                Track page views, unique visitors, bounce rates, session duration, and more.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Custom date ranges
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Export reports
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Email reports
                                </li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            📈 Analytics Charts
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="feature-row">
                        <div>
                            <h3>Event Tracking</h3>
                            <p>
                                Track custom events like button clicks, form submissions, downloads, and more.
                                Understand how users interact with your site beyond just page views.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Custom events
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Event properties
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Goals & funnels
                                </li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            🎯 Event Tracking
                        </div>
                    </div>

                    {/* Feature 5 */}
                    <div className="feature-row">
                        <div>
                            <h3>Website Goals</h3>
                            <p>
                                Set up goals to track conversions. Whether it's newsletter signups,
                                purchases, or any other key action, measure what matters to your business.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Goal tracking
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Conversion rates
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Funnel analysis
                                </li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            🎯 Goals & Conversions
                        </div>
                    </div>

                    {/* Feature 6 */}
                    <div className="feature-row">
                        <div>
                            <h3>Self-Hosted Option</h3>
                            <p>
                                Want full control? Deploy APAnalytics on your own server.
                                It's open source and free. Keep all your data in-house.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Open source
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Full data control
                                </li>
                                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--success)' }}>✓</span> Easy deployment
                                </li>
                            </ul>
                        </div>
                        <div className="feature-image">
                            🖥️ Self-Hosted
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <h2>Ready to Get Started?</h2>
                    <p>Start tracking your website analytics in minutes</p>
                    <Link href="/register" className="btn btn-primary">Create Free Account</Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h3>APAnalytics</h3>
                            <p>Simple, private, and free web analytics for everyone.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Product</h4>
                            <Link href="/features">Features</Link>
                            <Link href="/demo">Demo</Link>
                            <Link href="/pricing">Pricing</Link>
                        </div>
                        <div className="footer-links">
                            <h4>Resources</h4>
                            <Link href="/docs">Documentation</Link>
                            <Link href="/api">API</Link>
                            <Link href="/status">Status</Link>
                        </div>
                        <div className="footer-links">
                            <h4>Company</h4>
                            <Link href="/about">About</Link>
                            <Link href="/contact">Contact</Link>
                            <Link href="/privacy">Privacy</Link>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2026 APAnalytics. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
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
