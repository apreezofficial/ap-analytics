'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [site, setSite] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [whitelisted, setWhitelisted] = useState<string[]>([])
  const [newDomain, setNewDomain] = useState('')
  const [toast, setToast] = useState('')

  // Delete Project Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const updateSite = () => {
       const saved = localStorage.getItem('selected_site')
       if (saved) {
           const s = JSON.parse(saved)
           setSite(s)
           setWhitelisted(s.whitelist || [s.name, `www.${s.name}`])
       }
       const savedU = localStorage.getItem('user')
       if (savedU) setUser(JSON.parse(savedU))
    }
    updateSite()
    window.addEventListener('siteChanged', updateSite)
    return () => window.removeEventListener('siteChanged', updateSite)
  }, [])

  const notify = (msg: string) => {
      setToast(msg)
      setTimeout(() => setToast(''), 4000)
  }

  const handleAddDomain = (e: React.FormEvent) => {
      e.preventDefault()
      if (newDomain.trim() && !whitelisted.includes(newDomain.trim())) {
          setWhitelisted([...whitelisted, newDomain.trim()])
          setNewDomain('')
      }
  }

  const handleRemoveDomain = (idx: number) => {
      setWhitelisted(whitelisted.filter((_, i) => i !== idx))
  }

  const saveWhitelist = async () => {
       if (!user || !site) return;
       try {
           const res = await fetch(`http://localhost/apanalytics/apps/api/sites.php?action=update&user_id=${user.id}`, {
               method: 'POST', headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ id: site.id, whitelist: whitelisted })
           })
           const data = await res.json()
           if (data.success) {
               const updatedSite = { ...site, whitelist: whitelisted }
               localStorage.setItem('selected_site', JSON.stringify(updatedSite))
               setSite(updatedSite)
               notify('Domain Whitelist successfully saved.')
           } else {
               notify('Error saving whitelist.')
           }
       } catch (e) { notify('Network error.') }
  }

  const confirmDeleteProject = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!deletePassword) return;
      setDeleting(true);
      try {
           const res = await fetch(`http://localhost/apanalytics/apps/api/sites.php?action=delete&user_id=${user.id}`, {
               method: 'POST', headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ id: site.id, password: deletePassword })
           })
           const data = await res.json()
           if (data.success) {
               // Successfully deleted, now we need to trigger a site refresh
               localStorage.removeItem('selected_site')
               window.dispatchEvent(new Event('siteChanged')) // This tells topbar to load any fallback site
               setShowDeleteModal(false)
               router.push('/dashboard')
           } else {
               notify(data.error || 'Password verification failed. Try again.')
               setDeleting(false);
           }
      } catch (e) { notify('Network error.'); setDeleting(false); }
  }

  if (!site) return null

  return (
    <div className="flex flex-col gap-6 lg:gap-8 animate-fade-in pb-12 pt-2 w-full max-w-5xl relative">
      {toast && (
         <div className="fixed bottom-6 right-6 bg-blue-ap text-white font-medium px-4 py-3 rounded-lg shadow-[0_0_20px_rgba(53,120,247,0.4)] animate-slide-up z-50 flex items-center gap-3">
             <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
             {toast}
         </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-4">
              <div className="bg-[#0b0e17] border border-red-500/20 shadow-[0_20px_60px_rgba(239,68,68,0.1)] rounded-2xl p-8 max-w-md w-full relative">
                  <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 text-[#8892a4] hover:text-white transition-colors">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <h2 className="text-xl font-sora font-bold text-white mb-2">Delete {site.name}</h2>
                  <p className="text-sm text-[#8892a4] mb-6">This action is permanent and cannot be undone. All custom events, pings, and traffic data will be instantly destroyed.</p>
                  
                  <form onSubmit={confirmDeleteProject} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-[#8892a4]">Confirm your password</label>
                          <input 
                              type="password" 
                              required 
                              placeholder="Type password..."
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                              className="bg-black/50 border border-white/10 focus:border-red-500 text-white px-4 py-2.5 rounded-lg outline-none transition-colors"
                          />
                      </div>
                      <button type="submit" disabled={deleting || !deletePassword} className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-sora font-semibold py-3 rounded-lg mt-2 transition-colors">
                          {deleting ? 'Devastating...' : 'Permanently Delete Project'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      <div>
        <h1 className="font-sora font-bold text-2xl text-white">Project Settings</h1>
        <p className="text-[#8892a4] text-sm mt-1">Configure {site.name} tracking rules, whitelists, and API access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TRACKING SCRIPT + UTM */}
          <div className="flex flex-col gap-6">
              <div className="panel border border-white/10">
                 <div className="panel-header border-b border-white/5 pb-4 mb-4">
                     <div className="panel-title flex items-center gap-2">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        Tracking Endpoint
                     </div>
                 </div>
                 <div className="flex flex-col gap-4">
                    <p className="text-sm text-[#8892a4]">Embed this script in the <code>&lt;head&gt;</code> of your application to automatically track Page Views, Demographics, and basic UTM parameters.</p>
                    <div className="relative group">
                       <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { notify('Script copied to clipboard!'); navigator.clipboard.writeText(`<script>window.analyticsConfig={apiUrl:'http://localhost/apanalytics/apps/api/collect.php',projectId:'${site.id}'};</script><script src="http://localhost/apanalytics/apps/api/analytics.js" async></script>`) }} className="bg-white/10 hover:bg-white/20 text-white text-[10px] px-2 py-1 rounded">Copy</button>
                       </div>
                       <pre className="bg-black/50 border border-white/5 rounded-lg p-4 custom-scroll overflow-x-auto text-[11px] font-mono text-blue-ap/80 leading-relaxed">
{`<script id="analytics-config">
  window.analyticsConfig = {
    apiUrl: 'http://localhost/apanalytics/apps/api/collect.php',
    projectId: '${site.id}'
  };
</script>
<script src="http://localhost/apanalytics/apps/api/analytics.js" async></script>`}
                       </pre>
                    </div>
                 </div>
              </div>

              <div className="panel border border-white/10">
                 <div className="panel-header border-b border-white/5 pb-4 mb-4">
                     <div className="panel-title flex items-center gap-2">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                        Data Access API
                     </div>
                 </div>
                 <div className="flex flex-col gap-4">
                    <p className="text-sm text-[#8892a4]">Retrieve your stats securely to display on your own frontend endpoints or internal systems.</p>
                    <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 flex items-center justify-between group">
                       <span className="text-xs text-[#8892a4] truncate font-mono">GET /api/stats.php?site_id={site.id}&root=true</span>
                       <button className="text-blue-ap hover:text-white transition-colors" title="Copy Endpoint" onClick={() => { notify('Endpoint copied!'); navigator.clipboard.writeText(`http://localhost/apanalytics/apps/api/stats.php?site_id=${site.id}&user_id=${user?.id}`) }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                       </button>
                    </div>
                 </div>
              </div>
          </div>

          {/* WHITELISTING + ACTIONS */}
          <div className="flex flex-col gap-6">
              <div className="panel border border-white/10">
                 <div className="panel-header border-b border-white/5 pb-4 mb-4 flex items-center justify-between">
                     <div className="panel-title flex items-center gap-2">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Domain Whitelist
                     </div>
                     <button onClick={saveWhitelist} className="text-xs text-blue-ap hover:text-white font-bold tracking-widest uppercase transition-colors">Save</button>
                 </div>
                 <div className="flex flex-col gap-4">
                    <p className="text-sm text-[#8892a4]">Only tracking requests originating from these exact domains will be accepted by your API endpoint. Localhost is permitted for testing.</p>
                    
                    <form onSubmit={handleAddDomain} className="flex items-center gap-2">
                        <input 
                           type="text" 
                           placeholder="e.g. docs.mysite.com"
                           value={newDomain}
                           onChange={(e) => setNewDomain(e.target.value)}
                           className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-ap transition-colors"
                        />
                        <button type="submit" className="btn-sm btn-primary">Add</button>
                    </form>

                    <div className="flex flex-col gap-2 mt-2 max-h-[200px] overflow-y-auto custom-scroll">
                        {whitelisted.map((d, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-blue-ap/30 transition-colors">
                                <span className="text-sm text-white font-medium">{d}</span>
                                <button onClick={() => handleRemoveDomain(i)} className="text-[#8892a4] hover:text-red-400 transition-colors">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>

              <div className="panel border border-red-500/20 bg-red-500/5">
                 <div className="panel-header border-b border-red-500/10 pb-4 mb-4">
                     <div className="panel-title flex items-center gap-2 text-red-400">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Danger Zone
                     </div>
                 </div>
                 <div className="flex items-center justify-between">
                     <div>
                         <h4 className="text-white font-semibold text-sm">Delete Project</h4>
                         <p className="text-[11px] text-[#8892a4] mt-0.5">Permanently remove {site.name} immediately.</p>
                     </div>
                     <button onClick={() => setShowDeleteModal(true)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-red-500/20">Delete</button>
                 </div>
              </div>
          </div>
      </div>
    </div>
  )
}
