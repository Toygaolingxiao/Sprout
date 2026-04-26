import { LoginForm } from '@/components/auth/login-form'

interface LoginPageProps {
  searchParams: Promise<{ next?: string; liff?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, liff, error } = await searchParams;
  const nextPath = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
  const autoLiff = liff === '1';
  const initialErrorCode = typeof error === 'string' ? error : null;
  return <LoginForm nextPath={nextPath} autoLiff={autoLiff} initialErrorCode={initialErrorCode} />
}

