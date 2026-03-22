import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'APAnalytics – Privacy-First Web Analytics',
  description:
    'Understand your visitors with real-time insights. No cookies, no personal data, no tracking banners. GDPR ready.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#07090f] text-white font-dm antialiased">{children}</body>
    </html>
  )
}
