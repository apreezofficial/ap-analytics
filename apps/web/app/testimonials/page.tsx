import Link from 'next/link'

export default function TestimonialsPage() {
  const testimonials = [
    {
      content: "I've been using APAnalytics for 6 months now and it's been a game changer. The privacy-first approach aligns perfectly with my values, and the data is exactly what I need - no bloat, no complications.",
      author: "Alex Thompson",
      role: "Freelance Developer",
      avatar: "AT"
    },
    {
      content: "As a startup founder, every dollar counts. APAnalytics lets me track my SaaS metrics without worrying about expensive subscriptions. The self-hosted option is incredibly well documented.",
      author: "Chioma Okonkwo",
      role: "CEO, StackFlow",
      avatar: "CO"
    },
    {
      content: "The setup was incredibly fast. I had tracking working on my blog within 5 minutes. The dashboard is clean and intuitive - exactly what I was looking for.",
      author: "Marcus Chen",
      role: "Technical Writer",
      avatar: "MC"
    },
    {
      content: "I've tried Google Analytics, Mixpanel, Amplitude, and countless others. APAnalytics is the first tool that gives me exactly what I need without overwhelming me with features I'll never use.",
      author: "Sarah Mitchell",
      role: "Product Manager",
      avatar: "SM"
    },
    {
      content: "The lightweight script is genuinely impressive. At less than 1KB, it doesn't impact page load times at all. My Core Web Vitals actually improved after switching from GA.",
      author: "David Oyelaran",
      role: "SEO Consultant",
      avatar: "DO"
    },
    {
      content: "Being able to self-host is a huge plus. I keep all my analytics data on my own servers, which is essential for my enterprise clients with strict data compliance requirements.",
      author: "Emily Watson",
      role: "DevOps Engineer",
      avatar: "EW"
    },
    {
      content: "Finally, an analytics tool that doesn't require a cookie banner! My EU visitors no longer see that annoying popup, and I still get all the insights I need.",
      author: "James Murphy",
      role: "Blogger",
      avatar: "JM"
    },
    {
      content: "The real-time dashboard is addictive. I find myself checking it constantly to see where my latest blog post is getting traffic from. It's helped me understand my audience better.",
      author: "Priya Sharma",
      role: "Content Creator",
      avatar: "PS"
    },
    {
      content: "Customer support is fantastic. I had questions about self-hosting setup and got helpful responses within hours. The team really cares about their users.",
      author: "Robert Kimani",
      role: "Indie Hacker",
      avatar: "RK"
    }
  ]

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="nav-logo">APAnalytics</Link>
          <div className="nav-links">
            <Link href="/features">Features</Link>
            <Link href="/testimonials" style={{ color: 'var(--primary)' }}>Testimonials</Link>
            <Link href="/demo">Demo</Link>
            <Link href="/login" className="btn btn-secondary">Login</Link>
            <Link href="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>What People Say</h1>
          <p>Join thousands of happy users tracking their websites with APAnalytics</p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="testimonials" style={{ paddingBottom: '0' }}>
        <div className="container">
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50K+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h3>4.9/5</h3>
              <p>User Rating</p>
            </div>
            <div className="stat-item">
              <h3>99.9%</h3>
              <p>Satisfaction Rate</p>
            </div>
            <div className="stat-item">
              <h3>50M+</h3>
              <p>Page Views Tracked</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Join Thousands of Happy Users</h2>
          <p>Start your free account today and see the difference</p>
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
