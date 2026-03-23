'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchVisitors = async () => {
      const userJson = localStorage.getItem('user')
      const siteJson = localStorage.getItem('selected_site')
      if (!userJson || !siteJson) return setLoading(false)

      const uid = JSON.parse(userJson).id
      const sid = JSON.parse(siteJson).id

      try {
        const res = await fetch(`http://localhost/apanalytics/apps/api/stats.php?site_id=${sid}&user_id=${uid}&range=30d`)
        const data = await res.json()
        if (data.realtimeVisitors) {
          setVisitors(data.realtimeVisitors)
        }
      } catch (err) { console.error(err) }
      setLoading(false)
    }

    fetchVisitors()
  }, [])

  if (loading) return <div className="p-20 text-center text-[#8892a4]">Analyzing visitor logs...</div>

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">Visitors Explorar</h1>
          <p className="text-[#8892a4] text-sm mt-1">Detailed log of recent activity on your project.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="btn-sm btn-ghost">Export CSV</button>
           <button className="btn-sm btn-primary">Refresh Logs</button>
        </div>
      </div>

      <div className="panel overflow-hidden border-white/5 bg-transparent p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5 text-[0.65rem] uppercase font-bold text-[#8892a4] tracking-widest">
              <th className="px-6 py-4">Visitor</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Path</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visitors.length > 0 ? visitors.map((v: any, i: number) => {
               const parts = v.country ? v.country.split(' ') : ['🌐','Unknown'];
               const flag = parts[0];
               const country = parts.slice(1).join(' ') || 'Unknown';
               return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-ap/10 flex items-center justify-center text-xs text-blue-ap font-bold border border-blue-ap/20 group-hover:bg-blue-ap group-hover:text-white transition-all">
                        {v.path?.[1]?.toUpperCase() || 'V'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Anonymous User</span>
                        <span className="text-[10px] text-[#8892a4] font-mono opacity-60">ID: {Math.random().toString(16).slice(2, 8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{flag}</span>
                        <span className="text-sm text-[#8892a4]">{country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <code className="text-xs bg-white/5 px-2 py-1 rounded text-blue-ap font-medium">{v.path}</code>
                    </td>
                    <td className="px-6 py-4">
                       <span className="chip chip-green text-[10px] py-0.5 px-2">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="text-xs text-[#8892a4]">Just now</span>
                    </td>
                  </tr>
               )
            }) : (
              <tr><td colSpan={5} className="p-20 text-center text-[#8892a4]">No visitors yet. Start tracking to see real data!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
