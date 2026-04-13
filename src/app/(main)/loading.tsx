export default function MainLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 rounded-2xl bg-muted" />
      <div className="h-10 rounded-full bg-muted w-3/4" />
      <div className="h-20 rounded-xl bg-muted" />
      <div className="space-y-2">
        <div className="h-16 rounded-xl bg-muted" />
        <div className="h-16 rounded-xl bg-muted" />
        <div className="h-16 rounded-xl bg-muted" />
      </div>
    </div>
  );
}
