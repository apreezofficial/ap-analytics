export function TrustedBy() {
  const brands = [
    { name: 'Medium', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor"><circle cx="6" cy="11" r="5.5"/><ellipse cx="15" cy="11" rx="3" ry="5.5"/><ellipse cx="20.5" cy="11" rx="1.5" ry="5.5"/></svg> },
    { name: 'mailchimp', icon: <svg width="22" height="22" viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="22" rx="9" ry="6" fill="currentColor" fillOpacity=".9"/><ellipse cx="16" cy="14" rx="6" ry="7" fill="currentColor"/><circle cx="22" cy="10" r="3" fill="currentColor" fillOpacity=".6"/><circle cx="10" cy="10" r="2" fill="currentColor" fillOpacity=".5"/></svg> },
    { name: 'Evernote', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 8H17V5a1 1 0 00-1-1H8C5.24 4 3 6.24 3 9v7a4 4 0 004 4h10a4 4 0 004-4V9a1 1 0 00-.5-.87zM9 15H7v-2h2v2zm8-2h-2v2h-2v-2h-2v-2h6v2z"/></svg> },
    { name: 'Dropbox', icon: <svg width="22" height="22" viewBox="0 0 40 40" fill="currentColor"><polygon points="20,3 4,13 20,23 36,13"/><polygon points="4,25 20,35 36,25 20,15"/><polygon points="4,25 12,30 20,25 12,20"/><polygon points="36,25 28,30 20,25 28,20"/></svg> },
    { name: 'Microsoft', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect width="8" height="8" fill="#f35325"/><rect x="10" width="8" height="8" fill="#81bc06"/><rect y="10" width="8" height="8" fill="#05a6f0"/><rect x="10" y="10" width="8" height="8" fill="#ffba08"/></svg> },
  ]

  return (
    <section className="relative z-10 py-12 px-6 reveal">
      <div className="grad-line max-w-xl mx-auto opacity-30 mb-10" />
      <p className="text-center text-[11px] text-[#3a4470] tracking-[0.2em] uppercase mb-10 font-sora font-semibold">
        Trusted by modern developers, marketers, and startups
      </p>
      <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
        {brands.map(({ name, icon }) => (
          <div key={name} className="flex items-center gap-3 opacity-30 hover:opacity-100 hover:text-white brightness-[1.8] hover:brightness-[3.0] transition-all duration-500 cursor-default text-[#8892a4] hover:scale-110">
            {icon}
            <span className="font-sora font-bold text-sm tracking-tight">{name}</span>
          </div>
        ))}
      </div>
      <div className="grad-line max-w-xl mx-auto opacity-30 mt-10" />
    </section>
  )
}
