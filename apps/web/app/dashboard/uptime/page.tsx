'use client'

import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function UptimePage() {
  const [siteName, setSiteName] = useState('Loading...')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState('Checking now...')

  const fetchUptime = async () => {
     try {
        const savedUser = localStorage.getItem('user');
        const savedSite = localStorage.getItem('selected_site');
        if(!savedUser || !savedSite) return;
        
        const uid = JSON.parse(savedUser).id;
        const sid = JSON.parse(savedSite).id;
        
        const res = await fetch(`http://localhost/apanalytics/apps/api/uptime.php?site_id=${sid}&user_id=${uid}`);
        const json = await res.json();
        
        setData(json);
        setLastCheck('Just now');
     } catch(e) { console.error("Uptime fetch failed", e); }
     setLoading(false);
  }

  useEffect(() => {
    const updateSite = () => {
       const saved = localStorage.getItem('selected_site')
       if (saved) {
           setSiteName(JSON.parse(saved).name)
           setLoading(true)
           fetchUptime()
       }
    }
    updateSite()
    window.addEventListener('siteChanged', updateSite)

    // ping dynamically every 30 seconds
    const interval = setInterval(() => {
        fetchUptime();
    }, 30000);

    return () => {
        window.removeEventListener('siteChanged', updateSite);
        clearInterval(interval);
    }
  }, [])

  if (loading || !data) return <div className="p-20 text-center"><div className="loader mx-auto mb-4"></div><p>Pinging target endpoint...</p></div>;

  const lineData = {
    labels: data.chart_labels || [],
    datasets: [{
        label: 'Latency (ms)', data: data.chart_data || [], fill: true, tension: 0.3,
        backgroundColor: (c: any) => { const ctx = c.chart.ctx; const g = ctx.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, 'rgba(74, 222, 128, 0.2)'); g.addColorStop(1, 'rgba(74, 222, 128, 0)'); return g; },
        borderColor: '#4ade80', borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: '#4ade80'
    }]
  }

  const lineOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10, 14, 30, 0.9)', cornerRadius: 8, padding: 10 } },
    scales: { 
      x: { display: false }, 
      y: { grid: { color: 'rgba(30,42,80,0.3)', drawBorder: false }, ticks: { color: 'rgba(80,100,140,.7)', font: { size: 10 } } } 
    }
  }

  // Generate 30 empty blocks if backend history array is short (it shouldn't be based on our PHP but just in case)
  const blocks = data.history || [];

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Uptime Monitoring</h1>
          <p className="text-[#8892a4] text-sm mt-1">{data.target_url} · Live target tracking.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 py-2 px-4 rounded-xl">
           <div className="flex items-center gap-2">
             <div className={`w-2.5 h-2.5 rounded-full border-[3px] shadow-lg animate-pulse ${data.live_status === 'Operational' ? 'bg-green-400 border-green-900/40 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-red-500 border-red-900/40 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
             <span className={`font-sora font-semibold tracking-wide text-sm uppercase ${data.live_status === 'Operational' ? 'text-green-400' : 'text-red-500'}`}>{data.live_status} {data.live_code ? `(${data.live_code})` : ''}</span>
           </div>
           <div className="h-6 w-px bg-white/10 mx-2"></div>
           <div className="text-right">
              <div className="text-[0.65rem] text-[#8892a4] font-bold tracking-widest uppercase">Last Ping</div>
              <div className="text-sm font-sora text-white">{lastCheck}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="panel p-6 flex flex-col justify-between h-[160px] bg-gradient-to-br from-green-400/5 to-transparent border-green-400/10">
              <div className="flex items-start justify-between">
                 <div className="text-[0.7rem] uppercase font-bold tracking-widest text-green-400/80">Overall Uptime</div>
                 <div className="chip chip-green bg-green-400/10 text-green-400 border border-green-400/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest">REALTIME DB</div>
              </div>
              <div className="font-sora text-5xl font-bold text-white tracking-tight flex items-baseline gap-1">
                 {data.overall_uptime} <span className="text-lg text-[#8892a4] font-medium tracking-normal">%</span>
              </div>
          </div>
          
          <div className="panel p-6 flex flex-col justify-between h-[160px]">
              <div className="flex items-start justify-between">
                 <div className="text-[0.7rem] uppercase font-bold tracking-widest text-[#8892a4]">Average Latency</div>
                 <svg width="18" height="18" fill="none" stroke="rgba(136,146,164,0.5)" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div className="font-sora text-5xl font-bold text-white tracking-tight flex items-baseline gap-1">
                 {data.avg_latency} <span className="text-lg text-[#8892a4] font-medium tracking-normal">ms</span>
              </div>
          </div>
      </div>

      <div className="panel flex flex-col gap-6">
          <div className="panel-header border-b border-white/5 pb-4"><div className="panel-title font-sora">Uptime History</div></div>
          
          {/* 30 Day Real Bars */}
          <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-1 w-full">
                  {blocks.map((b: any, i: number) => (
                      <div 
                         key={i} 
                         title={`${b.date}: ${b.status === 'no_data' ? 'No ping data' : b.uptime + '% uptime'}`}
                         className={`w-full h-12 rounded-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg cursor-crosshair ${
                            b.status === 'no_data' ? 'bg-white/10 hover:bg-white/20' :
                            b.status === 'perfect' ? 'bg-green-400/80 hover:bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.2)]' : 
                            b.status === 'degraded' ? 'bg-yellow-400/80 hover:bg-yellow-400' : 
                            'bg-red-500/80 hover:bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                         }`}
                      />
                  ))}
              </div>
              <div className="flex justify-between items-center text-[0.65rem] font-bold text-[#8892a4] uppercase tracking-widest px-1">
                 <span>30 Days Ago</span>
                 <span><span className="text-green-400">■</span> OK &nbsp;&nbsp; <span className="text-white/20">■</span> No Data &nbsp;&nbsp; <span className="text-red-500">■</span> Down</span>
                 <span>Today</span>
              </div>
          </div>
      </div>

      <div className="panel flex flex-col pt-5 px-5 pb-0 h-[300px] overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <div className="font-sora font-semibold text-white">Live Edge Response (ms)</div>
             <div className="text-xs text-[#8892a4]">cURL ping tracking via Server</div>
          </div>
          <div className="flex-1 w-full relative -mx-2">
             <Line data={lineData} options={lineOptions} />
          </div>
      </div>

    </div>
  )
}
