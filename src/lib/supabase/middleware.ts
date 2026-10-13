import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const pathname = request.nextUrl.pathname;
  const isStaticPublicAsset =
    pathname === '/manifest.json' ||
    pathname === '/ads.txt' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/sw.js' ||
    pathname === '/offline.html' ||
    /^\/(?:icons|images)\//.test(pathname) ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$/i.test(pathname);
  const liffStateRaw = request.nextUrl.searchParams.get('liff.state');

  if (isStaticPublicAsset) {
    return supabaseResponse;
  }

  if (pathname === '/' && liffStateRaw) {
    const decoded = decodeLiffState(liffStateRaw);
    const safePath = getSafePath(decoded);

    if (safePath.startsWith('/login')) {
      const loginUrl = new URL(safePath, request.url);
      if (!loginUrl.searchParams.has('liff')) {
        loginUrl.searchParams.set('liff', '1');
      }
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.redirect(new URL(safePath, request.url));
  }

  const publicPaths = ['/login', '/signup', '/reset-password', '/auth/', '/invite', '/api/', '/terms', '/privacy', '/tokusho'];
  const isPublicPath = pathname === '/' || publicPaths.some((path) => pathname.startsWith(path));
  const hasAuthCookie = request.cookies
    .getAll()
    .some(({ name }) => name.includes('-auth-token'));

  // Fast path: authenticated users hitting root can go directly to dashboard without auth round-trip.
  if (pathname === '/' && hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Fast path: unauthenticated access to public pages does not need Supabase round-trip.
  if (!hasAuthCookie && isPublicPath) {
    return supabaseResponse;
  }

  // Fast path: unauthenticated access to protected pages can be redirected immediately.
  if (!hasAuthCookie && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    user = sessionUser;
  } catch {
    // Supabase connection failed — treat as unauthenticated
  }

  // Redirect unauthenticated users to login for protected routes.
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Redirect root to dashboard if authenticated
  if (user && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
