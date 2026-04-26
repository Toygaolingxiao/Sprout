import { LandingPage } from '@/components/landing/landing-page';
import { redirect } from 'next/navigation';

function getSafePath(rawPath: string | null | undefined, fallback = '/login') {
  if (!rawPath || rawPath.length === 0) return fallback;
  if (!rawPath.startsWith('/')) return fallback;
  if (rawPath.startsWith('//')) return fallback;
  return rawPath;
}

function decodeLiffState(rawState: string) {
  try {
    return decodeURIComponent(rawState);
  } catch {
    return rawState;
  }
}

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const liffStateRaw = typeof params['liff.state'] === 'string' ? params['liff.state'] : undefined;

  if (liffStateRaw) {
    const decoded = decodeLiffState(liffStateRaw);
    const safePath = getSafePath(decoded);

    if (safePath.startsWith('/login')) {
      const loginUrl = new URL(safePath, 'https://placeholder.local');
      if (!loginUrl.searchParams.has('liff')) {
        loginUrl.searchParams.set('liff', '1');
      }
      redirect(`${loginUrl.pathname}${loginUrl.search}`);
    }

    redirect(safePath);
  }

  return <LandingPage />;
}

