'use client';

import { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void fetch('/api/monitoring/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        name: error.name,
        stack: error.stack,
        digest: error.digest,
      }),
    });
  }, [error]);

  return (
    <html lang="ja">
      <body style={{ fontFamily: 'sans-serif', margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <main style={{ textAlign: 'center', padding: '2rem' }}>
          <h1>エラーが発生しました</h1>
          <p>予期しない問題が起きました。もう一度お試しください。</p>
          <button type="button" onClick={reset}>もう一度試す</button>
        </main>
      </body>
    </html>
  );
}
