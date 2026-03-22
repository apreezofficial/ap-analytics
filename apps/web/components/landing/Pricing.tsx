import Link from 'next/link'
import { TypingTitle } from './TypingTitle'

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(53,120,247,0.25)] bg-[rgba(53,120,247,0.12)] text-[#7ab4ff] text-[11px] font-semibold font-sora tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-[#3578f7] shadow-[0_0_7px_#3578f7] shrink-0" />
      {children}
    </span>
  )
}

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      desc: 'For personal projects',
      price: '$0',
      period: 'Forever free',
      features: ['10,000 pageviews/mo', '1 website', '6‑month data retention', 'Cookie‑free tracking'],
      cta: 'Get started free',
      href: '/register',
      featured: false,
    },
    {
      name: 'Pro',
      desc: 'For growing products',
      price: '$19',
      period: 'Billed monthly',
      features: [
        '1M pageviews/mo',
        'Unlimited websites',
        '2‑year data retention',
        'Custom events + funnels',
        'Email reports',
        'Uptime monitoring',
      ],
      cta: 'Start free trial',
      href: '/register',
      featured: true,
    },
    {
      name: 'Enterprise',
      desc: 'For large‑scale teams',
      price: 'Custom',
      period: 'Talk to sales',
      features: ['Unlimited pageviews', 'SSO / SAML', 'Dedicated support', 'SLA guarantee', 'On‑premise option'],
      cta: 'Contact sales',
      href: '#',
      featured: false,
    },
  ]

  const stats = [
    { val: '12,000+', label: 'Active Sites' },
    { val: '4.9★', label: 'Avg. Rating' },
    { val: '99.9%', label: 'Uptime SLA' },
    { val: '0', label: 'Cookies Used' },
  ]

  return (
    <>
      {/* ── STATS ── */}
      <section className="relative z-10 py-16 px-6 reveal">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-sora font-bold text-3xl md:text-4xl text-white tracking-tight">{s.val}</p>
              <p className="text-xs text-[#8892a4] mt-2 uppercase tracking-wide font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="relative z-10 py-20 px-6" id="pricing">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="mb-4">
              <Badge>Simple pricing</Badge>
            </div>
            <TypingTitle className="font-sora font-bold text-3xl md:text-4xl tracking-tight text-white mb-2">
              Pay for what you use
            </TypingTitle>
            <p className="text-[#8892a4] text-sm mt-3 max-w-sm mx-auto leading-relaxed">
              No hidden fees. Cancel anytime. Unlimited team members on all plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`reveal rounded-2xl p-6 flex flex-col relative overflow-hidden transition-all duration-300 ${
                  plan.featured
                    ? 'bg-gradient-to-b from-[rgba(26,79,214,0.38)] to-[rgba(10,14,30,0.95)] border border-[rgba(53,120,247,0.4)] shadow-2xl scale-[1.02]'
                    : 'glass'
                }`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                {plan.featured && (
                  <div className="absolute top-3 right-3 text-[10px] font-sora font-semibold text-[#3578f7] bg-[rgba(53,120,247,0.1)] px-2.5 py-1 rounded-full border border-[rgba(53,120,247,0.2)]">
                    Popular
                  </div>
                )}
                <p className="font-sora font-semibold text-white text-sm mb-1">{plan.name}</p>
                <p className="text-[#8892a4] text-xs mb-5">{plan.desc}</p>
                <p className="font-sora font-bold text-3xl text-white mb-1 tracking-tight">
                  {plan.price}
                  <span className="text-sm font-normal text-[#8892a4]">{plan.price !== 'Custom' ? '/mo' : ''}</span>
                </p>
                <p className="text-[10px] text-[#3a4255] mb-6 uppercase tracking-widest">{plan.period}</p>
                <ul className="space-y-2.5 text-xs text-[#8892a4] flex-1 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-[#3578f7] text-lg">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center text-xs font-sora font-semibold py-3 rounded-xl transition-all duration-300 ${
                    plan.featured
                      ? 'bg-[#3578f7] text-white hover:bg-[#1a4fd6] hover:-translate-y-0.5 shadow-lg shadow-[rgba(53,120,247,0.3)]'
                      : 'border border-[#3a4255] text-[#c8d0e0] hover:border-[#6a7898] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 py-24 px-6 reveal">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-[32px] p-10 md:p-14 overflow-hidden text-center bg-[linear-gradient(135deg,rgba(26,79,214,0.42),rgba(10,14,30,0.96)_55%,rgba(53,120,247,0.18))] border border-[rgba(53,120,247,0.28)] shadow-2xl">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(53,120,247,0.25),transparent_65%)]" />
            <div className="mb-6">
              <Badge>Get started today</Badge>
            </div>
            <TypingTitle className="font-sora font-bold text-3xl md:text-4xl text-white tracking-tight mb-4 leading-tight min-h-[100px]">
              Stop flying blind. Start knowing your users.
            </TypingTitle>
            <p className="text-[#8892a4] text-[0.94rem] leading-relaxed mb-10 max-w-sm mx-auto">
              Join 12,000+ sites already running faster, smarter, privacy‑first analytics with APAnalytics.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="font-sora text-sm font-semibold px-8 py-4 rounded-xl bg-white text-[#07090f] hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5 shadow-xl shadow-white/20"
              >
                Start for free — no card needed
              </Link>
              <Link
                href="#features"
                className="font-sora text-sm font-medium px-8 py-4 rounded-xl border border-[#3a4255] text-[#c8d0e0] hover:border-[#6a7898] hover:text-white transition-all hover:-translate-y-0.5"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
