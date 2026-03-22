import Link from 'next/link'

function LogoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.5" fill="white" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function Navbar() {
  return (
    <nav className="relative z-30 flex items-center justify-between px-6 md:px-14 py-5 animate-slidedown">
      <Link href="/" className="flex items-center gap-2 font-sora font-semibold text-white text-sm tracking-tight select-none">
        <LogoIcon size={20} />
        APAnalytics
      </Link>

      <ul className="hidden md:flex gap-8 list-none">
        {[
          ['Features', '#benefits'],
          ['Pricing', '#pricing'],
          ['About Us', '#'],
          ['Blogs', '#'],
          ['Docs ↗', '#'],
        ].map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-sm text-[#b0b8cc] hover:text-white transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <Link href="/login" className="hidden sm:block text-sm text-[#b0b8cc] hover:text-white transition-colors">
          Sign In
        </Link>
        <Link
          href="/register"
          className="font-sora text-xs font-semibold px-5 py-2.5 rounded-xl bg-white text-[#07090f] hover:bg-[#dce5f5] transition-all hover:-translate-y-0.5"
        >
          Start for free
        </Link>
      </div>
    </nav>
  )
}
