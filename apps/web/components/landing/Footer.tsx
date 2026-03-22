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

export function Footer() {
  const footerLinks = [
    { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
    { title: 'Resources', links: ['Docs', 'Blog', 'API Reference', 'Status'] },
    { title: 'Company', links: ['About', 'Privacy', 'Terms', 'Contact'] },
  ]

  return (
    <footer className="relative z-10 px-6 md:px-14 py-12 border-t border-[#12182e]">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 font-sora font-semibold text-white text-sm mb-3">
            <LogoIcon size={18} />
            APAnalytics
          </Link>
          <p className="text-xs text-[#8892a4] leading-relaxed max-w-xs">
            The privacy-first alternative to Google Analytics. No cookies. No consent banners. Just clean insights.
          </p>
          <p className="text-[10px] text-[#3a4255] mt-4">© 2026 APAnalytics, Inc. All rights reserved.</p>
        </div>

        {footerLinks.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-sora font-semibold text-white mb-4">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-xs text-[#8892a4] hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  )
}
