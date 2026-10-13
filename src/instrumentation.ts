import { captureException } from '@/lib/monitoring/sentry';

export async function register() {
  // Sentry is enabled only when SENTRY_DSN is present.
}

export async function onRequestError(
  error: unknown,
  request: { path: string; method: string },
  context: { routePath: string; routerKind: string },
) {
  await captureException(error, {
    source: 'server',
    method: request.method,
    path: request.path.slice(0, 200),
    route: context.routePath.slice(0, 200),
    router: context.routerKind,
  });
}
