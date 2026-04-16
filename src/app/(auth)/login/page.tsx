import { LoginForm } from '@/components/auth/login-form'

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
  return <LoginForm nextPath={nextPath} />
}

