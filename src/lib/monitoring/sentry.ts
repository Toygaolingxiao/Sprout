type ParsedDsn = {
  publicKey: string;
  host: string;
  projectId: string;
};

export function parseSentryDsn(dsn: string): ParsedDsn | null {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (!url.username || !url.host || !/^\d+$/.test(projectId)) return null;
    return { publicKey: url.username, host: url.host, projectId };
  } catch {
    return null;
  }
}

function stackFrames(stack: string | undefined) {
  if (!stack) return [];
  return stack
    .split('\n')
    .slice(1, 21)
    .map((line) => ({ filename: line.trim().slice(0, 300) }));
}

export async function captureException(error: unknown, tags?: Record<string, string>) {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  const parsed = parseSentryDsn(dsn);
  if (!parsed) return;

  const err = error instanceof Error ? error : new Error('Unknown error');
  const event = {
    event_id: crypto.randomUUID().replace(/-/g, ''),
    timestamp: new Date().toISOString(),
    platform: 'javascript',
    level: 'error',
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    message: { formatted: err.message.slice(0, 500) },
    exception: {
      values: [
        {
          type: err.name || 'Error',
          value: err.message.slice(0, 500),
          stacktrace: { frames: stackFrames(err.stack) },
        },
      ],
    },
    tags,
  };

  try {
    await fetch(`https://${parsed.host}/api/${parsed.projectId}/store/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Sentry-Auth': `Sentry sentry_version=7, sentry_client=sprout/1.0, sentry_key=${parsed.publicKey}`,
      },
      body: JSON.stringify(event),
    });
  } catch (sendError) {
    console.error('[sentry] delivery failed', sendError instanceof Error ? sendError.message : sendError);
  }
}
