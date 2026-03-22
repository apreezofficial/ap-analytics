import { AuthPage } from '@/components/auth/AuthPage'

export const metadata = {
  title: 'Sign Up – APAnalytics',
  description: 'Create your APAnalytics account to start tracking your visitors.',
}

export default function RegisterPage() {
  return <AuthPage initialMode="signup" />
}
