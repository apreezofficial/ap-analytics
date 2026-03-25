'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Menu, ArrowRight, Globe, Camera, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

function LogoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [isLightMode, setIsLightMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);
    const [isMobileLegalOpen, setIsMobileLegalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Verify session with server if user exists
            if (parsedUser.id) {
                const checkSession = async () => {
                    try {
                        const { apiGet } = await import('../../lib/api');
                        await apiGet(`/user?id=${parsedUser.id}`);
                    } catch (e: any) {
                        // Only logout if the server explicitly says 404/401
                        // Network errors should be ignored to keep unstable connections logged in
                        if (e.response?.status === 404 || e.response?.status === 401) {
                            handleLogout();
                        }
                    }
                };
                checkSession();
            }
        }

        const lightPages = ['/developer', '/faq', '/privacy', '/terms'];
        setIsLightMode(lightPages.includes(window.location.pathname));
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    };

    const textColor = isLightMode ? 'text-black' : 'text-white';
    const subTextColor = isLightMode ? 'text-black/60' : 'text-white/60';
    const navBg = isLightMode ? 'bg-white/95' : 'bg-[#07090f]/80';
    const borderColor = isLightMode ? 'border-black/5' : 'border-white/10';
    const mobileBtnBg = 'bg-[#3578f7] text-white';

    const menuItems = [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/#pricing' },
        { name: 'Testimonials', href: '/testimonials' },
        { name: 'Demo', href: '/demo' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-6 md:px-6 pointer-events-none">
            <div className="max-w-7xl mx-auto flex justify-center pointer-events-auto">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`flex items-center justify-between w-full max-w-6xl px-8 py-4 rounded-full backdrop-blur-xl shadow-lg border ${borderColor} ${navBg}`}
                >
                    {/* Logo - Updated to APAnalytics */}
                    <Link
                        className={`flex items-center gap-2 text-[1.1rem] font-black tracking-tight ${textColor} hover:text-[#3578f7] transition-all z-[110] ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        href="/"
                    >
                        <div className="w-8 h-8 rounded-lg bg-[#3578f7]/10 border border-[#3578f7]/20 flex items-center justify-center text-[#3578f7]">
                          <LogoIcon size={18} />
                        </div>
                        <span className="hidden sm:inline">APAnalytics</span><span className="text-[#3578f7]">.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                className={`font-semibold text-[0.8rem] ${textColor} hover:text-[#3578f7] transition-colors`}
                                href={item.href}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <>
                                    <span className={`text-[0.8rem] font-semibold ${subTextColor}`}>Hi, {user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className={`text-[0.8rem] font-bold ${textColor} hover:text-[#3578f7] transition-colors px-4 py-2 border ${borderColor} rounded-full`}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className={`bg-[#3578f7] text-white text-[0.8rem] font-bold py-2.5 px-6 rounded-full hover:bg-[#3578f7]/90 transition-all shadow-lg shadow-[#3578f7]/20`}
                                >
                                    Login
                                </Link>
                            )}
                            <Link href="/register" className="bg-white/5 border border-white/10 text-white/60 hover:text-white text-[0.8rem] font-bold py-2.5 px-6 rounded-full transition-all">
                                Start for free
                            </Link>
                        </div>

                        {/* Mobile Toggle Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-3 rounded-full md:hidden z-[110] transition-all active:scale-95 shadow-lg ${mobileBtnBg}`}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ clipPath: 'circle(0% at 92% 3rem)' }}
                        animate={{ clipPath: 'circle(150% at 92% 3rem)' }}
                        exit={{ clipPath: 'circle(0% at 92% 3rem)' }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[105] bg-[#3578f7] md:hidden flex flex-col items-center justify-center p-8 pointer-events-auto"
                    >
                        <div className="w-full max-w-sm flex flex-col h-full justify-between py-12">
                            {/* Mobile Links Container */}
                            <div className="flex flex-col space-y-3 mt-16 overflow-y-auto max-h-[70vh] py-4">
                                {menuItems.map((item, i) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * i + 0.3 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-[2.2rem] font-black tracking-tight text-white/90 hover:text-white transition-colors"
                                        >
                                            {item.name}<span className="text-black/10">.</span>
                                        </Link>
                                    </motion.div>
                                ))}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="pt-8 border-t border-white/10"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    {user ? (
                                        <button
                                            onClick={handleLogout}
                                            className="text-white font-bold underline"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold underline">
                                            Login / Start
                                        </Link>
                                    )}
                                </div>
                                <p className="text-white/40 text-[0.6rem] font-bold uppercase tracking-[0.2em]">
                                    APAnalytics | Elite Digital Intelligence.
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}