export function StatusLegend() {
  return (
    <div className="mb-4 text-xs text-muted-foreground">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-200 dark:bg-yellow-950/50 border-l-2 border-l-yellow-400 dark:border-l-yellow-500"></div>
          <span>Modified (pending save)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-200 dark:bg-blue-950/50 border-l-2 border-l-blue-400 dark:border-l-blue-500"></div>
          <span>Saving...</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-200 dark:bg-green-950/50 border-l-2 border-l-green-400 dark:border-l-green-500"></div>
          <span>Graded</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-200 dark:bg-red-950/50 border-l-2 border-l-red-400 dark:border-l-red-500"></div>
          <span>Error</span>
        </div>
      </div>
    </div>
  );
}
