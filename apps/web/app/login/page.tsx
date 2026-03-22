import { AuthPage } from '@/components/auth/AuthPage'

export const metadata = {
  title: 'Sign In – APAnalytics',
  description: 'Log in to your APAnalytics account to access your dashboard.',
}

export default function LoginPage() {
  return <AuthPage initialMode="signin" />
}
