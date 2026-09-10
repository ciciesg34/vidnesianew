import { SkeletonGrid } from '@/components/SkeletonCard';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
      <div className="h-6 w-40 skeleton rounded mb-4" />
      <SkeletonGrid count={8} />
    </div>
  );
}