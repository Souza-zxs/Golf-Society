export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`bg-green py-10 sm:py-14 ${className}`}>
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        <span className="h-px w-14 bg-gold-soft/25 sm:w-24" />
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-gold-soft/50"
        >
          <path d="M6 21V3" />
          <path d="M6 4l12 3.2L6 10.4" />
        </svg>
        <span className="h-px w-14 bg-gold-soft/25 sm:w-24" />
      </div>
    </div>
  );
}
