interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export default function LoadingSpinner({
  size = "md",
  label = "Loading…",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}
      aria-label={label}
    >
      <div
        className={`animate-spin rounded-full border-primary/20 border-t-primary ${sizeMap[size]}`}
      />
      {label && (
        <p className="text-sm text-muted-foreground animate-fade-in">{label}</p>
      )}
    </div>
  );
}
