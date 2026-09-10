export default function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl overflow-hidden border border-white/5">
      <div className="aspect-video skeleton" />
      <div className="p-3 space-y-3">
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-8 skeleton rounded-lg w-full mt-2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}