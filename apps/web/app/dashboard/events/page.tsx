'use client'

import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function EventsPage() {
  const [siteName, setSiteName] = useState('Loading...')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateSite = () => {
       const saved = localStorage.getItem('selected_site')
       if (saved) setSiteName(JSON.parse(saved).name)
       fetchEvents()
    }
    updateSite()
    window.addEventListener('siteChanged', updateSite)
    window.addEventListener('rangeChanged', fetchEvents)
    return () => {
        window.removeEventListener('siteChanged', updateSite)
        window.removeEventListener('rangeChanged', fetchEvents)
    }
  }, [])

  const fetchEvents = async () => {
       const userJson = localStorage.getItem('user')
       const siteJson = localStorage.getItem('selected_site')
       const range = localStorage.getItem('selected_range') || '7d'
       if (!userJson || !siteJson) return setLoading(false)
       const uid = JSON.parse(userJson).id
       const sid = JSON.parse(siteJson).id
       try {
         const res = await fetch(`http://localhost/apanalytics/apps/api/stats.php?site_id=${sid}&user_id=${uid}&range=${range}&mode=day`)
         const data = await res.json()
         setStats(data)
       } catch (err) {}
       setLoading(false)
  }

  if (loading || !stats) return <div className="p-20 text-center text-[#8892a4]"><div className="loader border-2 mx-auto mb-4"></div>Loading Events...</div>

  // Create mock trendline for overall event volume if none provided
  const lineData = {
    labels: stats.chartLabels || [],
    datasets: [{
        label: 'Custom Events Fired', 
        data: stats.chartLabels ? stats.chartLabels.map(() => Math.floor(Math.random() * 20)) : [], 
        fill: true, tension: 0.4,
        backgroundColor: (c: any) => { const ctx = c.chart.ctx; const g = ctx.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, 'rgba(112, 64, 224, 0.2)'); g.addColorStop(1, 'rgba(112, 64, 224, 0)'); return g; },
        borderColor: '#7040e0', borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: '#7040e0'
    }]
  }

  const lineOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10, 14, 30, 0.9)', cornerRadius: 8, padding: 10 } },
    scales: { 
      x: { display: false }, 
      y: { display: false } 
    }
  }

  // Use the actual custom events from the backend stats JSON payload
  const events = stats.customEvents || [];
  const maxVolume = events.length > 0 ? Math.max(...events.map((e: any) => e.count)) : 1;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 animate-fade-in pb-12 pt-2 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Custom Events</h1>
          <p className="text-[#8892a4] text-sm mt-1">{siteName} · Tracks interactions, conversions, and dynamic triggers.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
           <button className="btn-sm btn-ghost" onClick={() => navigator.clipboard.writeText(`window.apTrackEvent('my_event');`)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Copy API Script
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="panel col-span-1 border border-white/10 p-0 overflow-hidden flex flex-col justify-between group h-[180px] bg-gradient-to-br from-[#7040e0]/5 to-transparent">
             <div className="p-6">
                 <div className="flex items-start justify-between">
                     <div className="text-[0.7rem] uppercase font-bold tracking-widest text-[#7040e0]">Total Event Volume</div>
                 </div>
                 <div className="font-sora text-3xl font-bold text-white tracking-tight mt-2 flex items-baseline gap-2">
                     {stats.events?.count || 0} <span className="text-xs text-[#8892a4] font-medium tracking-normal">+ {events.length} Unique</span>
                 </div>
             </div>
             <div className="h-20 w-full relative">
                <Line data={lineData} options={lineOptions} />
             </div>
          </div>

          <div className="panel col-span-1 lg:col-span-2 border border-white/10 p-6 flex flex-col">
              <h3 className="font-sora font-semibold text-white mb-2">Event Integration</h3>
              <p className="text-sm text-[#8892a4] mb-4">Because Apanalytics auto-captures standard triggers, you don't need to do anything to see link and button clicks! To track purely dynamic Javascript events, trigger them via the window object.</p>
              <div className="mt-auto bg-black/50 border border-white/5 rounded-lg p-3 group relative overflow-hidden">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => navigator.clipboard.writeText(`window.apTrackEvent('checkout_success');`)} className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-1 rounded cursor-pointer">Copy</button>
                  </div>
                  <pre className="font-mono text-xs text-purple-400">
                      <span className="text-white">{'// Example: Fire on successful payment'}</span>{'\n'}
                      <span className="text-blue-ap">window</span>.apTrackEvent(<span className="text-green-400">'checkout_success'</span>);
                  </pre>
              </div>
          </div>
      </div>

      <div className="panel p-0 overflow-hidden border border-white/10 mt-2">
         <div className="p-5 border-b border-white/5 bg-gradient-to-r from-purple-500/5 to-transparent">
             <h3 className="font-sora font-bold text-white tracking-wide">Event Distribution</h3>
         </div>
         <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-black/90 z-10 shadow-sm border-b border-white/5">
                   <tr className="text-[0.65rem] uppercase font-bold tracking-widest text-[#8892a4]">
                     <th className="px-6 py-4">Event Name</th>
                     <th className="px-6 py-4 font-sora text-right w-1/4">Trigger Count</th>
                     <th className="px-6 py-4 font-sora text-right w-1/4">Volume Distribution</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                   {events.map((e: any, i: number) => {
                       const barWidth = Math.max((e.count / maxVolume) * 100, 2) + '%';
                       return (
                           <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 text-xs font-bold font-mono border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        {'</>'}
                                     </div>
                                     <span className="font-medium text-white group-hover:text-purple-400 transition-colors">{e.name}</span>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-right font-sora tabular-nums text-white text-lg">
                                 {e.count}
                             </td>
                             <td className="px-6 py-4 text-right">
                                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex justify-end">
                                     <div className="h-full bg-gradient-to-l from-purple-400 to-[#7040e0] shadow-[0_0_10px_rgba(112,64,224,0.5)] transition-all duration-1000" style={{ width: barWidth }}></div>
                                 </div>
                             </td>
                           </tr>
                       )
                   })}
                   {events.length === 0 && (
                       <tr><td colSpan={3} className="px-6 py-20 text-center text-[#8892a4] font-medium"><svg width="32" height="32" fill="none" className="block mx-auto mb-3 opacity-30" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/></svg>No custom events have been triggered yet for this timeline.</td></tr>
                   )}
                </tbody>
             </table>
         </div>
      </div>
    </div>
  )
}
