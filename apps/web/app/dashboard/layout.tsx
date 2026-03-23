'use client'

import React from 'react'
import Script from 'next/script'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'
import { useRouter } from 'next/navigation'
import './dashboard.css'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const user = localStorage.getItem('user')

    if (!user) {
      router.push('/login')
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return null

  return (
    <>
      {/* Analytics Config */}
      <Script id="analytics-config" strategy="afterInteractive">
        {`
          window.analyticsConfig = {
            apiUrl: 'http://localhost/apanalytics/apps/api/collect.php',
            projectId: '69c0f5e72aaf7',
            debug: true
          };
        `}
      </Script>

      {/* Analytics Library */}
      <Script
        src="http://localhost/apanalytics/apps/api/analytics.js"
        strategy="afterInteractive"
      />

      <div className="dashboard-body">
        <div className="app-container star-bg">
          <Sidebar />

          <main className="main-viewport">
            <Topbar />
            <div className="dashboard-content">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}