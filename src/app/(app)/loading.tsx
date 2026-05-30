export default function AppLoading() {
  return (
    <main className="min-h-[100dvh] py-8">
      <div className="container-tight mb-6 flex items-center justify-between gap-4">
        <div className="h-3 w-32 rounded bg-[color-mix(in_srgb,var(--color-fg)_8%,transparent)]" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-32 rounded-[10px] bg-[color-mix(in_srgb,var(--color-fg)_6%,transparent)]" />
          <div className="h-7 w-24 rounded-[10px] bg-[color-mix(in_srgb,var(--color-fg)_6%,transparent)]" />
        </div>
      </div>
      <div className="container-tight grid gap-4">
        <SkeletonPanel className="h-44" />
        <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
          <SkeletonPanel className="h-72" />
          <SkeletonPanel className="h-72" />
        </div>
        <SkeletonPanel className="h-64" />
      </div>
    </main>
  );
}

function SkeletonPanel({ className = "" }: { className?: string }) {
  return (
    <div className={`panel relative overflow-hidden rounded-[22px] ${className}`}>
      <div className="absolute inset-0 animate-pulse bg-[color-mix(in_srgb,var(--color-fg)_3%,transparent)]" />
    </div>
  );
}
