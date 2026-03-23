'use client'

import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null)
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [range, setRange] = useState('7d')
  const [mode, setMode] = useState('day')

  useEffect(() => {
    if (range === '24h') setMode('hour')
    else if (range === '7d') setMode('day')
    else if (range === '30d' && mode === 'hour') setMode('day')
  }, [range])

  const fetchData = async (siteId: string, r: string, m: string) => {
    const userJson = localStorage.getItem('user')
    const uid = userJson ? JSON.parse(userJson).id : ''
    if (!siteId || !uid) return;
    try {
      const res = await fetch(`http://localhost/apanalytics/apps/api/stats.php?site_id=${siteId}&user_id=${uid}&range=${r}&mode=${m}`)
      if (res.status === 403) return;
      const data = await res.json()
      setStats(data)
    } catch (err) { console.error(err) }
  }

  const updateAll = () => {
    const s = localStorage.getItem('selected_site')
    const r = localStorage.getItem('selected_range') || '7d'
    if (s) {
      const site = JSON.parse(s)
      setSelectedSite(site)
      setRange(r)
      
      // Compute correct mode depending on range internally before fetch, since state might be stale
      let m = mode;
      if (r === '24h') m = 'hour';
      else if (r === '7d') m = 'day';
      else if (r === '30d' && m === 'hour') m = 'day';
      
      fetchData(site.id, r, m)
    }
  }

  useEffect(() => {
    updateAll()
    const int = setInterval(() => {
        const s = localStorage.getItem('selected_site')
        const r = localStorage.getItem('selected_range') || '7d'
        if (s) {
           let m = mode;
           if (r === '24h') m = 'hour';
           else if (r === '7d') m = 'day';
           else if (r === '30d' && m === 'hour') m = 'day';
           fetchData(JSON.parse(s).id, r, m)
        }
    }, 5000)
    window.addEventListener('siteChanged', updateAll)
    window.addEventListener('rangeChanged', updateAll)
    return () => { clearInterval(int); window.removeEventListener('siteChanged', updateAll); window.removeEventListener('rangeChanged', updateAll); }
  }, [mode]) // Re-run effect setup when mode changes so the interval uses the correct mode

  if (!stats) return <div className="p-20 text-center"><div className="loader mx-auto mb-4"></div><p>Syncing analytics...</p></div>

  const lineData = {
    labels: stats.chartLabels || [],
    datasets: [{
        label: 'Visitors', data: stats.chartValues || [], fill: true, tension: 0.4,
        backgroundColor: (c: any) => { const ctx = c.chart.ctx; const g = ctx.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, 'rgba(53, 120, 247, 0.32)'); g.addColorStop(1, 'rgba(53, 120, 247, 0)'); return g; },
        borderColor: '#3578f7', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#3578f7'
    }]
  }

  const lineOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10, 14, 30, 0.95)', cornerRadius: 8 } },
    scales: { x: { grid: { color: 'rgba(30,42,80,0.3)', drawBorder: false }, ticks: { color: 'rgba(80,100,140,.7)' } }, y: { grid: { color: 'rgba(30,42,80,0.3)', drawBorder: false }, ticks: { color: 'rgba(80,100,140,.7)' } } }
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-xl text-white">Overview</h1>
          <p className="text-[0.72rem] text-[#8892a4] mt-0.5">{selectedSite?.name} · {range==='24h'?'Last 24 Hours':range==='7d'?'Last 7 Days':'Last 30 Days'}</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="chip chip-green flex items-center gap-1.5"><div className="live-dot" style={{ background: '#4ade80' }}></div> Live</div>
           <button className="btn-sm btn-primary">+ Add Dashboard</button>
        </div>
      </div>

      {!stats.has_data ? (
        <SetupBoard site={selectedSite} />
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Realtime" val={stats.realtime?.count ?? 0} delta={stats.realtime?.delta ?? '—'} isLive />
            <StatCard label="People" val={stats.visitors?.count >= 1000 ? (stats.visitors.count/1000).toFixed(1)+'K' : (stats.visitors?.count ?? 0)} delta={stats.visitors?.delta ?? '—'} isUp />
            <StatCard label="Views" val={stats.views?.count >= 1000 ? (stats.views.count/1000).toFixed(1)+'K' : (stats.views?.count ?? 0)} delta={stats.views?.delta ?? '—'} isUp />
            <StatCard label="Avg. Time" val={stats.avgTime?.count ?? '00:00'} delta={stats.avgTime?.delta ?? '—'} isNeu />
            <StatCard label="Bounce Rate" val={stats.bounceRate?.count ?? '0%'} delta={stats.bounceRate?.delta ?? '—'} isNeu />
            <StatCard label="Events" val={stats.events?.count ?? 0} delta={stats.events?.delta ?? '—'} isUp />
          </div>

          <div className="chart-row">
            <div className="panel flex-[2]">
              <div className="panel-header">
                <div className="panel-title">Visitors Growth</div>
                {range === '30d' ? (
                  <div className="tab-group">
                    <div className={`tab ${mode==='day'?'active':''}`} onClick={()=>setMode('day')}>Day</div>
                    <div className={`tab ${mode==='week'?'active':''}`} onClick={()=>setMode('week')}>Week</div>
                  </div>
                ) : range === '7d' ? (
                  <div className="tab-group">
                    <div className="tab active">Day</div>
                  </div>
                ) : (
                  <div className="tab-group">
                    <div className="tab active">Hour</div>
                  </div>
                )}
              </div>
              <div className="p-4 h-[240px]"><Line data={lineData} options={lineOptions} /></div>
            </div>
            <div className="panel flex-1 flex flex-col">
              <div className="panel-header"><div className="panel-title">Live Activity</div><div className="live-dot" /></div>
              <div className="flex-1 overflow-y-auto pr-1">
                {stats.realtimeVisitors?.map((v:any,i:number)=><RealtimeRow key={i} path={v.path} code={v.code} />)}
              </div>
            </div>
          </div>

          <div className="bottom-row grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="panel flex flex-col h-[400px]">
                <div className="panel-header"><div className="panel-title">Top Pages</div></div>
                <div className="mt-2 space-y-1 overflow-y-auto flex-1 custom-scroll">{stats.topPages?.map((p:any,i:number)=><PageRow key={i} {...p}/>)}</div>
            </div>
            
            <div className="panel flex flex-col h-[400px]">
                <div className="panel-header"><div className="panel-title">Countries</div></div>
                <div className="mt-3 space-y-2 overflow-y-auto flex-1 custom-scroll">
                  {stats.countries?.map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 group hover:border-blue-ap/30 transition-colors">
                        <div className="flex items-center gap-3">
                          {c.code !== 'UN' ? (
                             <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} width={20} alt={c.name} className="shadow-sm rounded-[2px]" />
                          ) : (
                             <span className="text-xl">🌐</span>
                          )}
                          <span className="text-sm font-medium text-[#8892a4] group-hover:text-white truncate max-w-[100px]">{c.name}</span>
                        </div>
                        <div className="text-sm font-bold text-white font-sora">{c.count}</div>
                    </div>
                  ))}
                  {(!stats.countries || stats.countries.length === 0) && <div className="text-center text-xs text-[#8892a4] p-4">No data</div>}
                </div>
            </div>

            <div className="panel flex flex-col h-[400px] bg-transparent border-0 p-0 shadow-none">
                <div className="panel w-full flex-1 mb-4 flex flex-col h-[190px]">
                  <div className="panel-header"><div className="panel-title">Traffic Sources</div></div>
                  <div className="space-y-1.5 mt-2 flex-1 overflow-y-auto custom-scroll">{stats.trafficSources?.map((s:any,i:number)=><SourceItem key={i} {...s}/>)}</div>
                </div>
                <div className="panel w-full flex-1 flex flex-col h-[190px]">
                  <div className="panel-header"><div className="panel-title">Custom Events</div></div>
                  <div className="space-y-1 mt-2 flex-1 overflow-y-auto custom-scroll">
                     {stats.customEvents?.map((e:any,i:number)=>(
                         <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-transparent transition-colors">
                            <span className="text-[#8892a4] font-medium flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-blue-ap/50"></div>
                               {e.name}
                            </span>
                            <span className="text-white font-bold font-sora">{e.count}</span>
                         </div>
                     ))}
                     {(!stats.customEvents || stats.customEvents.length === 0) && <div className="text-xs text-[#8892a4] p-2 text-center">No custom events tracked.</div>}
                  </div>
                </div>
            </div>

            <div className="panel flex flex-col h-[400px]">
                <div className="panel-header"><div className="panel-title">Devices</div></div>
                <div className="mt-4 flex-1">
                     <DeviceRender raw={stats.devices_raw} pcts={stats.devices} />
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function DeviceRender({ raw, pcts }: any) {
    if (!raw || !pcts) return null;
    const d = [
        { label: 'Desktop', color: '#3578f7', val: raw.Desktop || 0, pct: pcts.Desktop || '0%', icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
        { label: 'Mobile', color: '#7040e0', val: raw.Mobile || 0, pct: pcts.Mobile || '0%', icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
        { label: 'Tablet', color: '#0ea5e9', val: raw.Tablet || 0, pct: pcts.Tablet || '0%', icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> }
    ]
    return (
        <div className="flex flex-col gap-8 pt-4 px-3 pb-2">
            {d.map((x, i) => (
                <div key={i} className="flex flex-col gap-2 group">
                    <div className="flex items-center justify-between text-[0.8rem]">
                        <div className="flex items-center gap-2 text-[#8892a4] group-hover:text-white transition-colors">
                           <div className="opacity-70 group-hover:opacity-100 transition-opacity bg-white/5 p-1 rounded-md">{x.icon}</div>
                           <span className="font-medium tracking-wide">{x.label}</span>
                        </div>
                        <div className="font-sora flex items-baseline gap-2">
                           <span className="text-white font-bold">{x.val}</span> 
                           <span className="text-[10px] text-[#8892a4] font-semibold tracking-tighter w-8 text-right">{x.pct}</span>
                        </div>
                    </div>
                    <div className="w-full h-[6px] bg-white/[0.04] rounded-full overflow-hidden relative border border-white/[0.02]">
                        <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ width: x.pct, backgroundColor: x.color }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

function SetupBoard({ site }: any) {
  return (
    <div className="panel p-10 flex flex-col items-center text-center gap-6 border-blue-ap/20 shadow-[0_0_50px_rgba(53,120,247,0.05)]">
       <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-ap to-blue-600 flex items-center justify-center text-4xl shadow-2xl">✨</div>
       <div>
          <h2 className="text-2xl font-bold font-sora text-white mb-2">Initialize {site?.name}</h2>
          <p className="text-[#8892a4] text-sm max-w-sm mb-6">Drop this script into your site's <code>&lt;head&gt;</code> to start tracking visits AND custom events.</p>
          <div className="bg-black/40 rounded-xl p-5 border border-white/10 text-left font-mono text-xs text-blue-ap relative group select-all overflow-x-auto">
             <pre>
{`<!-- Include once in your <head> -->
<script id="analytics-config">
  window.analyticsConfig = {
    apiUrl: 'http://localhost/apanalytics/apps/api/collect.php',
    projectId: '${site?.id}',
    debug: true
  };
</script>
<script src="http://localhost/apanalytics/apps/api/analytics.js" async></script>

<!-- To Track Custom Events -->
<script>
  function trackEvent(eventName) {
    if(window.analyticsConfig) {
      const url = \`\${window.analyticsConfig.apiUrl}?projectId=\${window.analyticsConfig.projectId}&event=\${encodeURIComponent(eventName)}\`;
      fetch(url, {mode:'no-cors', cache:'no-cache'});
    }
  }
</script>`}
             </pre>
          </div>
       </div>
    </div>
  )
}

function StatCard({ label, val, delta, isLive, isUp, isDown, isNeu }: any) {
  return (
    <div className={`stat-card ${isLive ? 'live-card' : ''} group hover:translate-y-[-2px] transition-all`}>
      <div className="stat-label flex justify-between">{label} {isLive && <div className="live-dot" />}</div>
      <div className="stat-val font-sora text-white">{val}</div>
      <div className={`stat-delta ${isUp ? 'delta-up' : isDown ? 'delta-down' : 'delta-neu'}`}>{delta}</div>
    </div>
  )
}

function RealtimeRow({ path, code }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 text-[0.72rem] group hover:bg-white/[0.02] px-2 rounded-lg transition-colors border-transparent">
      <div className="flex items-center gap-2 truncate">
         <div className="w-1.5 h-1.5 rounded-full bg-green-400 group-hover:scale-125 transition-transform" />
         <span className="text-[#8892a4] truncate group-hover:text-white transition-colors">{path}</span>
      </div>
      {code && code !== 'UN' ? (
         <img src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`} width={16} alt={code} className="shrink-0 ml-4 rounded-[2px]" />
      ) : (
         <span className="text-white shrink-0 ml-4">🌐</span>
      )}
    </div>
  )
}

function PageRow({ path, views, pct, width }: any) {
  return (
    <div className="flex items-center justify-between py-1.5 px-2 group hover:bg-white/[0.02] rounded-lg transition-colors">
      <div className="flex-1">
        <div className="text-[0.75rem] text-white flex items-center gap-1.5 font-medium"><span className="text-blue-ap opacity-50">/</span>{path!=='/'&&path.substring(1)}</div>
        <div className="w-full h-[3px] bg-white/[0.03] rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-blue-ap group-hover:bg-blue-400 transition-all rounded-full" style={{ width }} /></div>
      </div>
      <div className="text-right pl-4">
        <div className="text-[0.75rem] font-bold text-white font-sora tabular-nums">{views}</div>
        <div className="text-[0.6rem] text-[#8892a4] uppercase font-bold tracking-tighter tabular-nums">{pct}</div>
      </div>
    </div>
  )
}

function SourceItem({ icon, name, val, pct, bgColor }: any) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-transparent hover:border-white/[0.05] transition-colors">
      <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-sm">{icon}</div>
      <div className="flex-1 text-xs text-[#8892a4] font-medium truncate leading-tight group-hover:text-white transition-colors">{name}</div>
      <div className="text-right"><div className="text-[0.7rem] font-bold text-white tabular-nums">{val}</div><div className="text-[9px] text-[#8892a4] tabular-nums font-semibold tracking-tighter">{pct}</div></div>
    </div>
  )
}
