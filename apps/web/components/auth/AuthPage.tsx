'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AuthPageProps {
  initialMode?: 'signup' | 'signin'
}

export function AuthPage({ initialMode = 'signup' }: Readonly<AuthPageProps>) {
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showEmailFields, setShowEmailFields] = useState(false)
  const router = useRouter()

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const action = mode === 'signup' ? 'signup' : 'signin'
      const res = await fetch(`http://localhost/apanalytics/apps/api/auth.php?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else if (mode === 'signup') {
        setMode('signin')
        setError('Account created! Please sign in.')
      } else {
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('Connection failed. Is the PHP server running?')
    } finally {
      setLoading(false)
    }
  }

  const isSignup = mode === 'signup'

  return (
    <div className="relative z-10 flex w-full h-svh star-bg overflow-hidden bg-[#07090f] text-white">
      {/* ── LEFT HALF ── */}
      <div className="relative flex items-center justify-center w-full md:w-1/2 h-full px-6">
        <div className="w-full max-w-sm animate-formIn">
          <div className="flex justify-center mb-6">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <g className="animate-spinDots origin-center">
                <circle cx="22" cy="5" r="2.2" fill="white" opacity=".9" />
                <circle cx="34.6" cy="9.4" r="1.8" fill="white" opacity=".7" />
                <circle cx="39" cy="22" r="2.2" fill="white" opacity=".9" />
                <circle cx="34.6" cy="34.6" r="1.8" fill="white" opacity=".7" />
                <circle cx="22" cy="39" r="2.2" fill="white" opacity=".9" />
                <circle cx="9.4" cy="34.6" r="1.8" fill="white" opacity=".7" />
                <circle cx="5" cy="22" r="2.2" fill="white" opacity=".9" />
                <circle cx="9.4" cy="9.4" r="1.8" fill="white" opacity=".7" />
              </g>
              <line x1="22" y1="14" x2="22" y2="30" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="14" y1="22" x2="30" y2="22" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="22" cy="22" r="2.4" fill="white" />
            </svg>
          </div>

          <h1 className="font-sora font-bold text-2xl text-white text-center mb-1.5">
            {isSignup ? 'Welcome to APAnalytics' : 'Welcome Back'}
          </h1>
          <p className="text-[#8892a4] text-sm text-center mb-8">
            {isSignup ? 'Please enter your details to create your account' : 'Log in to access your dashboard'}
          </p>

          {error && <p className="text-red-400 text-xs text-center mb-4 bg-red-400/10 p-2 rounded border border-red-400/20">{error}</p>}

          <div className="space-y-3 mb-5">
            <button className="w-full flex items-center justify-center gap-2.5 bg-[#0e1222] border border-white/10 rounded-xl py-3 text-sm font-dm transition-all hover:bg-[#161c32] hover:-translate-y-0.5">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2.5 bg-[#0e1222] border border-white/10 rounded-xl py-3 text-sm font-dm transition-all hover:bg-[#161c32] hover:-translate-y-0.5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                <path d="M13.18 1.5h2.47l-5.39 6.16L16.5 16.5h-4.97l-3.89-5.08-4.45 5.08H.72l5.77-6.59L1.5 1.5h5.1l3.52 4.65L13.18 1.5zm-.87 13.5h1.37L5.77 2.9H4.29l8.02 12.1z" />
              </svg>
              Continue with Twitter
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#3a4255] mb-5">
            <div className="flex-1 h-px bg-white/5" />
            OR
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {isSignup && !showEmailFields ? (
            <button
              onClick={() => setShowEmailFields(true)}
              className="w-full bg-white text-[#07090f] rounded-xl py-3.5 font-sora font-semibold text-sm transition-all hover:bg-[#dce5f5] shadow-lg shadow-white/10 active:translate-y-0 hover:-translate-y-0.5"
            >
              Continue with Email
            </button>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4 animate-formIn">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-[#0e1222]/90 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-ap/50 focus:ring-4 focus:ring-blue-ap/10 transition-all text-white placeholder:text-[#8892a4]/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-[#0e1222]/90 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-ap/50 focus:ring-4 focus:ring-blue-ap/10 transition-all text-white placeholder:text-[#8892a4]/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-[#07090f] rounded-xl py-3.5 font-sora font-semibold text-sm transition-all hover:bg-[#dce5f5] shadow-lg shadow-white/10 active:translate-y-0 hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="text-center text-xs text-[#8892a4] mt-6">
            {isSignup ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setShowEmailFields(true); }}
                  className="text-white font-semibold hover:text-[#3578f7] transition-colors"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setShowEmailFields(false); }}
                  className="text-white font-semibold hover:text-[#3578f7] transition-colors"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT HALF ── */}
      <div className="hidden md:flex items-center justify-center w-1/2 h-full px-10 relative">
        <div 
          className="absolute right-[-80px] bottom-[-60px] w-[420px] h-[420px] rounded-full blur-[60px] pointer-events-none" 
          style={{ background: 'radial-gradient(circle, rgba(100,60,220,0.55) 0%, rgba(60,30,160,0.25) 45%, transparent 72%)' }}
        />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-px bg-gradient-to-b from-transparent via-[rgba(53,80,180,0.3)] to-transparent" />

        <div className="w-full max-w-md relative z-10 animate-formIn" style={{ animationDelay: '.3s' }}>
          <div className="glass rounded-[18px] overflow-hidden shadow-2xl">
            <div className="p-6 pb-4">
              <h2 className="font-sora font-bold text-white text-lg mb-2">Privacy-first by design</h2>
              <p className="text-[#8892a4] text-xs leading-relaxed mb-4">
                APAnalytics doesn&apos;t use cookies or store personal data. You stay fully compliant with GDPR, CCPA, and other privacy laws — without needing consent banners
              </p>
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-white font-sora font-medium hover:gap-3 transition-all group">
                Back to Site <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </div>

            <div className="relative mx-3 mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-[#080c1c] to-[#0e1228] border border-[rgba(53,80,180,0.18)] min-h-[220px]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(53,80,180,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(53,80,180,.15) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

              <div className="absolute inset-0 flex items-center justify-center pb-12">
                <div 
                  className="animate-shieldPulse absolute w-[160px] h-[160px] blur-[22px]"
                  style={{ background: 'radial-gradient(circle, rgba(80,50,200,0.5) 0%, rgba(50,30,160,0.2) 50%, transparent 72%)' }}
                />
                <svg width="90" height="103" viewBox="0 0 110 126" fill="none" className="relative z-10">
                  <path d="M55 4L8 22V60C8 88 28 112 55 122C82 112 102 88 102 60V22L55 4Z" fill="rgba(18,12,45,0.95)" stroke="rgba(90,60,200,0.6)" strokeWidth="2" />
                  <path d="M55 14L18 29V60C18 83 34 103 55 112C76 103 92 83 92 60V29L55 14Z" fill="rgba(26,16,62,0.85)" stroke="rgba(90,60,200,0.22)" strokeWidth="1" />
                  <rect x="43" y="55" width="24" height="20" rx="3" fill="rgba(90,60,200,0.45)" stroke="rgba(130,100,255,0.6)" strokeWidth="1.5" />
                  <path d="M48 55V49C48 45.7 51.1 43 55 43C58.9 43 62 45.7 62 49V55" stroke="rgba(130,100,255,0.7)" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <circle cx="55" cy="65" r="3" fill="rgba(160,130,255,0.95)" />
                  <circle cx="55" cy="62" r="30" stroke="rgba(80,50,180,0.18)" strokeWidth="16" fill="none" />
                </svg>
              </div>

              <div className="absolute left-5 bottom-14 animate-floatA z-20">
                <div className="bg-gradient-to-br from-[rgba(55,40,130,0.96)] to-[rgba(75,50,170,0.96)] border border-[rgba(100,70,200,0.45)] rounded-2xl p-2.5 shadow-2xl">
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-[rgba(120,90,220,0.8)] flex items-center justify-center text-[8px]">⚙</div>
                    {new Array(5).fill(null).map((_, i) => (
                      <div key={i} className={`w-3.5 h-3.5 rounded ${i === 3 ? 'bg-[rgba(110,80,210,0.7)]' : 'bg-[rgba(80,60,180,0.5)]'}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute right-5 bottom-16 animate-floatB z-20">
                <div className="bg-[rgba(8,10,24,0.96)] border border-[rgba(70,90,200,0.35)] rounded-xl py-2 px-3 shadow-2xl">
                  <p className="text-[8px] font-sora font-semibold text-[#8892a4] mb-1 uppercase">GDPR</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[9px] text-white font-sora">Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
