'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

// Global event to toggle sidebar from Topbar
export const SIDEBAR_TOGGLE_EVENT = 'toggleSidebar'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  // Listen for toggle events from topbar hamburger
  useEffect(() => {
    const handler = () => setOpen(prev => !prev)
    window.addEventListener(SIDEBAR_TOGGLE_EVENT, handler)
    return () => window.removeEventListener(SIDEBAR_TOGGLE_EVENT, handler)
  }, [])

  // Close on route change (mobile UX)
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const navItems = [
    { label: 'Overview', icon: <OverviewIcon />, href: '/dashboard', section: 'Analytics' },
    { label: 'Visitors', icon: <VisitorsIcon />, href: '/dashboard/visitors', badge: 'Live' },
    { label: 'Events', icon: <EventsIcon />, href: '/dashboard/events' },
    { label: 'Funnels', icon: <FunnelsIcon />, href: '/dashboard/funnels' },
    { label: 'Uptime', icon: <UptimeIcon />, href: '/dashboard/uptime' },
    { label: 'Reports', icon: <ReportsIcon />, href: '/dashboard/reports', section: 'Reports' },
    { label: 'Campaigns', icon: <CampaignsIcon />, href: '/dashboard/campaigns' },
    { label: 'Settings', icon: <SettingsIcon />, href: '/dashboard/settings', section: 'Settings' }
  ]

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2.5" fill="white"/>
              <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="12" x2="22" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: '.95rem', color: 'white', letterSpacing: '-.01em' }}>Apanalytics</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          {navItems.map((item, idx) => (
            <React.Fragment key={item.label}>
              {item.section && <div className="nav-section" style={idx > 0 ? { marginTop: '8px' } : {}}>{item.section}</div>}
              <Link href={item.href}>
                <div className={`nav-item ${pathname === item.href ? 'active' : ''}`}>
                  {item.icon}
                  {item.label}
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </div>
              </Link>
            </React.Fragment>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="nav-item group" style={{ margin: 0 }} onClick={handleLogout} title="Click to logout">
            <div className="avatar-circle">{user?.email?.[0].toUpperCase() || 'U'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '.75rem', fontWeight: 500, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email?.split('@')[0] || 'User'}
              </div>
              <div style={{ fontSize: '.65rem', color: 'rgba(80,100,150,.8)' }}>Pro Plan</div>
            </div>
            <svg className="group-hover:stroke-red-400 transition-colors" width="14" height="14" fill="none" stroke="rgba(80,100,150,.7)" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </div>
        </div>
      </aside>
    </>
  )
}

function OverviewIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
function VisitorsIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> }
function EventsIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function FunnelsIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> }
function UptimeIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> }
function ReportsIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> }
function CampaignsIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> }
function SettingsIcon() { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> }
