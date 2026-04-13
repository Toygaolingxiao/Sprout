import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-6 space-y-4">
          <span className="text-5xl">🌱</span>
          <h1 className="text-xl font-bold">ページが見つかりません</h1>
          <p className="text-sm text-muted-foreground">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
          <Link href="/dashboard">
            <Button className="mt-2">ホームに戻る</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
