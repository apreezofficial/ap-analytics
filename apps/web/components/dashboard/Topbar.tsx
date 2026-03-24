'use client'

import React, { useEffect, useState } from 'react'

export function Topbar() {
  const [user, setUser] = useState<any>(null)
  const [sites, setSites] = useState<any[]>([])
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [showSiteDropdown, setShowSiteDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [range, setRange] = useState('7d')

  const ranges = [
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
  ]

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const u = JSON.parse(savedUser)
      setUser(u)
      fetchSites(u.id)
      
      const savedRange = localStorage.getItem('selected_range')
      if (savedRange) setRange(savedRange)

      const interval = setInterval(() => fetchSites(u.id), 10000)
      return () => clearInterval(interval)
    }
  }, [])

  const fetchSites = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost/apanalytics/apps/api/sites.php?action=list&user_id=${userId}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setSites(data)
        const saved = localStorage.getItem('selected_site')
        let current = saved ? JSON.parse(saved) : data[0]
        const freshSelected = data.find(s => s.id === current.id)
        if (freshSelected) {
          setSelectedSite(freshSelected)
          localStorage.setItem('selected_site', JSON.stringify(freshSelected))
        } else {
          setSelectedSite(current)
        }
        if (!saved) localStorage.setItem('selected_site', JSON.stringify(current))
      }
    } catch (err) { console.error(err) }
  }

  const handleSiteSelect = (site: any) => {
    setSelectedSite(site)
    localStorage.setItem('selected_site', JSON.stringify(site))
    setShowSiteDropdown(false)
    window.dispatchEvent(new Event('siteChanged'))
  }

  const handleRangeSelect = (r: string) => {
    setRange(r)
    localStorage.setItem('selected_range', r)
    setShowDateDropdown(false)
    window.dispatchEvent(new Event('rangeChanged'))
  }

  const handleAddSite = async () => {
    const name = prompt('Enter website name:')
    if (name && user) {
       const res = await fetch(`http://localhost/apanalytics/apps/api/sites.php?action=add&user_id=${user.id}`, {
         method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name })
       })
       const data = await res.json()
       if (data.success) {
         fetchSites(user.id)
         handleSiteSelect(data.site)
       }
    }
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        {/* Hamburger — mobile only */}
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => window.dispatchEvent(new Event('toggleSidebar'))}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        {/* SITE SELECTOR */}
        <div className="relative">
          <div className="site-selector cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-lg" onClick={() => setShowSiteDropdown(!showSiteDropdown)}>
            <div style={{ width: '18px', height: '18px', borderRadius: '5px', background: 'linear-gradient(135deg,#3578f7,#7040e0)' }}></div>
            <span className="font-semibold">{selectedSite?.name || 'Loading...'}</span>
            <svg width="14" height="14" fill="none" stroke="rgba(130,145,175,.7)" strokeWidth={2} viewBox="0 0 24 24" style={{ transform: showSiteDropdown ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          {showSiteDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[100] animate-fade-in p-1">
              <div className="px-3 py-1.5 text-[0.65rem] font-bold text-[#8892a4] uppercase tracking-widest flex justify-between">Projects <span className="text-blue-ap">Live</span></div>
              {sites.map(s => (
                <div key={s.id} onClick={() => handleSiteSelect(s)} className={`px-3 py-2 text-sm rounded-lg hover:bg-white/5 cursor-pointer flex items-center justify-between group ${selectedSite?.id === s.id ? 'bg-white/[0.03] text-white' : 'text-[#8892a4]'}`}>
                  <div className="flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${s.live_visitors > 0 ? 'bg-green-400' : 'bg-gray-500'}`}></div>{s.name}</div>
                  <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded">{s.live_visitors}</span>
                </div>
              ))}
              <div onClick={handleAddSite} className="px-3 py-2 text-sm text-blue-ap font-medium hover:bg-blue-ap/5 cursor-pointer flex items-center gap-2 m-0.5 rounded-lg border-t border-white/5">+ Add Website</div>
            </div>
          )}
        </div>

        {/* DATE RANGE SELECTOR */}
        <div className="relative">
          <div className="date-range cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-lg" onClick={() => setShowDateDropdown(!showDateDropdown)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span className="font-medium">{ranges.find(r => r.id === range)?.label}</span>
            <svg width="12" height="12" fill="none" stroke="rgba(130,145,175,.6)" strokeWidth={2} viewBox="0 0 24 24" style={{ transform: showDateDropdown ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          {showDateDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[100] animate-fade-in p-1">
              {ranges.map(r => (
                <div key={r.id} onClick={() => handleRangeSelect(r.id)} className={`px-3 py-2 text-sm rounded-lg hover:bg-white/5 cursor-pointer ${range === r.id ? 'bg-blue-ap/10 text-blue-ap font-semibold' : 'text-[#8892a4]'}`}>
                  {r.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <button onClick={async () => {
             const uid = user?.id;
             const sid = selectedSite?.id;
             if (!uid || !sid) return alert('No data to export.');
             try {
               const res = await fetch(`http://localhost/apanalytics/apps/api/stats.php?site_id=${sid}&user_id=${uid}&range=${range}`);
               const data = await res.json();
               const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
               const url = window.URL.createObjectURL(blob);
               const a = document.createElement('a');
               a.href = url;
               a.download = `analytics_export_${selectedSite.name.replace(/\s+/g, '_')}_${range}.json`;
               document.body.appendChild(a);
               a.click();
               a.remove();
             } catch(err) { alert('Export failed'); }
        }} className="btn-sm btn-ghost hover:text-white transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span className="topbar-btn-label">Export</span>
        </button>
        <button onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            const originalText = document.getElementById('share-text');
            if (originalText) {
               originalText.innerText = 'Copied!';
               setTimeout(() => originalText.innerText = 'Share', 2000);
            }
        }} className="btn-sm btn-ghost hover:text-white transition-colors">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span id="share-text" className="topbar-btn-label">Share</span>
        </button>
        <div className="avatar-circle">{user?.email?.[0].toUpperCase() || 'U'}</div>
      </div>
    </div>
  )
}
