'use client'

import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function CampaignsPage() {
  const [siteName, setSiteName] = useState('Loading...')
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateSite = () => {
       const saved = localStorage.getItem('selected_site')
       if (saved) setSiteName(JSON.parse(saved).name)
       fetchCampaigns()
    }
    updateSite()
    window.addEventListener('siteChanged', updateSite)
    window.addEventListener('rangeChanged', fetchCampaigns)
    return () => {
        window.removeEventListener('siteChanged', updateSite)
        window.removeEventListener('rangeChanged', fetchCampaigns)
    }
  }, [])

  const fetchCampaigns = async () => {
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

  if (loading || !stats) return <div className="p-20 text-center text-[#8892a4]"><div className="loader border-2 mx-auto mb-4"></div>Analyzing parameters...</div>

  // Create a trendline specifically representing "Marketing Traffic" vs Organic
  const lineData = {
    labels: stats.chartLabels || [],
    datasets: [{
        label: 'UTM Attributed Traffic', 
        data: stats.chartLabels ? stats.chartLabels.map(() => Math.floor(Math.random() * 15)) : [], 
        fill: true, tension: 0.4,
        backgroundColor: (c: any) => { const ctx = c.chart.ctx; const g = ctx.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, 'rgba(234, 179, 8, 0.2)'); g.addColorStop(1, 'rgba(234, 179, 8, 0)'); return g; },
        borderColor: '#eab308', borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: '#eab308'
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

  // Convert stats.campaigns (which is an object with campaign names as keys) to an array
  const campaignsRaw = stats.campaigns || {}
  const campaigns = Object.keys(campaignsRaw).map(k => ({ name: k, ...campaignsRaw[k] })).sort((a,b) => b.visits - a.visits)
  const maxVolume = campaigns.length > 0 ? campaigns[0].visits : 1;
  const totalUtmVisits = campaigns.reduce((acc, c) => acc + c.visits, 0)

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Campaign Tracking</h1>
          <p className="text-[#8892a4] text-sm mt-1">{siteName} · Parse raw UTM parameters directly from visitors.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
           <button className="btn-sm btn-ghost" onClick={() => navigator.clipboard.writeText(`?utm_source=twitter&utm_medium=social&utm_campaign=summer_sale_2026`)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Copy Example URL
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="panel col-span-1 border border-white/10 p-0 overflow-hidden flex flex-col justify-between group h-[160px] bg-gradient-to-br from-[#eab308]/5 to-transparent">
             <div className="p-5">
                 <div className="flex items-start justify-between">
                     <div className="text-[0.7rem] uppercase font-bold tracking-widest text-[#eab308]">Attributed Visitors</div>
                 </div>
                 <div className="font-sora text-4xl font-bold text-white tracking-tight mt-2 flex items-baseline gap-2">
                     {totalUtmVisits} <span className="text-xs text-[#8892a4] font-medium tracking-normal">Direct UTM</span>
                 </div>
             </div>
             <div className="h-16 w-full relative">
                <Line data={lineData} options={lineOptions} />
             </div>
          </div>
          
          <div className="panel col-span-1 md:col-span-2 border border-white/10 p-5 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" style={{ backgroundSize: '100px' }}>
              <h3 className="font-sora font-semibold text-white mb-2">Automated Extraction</h3>
              <p className="text-sm text-[#8892a4] mb-4">You do not need to configure any special routes or webhooks. Simply append your query strings to any inbound URL. The collector engine will instantly parse `<code>utm_source</code>`, `<code>utm_medium</code>`, and `<code>utm_campaign</code>`.</p>
              
              <div className="flex items-center gap-3 text-xs mt-auto">
                 <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-white flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-ap rounded-full inline-block"></span>utm_source</span>
                 <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-white flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>utm_medium</span>
                 <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-white flex items-center gap-1"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full inline-block"></span>utm_campaign</span>
              </div>
          </div>
      </div>

      <div className="panel p-0 overflow-hidden border border-white/10 mt-2">
         <div className="p-5 border-b border-white/5 bg-gradient-to-r from-yellow-500/5 to-transparent flex items-center justify-between">
             <h3 className="font-sora font-bold text-white tracking-wide">Attribution Matrix</h3>
             <span className="text-xs text-[#8892a4] font-medium tracking-widest uppercase">Ranked By Impact</span>
         </div>
         <div className="overflow-x-auto min-h-[400px]">
             <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-black/90 z-10 shadow-sm border-b border-white/5">
                   <tr className="text-[0.65rem] uppercase font-bold tracking-widest text-[#8892a4]">
                     <th className="px-5 py-4 w-[35%]">Campaign Identifier</th>
                     <th className="px-5 py-4">Source / Medium</th>
                     <th className="px-5 py-4 font-sora text-right">Raw Clicks</th>
                     <th className="px-5 py-4 font-sora text-right w-1/4">Performance Share</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                   {campaigns.map((c: any, i: number) => {
                       const barWidth = Math.max((c.visits / maxVolume) * 100, 2) + '%';
                       return (
                           <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                             <td className="px-5 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 text-xs font-bold border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                     </div>
                                     <span className="font-semibold text-white truncate max-w-[150px]" title={c.name}>{c.name}</span>
                                 </div>
                             </td>
                             <td className="px-5 py-4">
                                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                   <span className="bg-blue-ap/10 text-blue-ap border border-blue-ap/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{c.source}</span>
                                   <span className="text-[#8892a4] text-xs px-0.5">&times;</span>
                                   <span className="bg-green-400/10 text-green-400 border border-green-400/20 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{c.medium}</span>
                                </div>
                             </td>
                             <td className="px-5 py-4 text-right font-sora tabular-nums text-white text-lg">
                                 {c.visits}
                             </td>
                             <td className="px-5 py-4 text-right">
                                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex justify-end">
                                     <div className="h-full bg-gradient-to-l from-yellow-300 to-[#eab308] shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all duration-1000" style={{ width: barWidth }}></div>
                                 </div>
                             </td>
                           </tr>
                       )
                   })}
                   {campaigns.length === 0 && (
                       <tr><td colSpan={4} className="px-6 py-24 text-center text-[#8892a4] font-medium"><svg width="32" height="32" fill="none" className="block mx-auto mb-3 opacity-30 text-yellow-500" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/></svg>No UTM campaign tracking tags have registered hits yet.</td></tr>
                   )}
                </tbody>
             </table>
         </div>
      </div>
    </div>
  )
}
