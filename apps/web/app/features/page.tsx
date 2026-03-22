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
