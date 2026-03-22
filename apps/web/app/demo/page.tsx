import Link from 'next/link'

export default function DemoPage() {
    return (
        <>
            {/* Navigation */}
            <nav className="navbar">
                <div className="container">
                    <Link href="/" className="nav-logo">APAnalytics</Link>
                    <div className="nav-links">
                        <Link href="/features">Features</Link>
                        <Link href="/testimonials">Testimonials</Link>
                        <Link href="/demo" style={{ color: 'var(--primary)' }}>Demo</Link>
                        <Link href="/login" className="btn btn-secondary">Login</Link>
                        <Link href="/register" className="btn btn-primary">Get Started</Link>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>See It In Action</h1>
                    <p>Explore our interactive demo dashboard and see how APAnalytics works</p>
                </div>
            </section>

            {/* Demo Content */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div className="demo-preview">
                        <div className="demo-frame">
                            {/* Mock Dashboard */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem' }}>Dashboard</h2>
                                    <p style={{ color: 'var(--gray-500)' }}>Last 30 days</p>
                                </div>
                                <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}>
                                    <option>Last 30 days</option>
                                    <option>Last 7 days</option>
                                    <option>Last 90 days</option>
                                </select>
                            </div>

                            {/* Stats Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '1.5rem', background: 'var(--gray-100)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Visitors</p>
                                    <h3 style={{ fontSize: '2rem' }}>24,589</h3>
                                    <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>↑ 12.5%</p>
                                </div>
                                <div style={{ padding: '1.5rem', background: 'var(--gray-100)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Page Views</p>
                                    <h3 style={{ fontSize: '2rem' }}>89,234</h3>
                                    <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>↑ 8.2%</p>
                                </div>
                                <div style={{ padding: '1.5rem', background: 'var(--gray-100)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Avg. Duration</p>
                                    <h3 style={{ fontSize: '2rem' }}>2m 34s</h3>
                                    <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>↑ 5.1%</p>
                                </div>
                                <div style={{ padding: '1.5rem', background: 'var(--gray-100)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Bounce Rate</p>
                                    <h3 style={{ fontSize: '2rem' }}>42.3%</h3>
                                    <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>↓ 2.1%</p>
                                </div>
                            </div>

                            {/* Chart Placeholder */}
                            <div style={{ padding: '2rem', background: 'var(--gray-100)', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--gray-500)' }}>📈 Visitor Trends Chart</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginTop: '0.5rem' }}>
                                    Interactive chart showing visitor trends over time
                                </p>
                            </div>

                            {/* Tables */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <h4 style={{ marginBottom: '1rem' }}>Top Pages</h4>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                                                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--gray-500)', fontWeight: '500' }}>Page</th>
                                                <th style={{ textAlign: 'right', padding: '0.75rem 0', color: 'var(--gray-500)', fontWeight: '500' }}>Views</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                                <td style={{ padding: '0.75rem 0' }}>/</td>
                                                <td style={{ textAlign: 'right', padding: '0.75rem 0' }}>12,456</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                                <td style={{ padding: '0.75rem 0' }}>/pricing</td>
                                                <td style={{ textAlign: 'right', padding: '0.75rem 0' }}>8,234</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                                <td style={{ padding: '0.75rem 0' }}>/features</td>
                                                <td style={{ textAlign: 'right', padding: '0.75rem 0' }}>6,789</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '1rem' }}>Top Sources</h4>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                                                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--gray-500)', fontWeight: '500' }}>Source</th>
                                                <th style={{ textAlign: 'right', padding: '0.75rem 0', color: 'var(--gray-500)', fontWeight: '500' }}>Visitors</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                                <td style={{ padding: '0.75rem 0' }}>Google</td>
                                                <td style={{ textAlign: 'right', padding: '0.75rem 0' }}>10,234</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                                <td style={{ padding: '0.75rem 0' }}>Direct</td>
                                                <td style={{ textAlign: 'right', padding: '0.75rem 0' }}>7,891</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                                <td style={{ padding: '0.75rem 0' }}>Twitter</td>
                                                <td style={{ textAlign: 'right', padding: '0.75rem 0' }}>4,567</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Demo Info */}
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>This is just a preview</h3>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                            Create a free account to access your real analytics dashboard.
                            Get detailed insights about your website visitors.
                        </p>
                        <Link href="/register" className="btn btn-primary">Create Free Account</Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <h2>Start Tracking Today</h2>
                    <p>Join thousands of developers using APAnalytics</p>
                    <Link href="/register" className="btn btn-primary">Get Started Free</Link>
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
