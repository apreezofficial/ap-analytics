'use client'

import React, { useEffect, useState } from 'react'

export default function GenericDashboardPage({ title }: { title: string }) {
  const [siteName, setSiteName] = useState('Loading...')

  useEffect(() => {
    const updateSite = () => {
       const saved = localStorage.getItem('selected_site')
       if (saved) setSiteName(JSON.parse(saved).name)
    }
    updateSite()
    window.addEventListener('siteChanged', updateSite)
    return () => window.removeEventListener('siteChanged', updateSite)
  }, [])

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">{title}</h1>
          <p className="text-[0.8rem] text-[#8892a4] mt-1">{siteName} · {title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-sm btn-primary">+ Add {title}</button>
        </div>
      </div>

      <div className="panel p-16 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-white/10 bg-black/20 shadow-none mt-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-ap/20 to-blue-600/10 flex items-center justify-center text-blue-ap mb-4 shadow-lg border border-blue-ap/20">
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/><rect x="2" y="2" width="20" height="20" rx="4" opacity="0.1"/></svg>
        </div>
        <h2 className="text-white font-sora font-bold text-2xl">{title} Module</h2>
        <p className="text-[#8892a4] max-w-md text-sm leading-relaxed">
          Deep dive into your project {title.toLowerCase()}. This page is part of the Apanalytics core dashboard and is currently being configured for {siteName}.
        </p>
      </div>
    </div>
  )
}
