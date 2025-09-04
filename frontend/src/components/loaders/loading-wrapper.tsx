import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  showSpinner?: boolean;
  spinnerSize?: "sm" | "md" | "lg";
}

export function LoadingWrapper({
  isLoading,
  children,
  fallback,
  className,
  showSpinner = false,
  spinnerSize = "md",
}: LoadingWrapperProps) {
  const spinnerSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showSpinner) {
      return (
        <div className={cn("flex items-center justify-center p-4", className)}>
          <Loader2 className={cn("animate-spin", spinnerSizes[spinnerSize])} />
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}
