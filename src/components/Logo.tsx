export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "brand brand--compact" : "brand"} aria-label="ScreenSense">
      <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M15 10v44l34-22L15 10Z" />
        <path d="m32 39 8 8 14-16" />
      </svg>
      {!compact && (
        <div className="brand__name">
          SCREEN<span>SENSE</span>
        </div>
      )}
    </div>
  );
}
