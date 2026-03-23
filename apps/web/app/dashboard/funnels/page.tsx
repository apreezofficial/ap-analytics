'use client'

import React, { useEffect, useState } from 'react'

export default function FunnelsPage() {
  const [loading, setLoading] = useState(true)
  const [availablePaths, setAvailablePaths] = useState<string[]>([])
  const [availableEvents, setAvailableEvents] = useState<string[]>([])
  const [steps, setSteps] = useState([{ type: 'page_view', value: '/' }])
  const [funnelData, setFunnelData] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const fetchOptions = async () => {
    const userJson = localStorage.getItem('user')
    const siteJson = localStorage.getItem('selected_site')
    if (!userJson || !siteJson) return setLoading(false)

    const uid = JSON.parse(userJson).id
    const sid = JSON.parse(siteJson).id

    try {
      const res = await fetch(`http://localhost/apanalytics/apps/api/funnels.php?site_id=${sid}&user_id=${uid}`)
      const data = await res.json()
      if (data.paths) setAvailablePaths(data.paths)
      if (data.events) setAvailableEvents(data.events)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  useEffect(() => {
    fetchOptions()
  }, [])

  const handleAddStep = () => {
    setSteps([...steps, { type: 'page_view', value: availablePaths[0] || '/' }])
  }

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const handleUpdateStep = (index: number, key: string, val: string) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [key]: val }
    if (key === 'type') {
       newSteps[index].value = val === 'page_view' ? (availablePaths[0] || '/') : (availableEvents[0] || 'custom_event')
    }
    setSteps(newSteps)
  }

  const analyzeFunnel = async () => {
    setAnalyzing(true)
    const userJson = localStorage.getItem('user')
    const siteJson = localStorage.getItem('selected_site')
    if (!userJson || !siteJson) return setAnalyzing(false)
    const uid = JSON.parse(userJson).id
    const sid = JSON.parse(siteJson).id
    
    // Format steps: "page_view|/pricing,custom|buy_click"
    const stepParam = steps.map(s => `${s.type}|${s.value}`).join(',')
    
    try {
      const res = await fetch(`http://localhost/apanalytics/apps/api/funnels.php?site_id=${sid}&user_id=${uid}&steps=${encodeURIComponent(stepParam)}`)
      const data = await res.json()
      setFunnelData(data)
    } catch (err) { console.error(err) }
    setAnalyzing(false)
  }

  if (loading) return <div className="p-20 text-center text-[#8892a4]">Loading funnel engine...</div>

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Funnel Analysis</h1>
          <p className="text-[#8892a4] text-sm mt-1">Track drop-off rates across sequences of pages and custom events.</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
         {/* BUILDER SIDE */}
         <div className="panel w-full xl:w-[350px] shrink-0 flex flex-col gap-4 sticky top-4 h-fit border-blue-ap/10 shadow-[0_5px_30px_rgba(53,120,247,0.03)]">
            <div className="panel-header border-b border-white/5 pb-3">
               <div className="panel-title flex items-center gap-2"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Funnel Steps</div>
            </div>
            
            <div className="flex flex-col gap-3">
               {steps.map((step, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5 relative group">
                     {i > 0 && <button onClick={() => handleRemoveStep(i)} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded bg-blue-ap/10 text-blue-ap text-xs font-bold flex items-center justify-center">{i + 1}</div>
                        <span className="text-xs font-semibold text-[#8892a4]">Step Type</span>
                     </div>
                     <select className="bg-black/40 border border-white/10 rounded-md text-sm text-white px-2 py-1.5 focus:border-blue-ap outline-none transition-colors" value={step.type} onChange={(e) => handleUpdateStep(i, 'type', e.target.value)}>
                        <option value="page_view">Page View</option>
                        <option value="custom">Custom Event</option>
                     </select>
                     
                     <div className="mt-1">
                        <select className="bg-black/40 border border-white/10 rounded-md text-sm text-white px-2 py-1.5 focus:border-blue-ap outline-none transition-colors w-full" value={step.value} onChange={(e) => handleUpdateStep(i, 'value', e.target.value)}>
                           {step.type === 'page_view' ? (
                              availablePaths.length > 0 ? availablePaths.map(p => <option key={p} value={p}>{p}</option>) : <option value="/">/ (No pages yet)</option>
                           ) : (
                              availableEvents.length > 0 ? availableEvents.map(e => <option key={e} value={e}>{e}</option>) : <option value="click">No events yet</option>
                           )}
                        </select>
                     </div>
                  </div>
               ))}
               
               <button onClick={handleAddStep} className="mt-2 py-2 rounded-lg border border-dashed border-white/20 text-[#8892a4] hover:text-white hover:border-white/40 hover:bg-white/[0.02] text-sm transition-all flex items-center justify-center gap-2">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add another step
               </button>
            </div>

            <button onClick={analyzeFunnel} disabled={analyzing} className="mt-4 w-full bg-blue-ap hover:bg-blue-600 text-white font-sora font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
               {analyzing ? <div className="loader w-4 h-4 border-2"></div> : <><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg> Analyze Funnel</>}
            </button>
         </div>

         {/* VISUALIZATION SIDE */}
         <div className="flex-1 flex flex-col gap-6">
            {!funnelData ? (
               <div className="panel h-full flex items-center justify-center min-h-[400px] border border-dashed border-white/10 bg-transparent shadow-none">
                  <div className="text-center flex flex-col items-center gap-4 opacity-50">
                     <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                     <div>
                        <h3 className="text-white font-sora font-medium">Build your funnel</h3>
                        <p className="text-sm">Configure steps on the left and hit Analyze.</p>
                     </div>
                  </div>
               </div>
            ) : (
               <>
                  <div className="panel bg-gradient-to-r from-blue-ap/10 to-transparent border border-blue-ap/20 p-6 flex items-center justify-between">
                     <div>
                        <div className="text-[0.65rem] uppercase tracking-widest text-[#8892a4] font-bold mb-1">Overall Conversion Rate</div>
                        <div className="text-4xl font-sora font-bold text-white shadow-sm inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{funnelData.overall_conversion}</div>
                     </div>
                     <div className="text-right">
                        <div className="text-[0.65rem] uppercase tracking-widest text-[#8892a4] font-bold mb-1">Total Starts</div>
                        <div className="text-2xl font-sora font-semibold text-white">{funnelData.total_starts}</div>
                     </div>
                  </div>
                  
                  <div className="panel px-4 py-8 relative">
                     <div className="absolute left-[38px] top-[10%] bottom-[10%] w-[2px] bg-gradient-to-b from-blue-ap via-blue-ap/50 to-transparent z-0 hidden sm:block"></div>
                     <div className="flex flex-col gap-2 relative z-10 w-full">
                        {funnelData.steps.map((fStep: any, i: number) => {
                           // calc bar width based on max starts
                           const maxCount = funnelData.steps[0].count || 1;
                           const barWidth = Math.max((fStep.count / maxCount) * 100, 1) + '%';
                           
                           return (
                              <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
                                 {/* Step Node */}
                                 <div className="shrink-0 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full border-4 border-[#07090f] bg-blue-ap shadow-[0_0_15px_rgba(53,120,247,0.4)] flex items-center justify-center text-white font-bold font-sora z-10 hidden sm:flex">{fStep.step}</div>
                                    <div className="w-[120px] shrink-0 pt-1">
                                       <div className="text-[0.6rem] uppercase tracking-wider text-blue-ap font-bold">{fStep.type === 'page_view' ? 'Page' : 'Event'}</div>
                                       <div className="text-sm font-semibold text-white truncate" title={fStep.name}>{fStep.name}</div>
                                    </div>
                                 </div>
                                 
                                 {/* Bar Chart */}
                                 <div className="flex-1 w-full pl-0 sm:pl-2 pt-1 pb-4">
                                    <div className="flex items-end justify-between mb-1.5 px-0.5">
                                       <span className="font-sora font-bold text-white text-lg tabular-nums">{fStep.count} <span className="text-[0.6rem] text-[#8892a4] font-sans font-medium">USERS</span></span>
                                       {i > 0 && <span className="text-[0.65rem] text-[#8892a4] font-semibold tracking-tighter tabular-nums bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/5">{fStep.conversion} from prev</span>}
                                    </div>
                                    <div className="w-full h-8 bg-white/[0.02] rounded-r-xl rounded-l-md border-y border-r border-white/5 overflow-hidden">
                                       <div className="h-full bg-gradient-to-r from-blue-ap/80 to-[#7040e0]/80 rounded-r-lg shadow-[0_0_20px_rgba(53,120,247,0.2)] transition-all duration-1000 relative" style={{ width: barWidth }}>
                                          {/* Striped overlay */}
                                          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }}></div>
                                       </div>
                                    </div>
                                    {i > 0 && fStep.dropoff > 0 && (
                                       <div className="text-[0.65rem] text-red-400 mt-2 font-medium flex items-center gap-1">
                                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
                                          Dropped off: {fStep.dropoff}
                                       </div>
                                    )}
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </div>
               </>
            )}
         </div>
      </div>
    </div>
  )
}
