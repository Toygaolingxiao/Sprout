import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="flex flex-col items-center gap-3 pt-6">
          <span className="text-4xl animate-bounce">🌱</span>
          <p className="text-sm text-muted-foreground animate-pulse">読み込み中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
