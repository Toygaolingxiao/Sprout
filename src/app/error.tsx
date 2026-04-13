"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-6 space-y-4">
          <span className="text-5xl">😢</span>
          <h1 className="text-xl font-bold">エラーが発生しました</h1>
          <p className="text-sm text-muted-foreground">
            予期しない問題が起きました。もう一度お試しください。
          </p>
          <Button onClick={reset} className="mt-2">
            もう一度試す
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
