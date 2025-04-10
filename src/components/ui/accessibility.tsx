
import * as React from "react";
import { cn } from "@/lib/utils";

// Focus ring component that adds consistent, accessible focus styles
export interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FocusRing = React.forwardRef<HTMLDivElement, FocusRingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background rounded-md focus-within:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FocusRing.displayName = "FocusRing";

// Visually hidden content for screen readers
export const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
      style={{ clip: "rect(0 0 0 0)" }}
      {...props}
    />
  );
});
VisuallyHidden.displayName = "VisuallyHidden";

// Skip navigation link for keyboard users
export const SkipLink = ({ targetId }: { targetId: string }) => {
  return (
    <a
      href={`#${targetId}`}
      className="fixed top-0 left-0 p-2 bg-background text-foreground z-50 opacity-0 focus:opacity-100 -translate-y-full focus:translate-y-0 transition duration-200"
    >
      Skip to main content
    </a>
  );
};

// Accessible announcer for screen readers
export const Announcer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "sr-only",
        className
      )}
      {...props}
    />
  );
});
Announcer.displayName = "Announcer";

// Accessible tooltip component
export interface AccessibleTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content: string;
  children: React.ReactNode;
}

export const AccessibleTooltip = ({
  content,
  children,
  className,
  ...props
}: AccessibleTooltipProps) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const id = React.useId();
  
  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      {...props}
    >
      <div aria-describedby={id}>
        {children}
      </div>
      {showTooltip && (
        <div
          id={id}
          role="tooltip"
          className="absolute z-50 px-2 py-1 text-xs text-center text-tooltip-foreground bg-tooltip rounded-md shadow-md bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2"
        >
          {content}
          <div className="absolute w-2 h-2 bg-tooltip transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};
