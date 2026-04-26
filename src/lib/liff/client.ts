'use client';

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || 'your-liff-id';

let isInitialized = false;
let initPromise: Promise<void> | null = null;

async function loadLiff() {
  const module = await import('@line/liff');
  return module.default;
}

export async function initLiff() {
  if (!LIFF_ID || typeof window === 'undefined') return null;

  const liff = await loadLiff();
  if (isInitialized) return liff;

  if (!initPromise) {
    initPromise = liff
      .init({
        liffId: LIFF_ID,
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        isInitialized = true;
      })
      .finally(() => {
        initPromise = null;
      });
  }

  await initPromise;
  return liff;
}

export async function getLiffIdToken() {
  const liff = await initLiff();
  if (!liff) {
    throw new Error('LIFF_ID_NOT_CONFIGURED');
  }

  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: window.location.href });
    return null;
  }

  const idToken = liff.getIDToken();
  if (!idToken) {
    throw new Error('LIFF_ID_TOKEN_NOT_AVAILABLE');
  }

  return idToken;
}
