'use client'

import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import '../dashboard/dashboard.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [range, setRange] = useState('7d')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Mock data for the demo
  const stats = {
    realtime: { count: 42, delta: '+5' },
    visitors: { count: '12.4K', delta: '+12%' },
    views: { count: '48.9K', delta: '+8%' },
    avgTime: { count: '02:45', delta: '+15s' },
    bounceRate: { count: '38%', delta: '-2%' },
    events: { count: '1.2K', delta: '+22%' },
    chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    chartValues: [1200, 1900, 1500, 2100, 2400, 1800, 2200],
    topPages: [
      { path: '/', views: 4200, pct: '34%', width: '100%' },
      { path: '/pricing', views: 2100, pct: '17%', width: '50%' },
      { path: '/features', views: 1800, pct: '14%', width: '42%' },
      { path: '/blog/privacy-first', views: 1200, pct: '9%', width: '28%' }
    ],
    countries: [
      { name: 'United States', code: 'US', count: 4200 },
      { name: 'United Kingdom', code: 'GB', count: 1800 },
      { name: 'Germany', code: 'DE', count: 1200 },
      { name: 'Nigeria', code: 'NG', count: 950 },
      { name: 'Canada', code: 'CA', count: 800 }
    ],
    trafficSources: [
      { name: 'Google', val: 5200, pct: '42%', icon: '🔍' },
      { name: 'Direct', val: 3100, pct: '25%', icon: '✨' },
      { name: 'Twitter / X', val: 1800, pct: '14%', icon: '🐦' },
      { name: 'GitHub', val: 1200, pct: '9%', icon: '🐙' }
    ],
    customEvents: [
      { name: 'Sign Up Click', count: 420 },
      { name: 'Demo View', count: 310 },
      { name: 'Plan Upgrade', count: 85 }
    ]
  }

  const lineData = {
    labels: stats.chartLabels,
    datasets: [{
      label: 'Visitors', data: stats.chartValues, fill: true, tension: 0.4,
      backgroundColor: (c: any) => { const ctx = c.chart.ctx; const g = ctx.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, 'rgba(53, 120, 247, 0.32)'); g.addColorStop(1, 'rgba(53, 120, 247, 0)'); return g; },
      borderColor: '#3578f7', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#3578f7'
    }]
  }

  const lineOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10, 14, 30, 0.95)', cornerRadius: 8 } },
    scales: { x: { grid: { color: 'rgba(30,42,80,0.3)', drawBorder: false }, ticks: { color: 'rgba(80,100,140,.7)' } }, y: { grid: { color: 'rgba(30,42,80,0.3)', drawBorder: false }, ticks: { color: 'rgba(80,100,140,.7)' } } }
  }

  return (
    <div className="dashboard-body star-bg">
      <div className="app-container">
        {/* ── SIDEBAR (Standalone Demo Version) ── */}
        <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">
            <div className="flex items-center gap-2.5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="2.5" fill="white"/>
                <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="font-sora font-bold text-[.95rem] text-white tracking-tight">APAnalytics</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="nav-section">Analytics</div>
            {['Overview', 'Visitors', 'Events', 'Funnels', 'Uptime'].map((item) => (
              <div 
                key={item} 
                className={`nav-item ${activeTab === item ? 'active' : ''}`}
                onClick={() => setActiveTab(item)}
              >
                <NavIcon label={item} />
                {item}
                {item === 'Visitors' && <span className="nav-badge">Live</span>}
              </div>
            ))}
            <div className="nav-section mt-4">Reports</div>
            {['Campaigns', 'Reports'].map((item) => (
              <div key={item} className={`nav-item ${activeTab === item ? 'active' : ''}`} onClick={() => setActiveTab(item)}>
                 <NavIcon label={item} /> {item}
              </div>
            ))}
            <div className="nav-section mt-4">Settings</div>
            <div className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => setActiveTab('Settings')}>
                <NavIcon label="Settings" /> Settings
            </div>
          </div>

          <div className="sidebar-bottom">
            <div className="nav-item group" style={{ margin: 0 }}>
              <div className="avatar-circle">D</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '.75rem', fontWeight: 500, color: 'white' }}>Demo User</div>
                <div style={{ fontSize: '.65rem', color: 'rgba(80,100,150,.8)' }}>Free Preview</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN VIEWPORT ── */}
        <main className="main-viewport">
          <header className="topbar">
            <div className="topbar-left">
              <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              </button>
              <div className="site-selector">
                <span className="w-5 h-5 rounded bg-blue-ap/20 flex items-center justify-center text-[10px]">🌐</span>
                <span>demo-website.com</span>
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </div>
            </div>
            <div className="topbar-right">
              <div className="date-range">
                 <span className="font-medium">Last 7 Days</span>
                 <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </div>
              <a href="/register" className="btn-sm btn-primary">Try for Free</a>
            </div>
          </header>

          <div className="dashboard-content animate-fade-in custom-scroll">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h1 className="font-sora font-bold text-xl text-white">{activeTab}</h1>
                <p className="text-[0.72rem] text-[#8892a4] mt-0.5">Demo Website · Real-time Preview Mode</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="chip chip-green flex items-center gap-1.5"><div className="live-dot" /> Live</div>
                 <button className="btn-sm btn-ghost">Export Data</button>
              </div>
            </div>

            {/* Static Dashboard View (Overview only for demo simplicity) */}
            <div className="stat-grid">
               <StatCard label="Realtime" val={stats.realtime.count} delta={stats.realtime.delta} isLive />
               <StatCard label="People" val={stats.visitors.count} delta={stats.visitors.delta} isUp />
               <StatCard label="Views" val={stats.views.count} delta={stats.views.delta} isUp />
               <StatCard label="Avg. Time" val={stats.avgTime.count} delta={stats.avgTime.delta} isNeu />
               <StatCard label="Bounce Rate" val={stats.bounceRate.count} delta={stats.bounceRate.delta} isNeu />
               <StatCard label="Events" val={stats.events.count} delta={stats.events.delta} isUp />
            </div>

            <div className="chart-row">
              <div className="panel">
                <div className="panel-header">
                  <div className="panel-title">Visitor Growth</div>
                  <div className="tab-group"><div className="tab active">Day</div><div className="tab">Hour</div></div>
                </div>
                <div className="p-4 h-[240px]"><Line data={lineData} options={lineOptions} /></div>
              </div>
              <div className="panel flex flex-col">
                 <div className="panel-header"><div className="panel-title">System Status</div><div className="chip chip-green text-[10px]">Healthy</div></div>
                 <div className="p-4 flex flex-col gap-4 text-sm">
                    <div className="flex justify-between text-[#8892a4]"><span>Main Server</span><span className="text-green-ap">Online</span></div>
                    <div className="flex justify-between text-[#8892a4]"><span>API Gateway</span><span className="text-green-ap">9ms</span></div>
                    <div className="flex justify-between text-[#8892a4]"><span>DB Cluster</span><span className="text-green-ap">Active</span></div>
                    <div className="mt-2 h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
                       <div className="h-full bg-green-ap w-[99%]" />
                    </div>
                    <span className="text-[10px] text-center text-[#506496]">99.98% Monthly Uptime</span>
                 </div>
              </div>
            </div>

            <div className="bottom-row">
               <div className="panel h-[320px] flex flex-col">
                  <div className="panel-header"><div className="panel-title">Top Pages</div></div>
                  <div className="p-2 space-y-1 overflow-y-auto flex-1 custom-scroll">
                    {stats.topPages.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex-1">
                          <div className="text-[0.75rem] text-white">/{p.path !== '/' ? p.path.substring(1) : ''}</div>
                          <div className="w-full h-[3px] bg-white/5 rounded-full mt-2 overflow-hidden"><div className="h-full bg-blue-ap" style={{ width: p.width }} /></div>
                        </div>
                        <div className="text-right pl-4">
                          <div className="text-[0.8rem] font-bold text-white font-sora">{p.views}</div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="panel h-[320px] flex flex-col">
                  <div className="panel-header"><div className="panel-title">Top Countries</div></div>
                  <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scroll">
                    {stats.countries.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{(c.code === 'US' && '🇺🇸') || (c.code === 'GB' && '🇬🇧') || (c.code === 'DE' && '🇩🇪') || (c.code === 'NG' && '🇳🇬') || '🇨🇦'}</span>
                          <span className="text-[#8892a4] font-medium">{c.name}</span>
                        </div>
                        <span className="text-white font-bold font-sora">{c.count}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="panel h-[320px] flex flex-col">
                  <div className="panel-header"><div className="panel-title">Traffic Sources</div></div>
                  <div className="p-2 space-y-2 flex-1 overflow-y-auto custom-scroll">
                     {stats.trafficSources.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                           <span className="text-lg">{s.icon}</span>
                           <span className="flex-1 text-xs text-[#8892a4] font-medium">{s.name}</span>
                           <span className="text-[0.8rem] font-bold text-white font-sora">{s.val}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="panel h-[320px] flex flex-col">
                  <div className="panel-header"><div className="panel-title">Custom Events</div></div>
                  <div className="p-3 space-y-2 flex-1 overflow-y-auto custom-scroll">
                    {stats.customEvents.map((e, i) => (
                      <div key={i} className="flex justify-between items-center text-sm p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
                        <span className="text-[#8892a4] font-medium flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-ap/50" /> {e.name}</span>
                        <span className="text-white font-bold font-sora">{e.count}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Sticky Warning for Demo */}
            <div className="mt-4 p-4 rounded-xl bg-blue-ap/10 border border-blue-ap/20 text-center">
               <p className="text-sm text-blue-ap/90 font-medium">This is a live preview with simulated data. <a href="/register" className="underline font-bold hover:text-white">Create a real account</a> to track your actual website statistics.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, val, delta, isLive, isUp, isNeu }: any) {
  return (
    <div className={`stat-card ${isLive ? 'live-card' : ''}`}>
      <div className="stat-label flex justify-between">{label} {isLive && <div className="live-dot" />}</div>
      <div className="stat-val font-sora text-white">{val}</div>
      <div className={`stat-delta ${isUp ? 'delta-up' : 'delta-neu'}`}>{delta}</div>
    </div>
  )
}

function NavIcon({ label }: { label: string }) {
  const props = { width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as "round", viewBox: "0 0 24 24" }
  switch(label) {
    case 'Overview': return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    case 'Visitors': return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    case 'Events': return <svg {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    case 'Funnels': return <svg {...props}><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
    case 'Uptime': return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    case 'Reports': return <svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    case 'Campaigns': return <svg {...props}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    default: return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  }
}
