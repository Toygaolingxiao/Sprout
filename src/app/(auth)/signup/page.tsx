import { SignupForm } from '@/components/auth/signup-form'

interface SignupPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { next } = await searchParams;
  const nextPath = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
  return <SignupForm nextPath={nextPath} />
}

