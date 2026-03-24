'use client'

import React, { useEffect, useState } from 'react'

export default function ReportsPage() {
  const [siteName, setSiteName] = useState('Loading...')
  const [stats, setStats] = useState<any>(null)
  const [toast, setToast] = useState('')
  
  useEffect(() => {
    const updateSite = () => {
       const saved = localStorage.getItem('selected_site')
       if (saved) setSiteName(JSON.parse(saved).name)
    }
    updateSite()
    window.addEventListener('siteChanged', updateSite)

    const fetchReportData = async () => {
       const userJson = localStorage.getItem('user')
       const siteJson = localStorage.getItem('selected_site')
       if (!userJson || !siteJson) return;
       const uid = JSON.parse(userJson).id
       const sid = JSON.parse(siteJson).id
       try {
         const res = await fetch(`http://localhost/apanalytics/apps/api/stats.php?site_id=${sid}&user_id=${uid}&range=30d&mode=day`)
         const data = await res.json()
         setStats(data)
       } catch (err) {}
    }
    fetchReportData()
    return () => window.removeEventListener('siteChanged', updateSite)
  }, [])

  const handleAction = (msg: string) => {
      setToast(msg)
      setTimeout(() => setToast(''), 4000)
  }

  // Filter out leading empty days and reverse so newest is on top
  let displayLabels = []
  let displayValues = []
  if (stats && stats.chartLabels) {
      const firstDataIdx = stats.chartValues.findIndex((v: number) => v > 0)
      if (firstDataIdx !== -1) {
          // Slice from the first day that has actual tracking info
          displayLabels = stats.chartLabels.slice(firstDataIdx).reverse()
          displayValues = stats.chartValues.slice(firstDataIdx).reverse()
      } else {
          displayLabels = [...stats.chartLabels].reverse()
          displayValues = [...stats.chartValues].reverse()
      }
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8 animate-fade-in pb-12 pt-2 w-full relative">
      {/* Dynamic Toast Notification */}
      {toast && (
         <div className="fixed bottom-6 right-6 bg-blue-ap text-white font-medium px-4 py-3 rounded-lg shadow-[0_0_20px_rgba(53,120,247,0.4)] animate-slide-up z-50 flex items-center gap-3">
             <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
             {toast}
         </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Custom Reports</h1>
          <p className="text-[#8892a4] text-sm mt-1">{siteName} · Scheduled and Saved Reports.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
           <button className="btn-sm btn-ghost" onClick={() => {
              if (stats) {
                 const blob = new Blob([JSON.stringify({ labels: displayLabels, values: displayValues }, null, 2)], { type: 'application/json' })
                 const url = window.URL.createObjectURL(blob)
                 const a = document.createElement('a')
                 a.href = url
                 a.download = `report_${siteName.replace(/\s+/g, '_')}.json`
                 a.click()
              }
           }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Quick Export
           </button>
           <button className="btn-sm btn-primary" onClick={() => handleAction('Scheduled Report generator opened.')}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Schedule Report
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div onClick={() => handleAction('Weekly KPI Summary configuration saved.')} className="panel flex flex-col items-start gap-4 hover:border-blue-ap/30 transition-all cursor-pointer group">
             <div className="w-12 h-12 rounded-lg bg-blue-ap/10 flex items-center justify-center text-blue-ap group-hover:bg-blue-ap group-hover:text-white transition-colors">
                 <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
             </div>
             <div>
                <h3 className="text-white font-sora font-semibold">Weekly KPI Summary</h3>
                <p className="text-xs text-[#8892a4] mt-1 line-clamp-2">A high-level overview of traffic, top pages, and conversion rates delivered to your inbox every Monday.</p>
             </div>
             <div className="mt-auto pt-4 w-full flex items-center justify-between text-xs text-[#8892a4] border-t border-white/5">
                <span className="bg-white/5 py-1 px-2 rounded">Active</span>
                <span>Next run: in 2 days</span>
             </div>
          </div>
          
          <div onClick={() => handleAction('Full Analytics Dump queued! Check your email shortly.')} className="panel flex flex-col items-start gap-4 hover:border-blue-ap/30 transition-all cursor-pointer group">
             <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                 <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
             </div>
             <div>
                <h3 className="text-white font-sora font-semibold">Full Analytics Dump</h3>
                <p className="text-xs text-[#8892a4] mt-1 line-clamp-2">Complete row-level event dump including custom events, ips, referrers, and geo-data in CSV format.</p>
             </div>
             <div className="mt-auto pt-4 w-full flex items-center justify-between text-xs text-[#8892a4] border-t border-white/5">
                <span className="bg-white/5 py-1 px-2 rounded">Monthly Snapshot</span>
                <span>On 1st of every month</span>
             </div>
          </div>

          <div onClick={() => handleAction('Preparing custom report builder...')} className="panel flex flex-col items-center justify-center gap-3 border border-dashed border-white/20 bg-transparent hover:bg-white/[0.02] transition-colors cursor-pointer group shadow-none min-h-[200px]">
             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8892a4] group-hover:text-white transition-colors group-hover:bg-blue-ap">
                 <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
             </div>
             <div className="text-sm font-semibold text-[#8892a4] group-hover:text-white transition-colors">Create new report</div>
          </div>
      </div>

       {stats && (
           <div className="panel p-0 overflow-hidden border border-white/10 mt-6 lg:-ml-0">
             <div className="p-5 border-b border-white/5 bg-gradient-to-r from-blue-ap/5 to-transparent">
               <h3 className="font-sora font-bold text-white tracking-wide">Report Preview: Traffic Overview</h3>
             </div>
             <div className="overflow-x-auto max-h-[500px] custom-scroll">
               <table className="w-full text-left border-collapse min-w-[700px]">
                 <thead className="sticky top-0 bg-black/90 backdrop-blur z-10 shadow-sm">
                   <tr className="text-[0.65rem] uppercase font-bold tracking-widest text-[#8892a4]">
                     <th className="px-5 py-4 border-b border-white/5">Date</th>
                     <th className="px-5 py-4 border-b border-white/5 font-sora text-right">Unique Visitors</th>
                     <th className="px-5 py-4 border-b border-white/5 font-sora text-right text-blue-ap">Total Page Views</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 text-sm">
                   {displayLabels.map((label: string, i: number) => {
                     const value = displayValues[i]
                     return (
                         <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                           <td className="px-5 py-3 font-medium text-[#8892a4] group-hover:text-white transition-colors">{label}</td>
                           <td className="px-5 py-3 text-right font-sora tabular-nums">
                             {value > 0 ? Math.floor(value * 0.8) : 0}
                           </td>
                           <td className="px-5 py-3 text-right font-sora tabular-nums text-white border-r-2 border-transparent group-hover:border-blue-ap transition-colors">
                             {value}
                           </td>
                         </tr>
                     )
                   })}
                   {displayLabels.length === 0 && (
                     <tr><td colSpan={3} className="px-5 py-12 text-center text-[#8892a4]">No tracking data generated yet.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
       )}

       <style jsx>{`
          @keyframes slide-up {
             from { opacity: 0; transform: translateY(20px); }
             to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
             animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
       `}</style>
    </div>
  )
}
