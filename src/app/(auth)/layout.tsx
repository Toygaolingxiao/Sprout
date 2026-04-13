export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">🌱 Sprout</h1>
          <p className="mt-2 text-muted-foreground">
            夫婦で育てる、新しい命の準備
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
