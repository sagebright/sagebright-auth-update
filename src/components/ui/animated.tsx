
import React from "react";
import { cn } from "@/lib/utils";

type AnimatedProps = {
  children: React.ReactNode;
  animation?: 
    | "fade-in" 
    | "scale-in" 
    | "slide-up" 
    | "slide-down" 
    | "slide-in-right" 
    | "slide-in-left" 
    | "enter" 
    | "none";
  delay?: "0" | "100" | "200" | "300" | "500" | "700" | "1000";
  duration?: "fast" | "normal" | "slow";
  className?: string;
};

export const Animated: React.FC<AnimatedProps> = ({
  children,
  animation = "fade-in",
  delay = "0",
  duration = "normal",
  className,
}) => {
  // Skip animation if "none" is specified
  if (animation === "none") {
    return <div className={className}>{children}</div>;
  }

  // Map duration names to CSS classes
  const durationClass = {
    fast: "duration-200",
    normal: "duration-300",
    slow: "duration-500",
  }[duration];

  // Map delay values to CSS classes
  const delayClass = delay === "0" ? "" : `delay-${delay}`;

  return (
    <div
      className={cn(
        `animate-${animation}`,
        delayClass,
        durationClass,
        className
      )}
    >
      {children}
    </div>
  );
};

type AnimatedListProps = {
  children: React.ReactNode[];
  animation?: "fade-in" | "scale-in" | "slide-up" | "none";
  staggerDelay?: number; // Delay between each item in ms
  initialDelay?: number; // Initial delay before first animation in ms
  className?: string;
  itemClassName?: string;
};

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  animation = "fade-in",
  staggerDelay = 100,
  initialDelay = 0,
  className,
  itemClassName,
}) => {
  // Skip animation if "none" is specified
  if (animation === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        // Calculate delay based on item index
        const delay = initialDelay + index * staggerDelay;
        
        return (
          <div
            className={cn(
              `animate-${animation}`,
              itemClassName
            )}
            style={{ animationDelay: `${delay}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

type HoverAnimationProps = {
  children: React.ReactNode;
  effect?: "scale" | "brightness" | "scale-brightness" | "none";
  scale?: "103" | "105" | "110";
  brightness?: "105" | "110" | "125";
  className?: string;
};

export const HoverAnimation: React.FC<HoverAnimationProps> = ({
  children,
  effect = "scale-brightness",
  scale = "103",
  brightness = "105",
  className,
}) => {
  // Skip animation if "none" is specified
  if (effect === "none") {
    return <div className={className}>{children}</div>;
  }

  // Build class based on effect
  const hoverClass = {
    "scale": `hover:scale-${scale} transition-transform duration-300`,
    "brightness": `hover:brightness-${brightness} transition-all duration-300`,
    "scale-brightness": `hover:scale-${scale} hover:brightness-${brightness} transition-all duration-300`,
  }[effect];

  return <div className={cn(hoverClass, className)}>{children}</div>;
};
