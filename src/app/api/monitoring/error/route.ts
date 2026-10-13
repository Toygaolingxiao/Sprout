import { NextResponse } from 'next/server';
import { captureException } from '@/lib/monitoring/sentry';
import { rateLimit } from '@/lib/security/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (!rateLimit(`monitor:${ip}`, 30, 60 * 60 * 1000).ok) {
    return NextResponse.json({ ok: true });
  }

  let record: Record<string, unknown>;
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    record = body as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const message = typeof record.message === 'string' ? record.message.slice(0, 500) : 'Unknown client error';
  const error = new Error(message);
  error.name = typeof record.name === 'string' ? record.name.slice(0, 80) : 'Error';
  if (typeof record.stack === 'string') error.stack = record.stack.slice(0, 4000);

  await captureException(error, {
    source: 'client',
    digest: typeof record.digest === 'string' ? record.digest.slice(0, 80) : '',
  });

  return NextResponse.json({ ok: true });
}
