export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 animate-pulse" aria-hidden="true">
      <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-700 rounded w-5/6" />
        <div className="h-4 bg-gray-700 rounded w-4/6" />
      </div>
    </div>
  );
}

export function TaskItemSkeleton() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 animate-pulse" aria-hidden="true">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-700 rounded w-2/3" />
            <div className="h-4 bg-gray-700 rounded w-16" />
          </div>
          <div className="h-3 bg-gray-700 rounded w-1/2 mt-2" />
        </div>
        <div className="h-4 bg-gray-700 rounded w-20" />
      </div>
    </div>
  );
}

export function GoalItemSkeleton() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 animate-pulse" aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 bg-gray-700 rounded w-20" />
            <div className="h-4 bg-gray-700 rounded w-16" />
          </div>
          <div className="h-5 bg-gray-700 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-700 rounded w-1/3 mt-2" />
        </div>
        <div className="h-4 bg-gray-700 rounded w-12" />
      </div>
    </div>
  );
}

export function CheckInItemSkeleton() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 animate-pulse" aria-hidden="true">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 bg-gray-700 rounded-full" />
            <div className="h-4 bg-gray-700 rounded w-16" />
            <div className="h-4 bg-gray-700 rounded w-20" />
          </div>
          <div className="h-3 bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-700 rounded w-1/3 mt-2" />
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 animate-pulse" aria-hidden="true">
      <div className="grid gap-4">
        <div>
          <div className="h-4 bg-gray-700 rounded w-16 mb-2" />
          <div className="h-10 bg-gray-700 rounded w-full" />
        </div>
        <div>
          <div className="h-4 bg-gray-700 rounded w-20 mb-2" />
          <div className="h-24 bg-gray-700 rounded w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 bg-gray-700 rounded w-16 mb-2" />
            <div className="h-10 bg-gray-700 rounded w-full" />
          </div>
          <div>
            <div className="h-4 bg-gray-700 rounded w-16 mb-2" />
            <div className="h-10 bg-gray-700 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
