import { LoginForm } from '@/components/auth/login-form'

interface LoginPageProps {
  searchParams: Promise<{ next?: string; liff?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, liff } = await searchParams;
  const nextPath = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
  const autoLiff = liff === '1';
  return <LoginForm nextPath={nextPath} autoLiff={autoLiff} />
}

