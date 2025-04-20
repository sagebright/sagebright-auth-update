
import React, { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { toast } from "@/hooks/use-toast";
import { signOut } from "@/contexts/auth/authActions";

// Session timeout duration in milliseconds (e.g., 20 min)
const SESSION_TIMEOUT_MS = 20 * 60 * 1000;
// Show warning 2 minutes before timeout
const WARNING_BEFORE_MS = 2 * 60 * 1000;

export const SessionTimeoutDetector: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const timeoutRef = useRef<number | null>(null);
  const warningRef = useRef<number | null>(null);

  // Reset timers on user activity
  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (warningRef.current) window.clearTimeout(warningRef.current);

    if (!isAuthenticated) return;

    // Set warning before actual timeout
    warningRef.current = window.setTimeout(() => {
      toast({
        variant: "warning",
        title: "Session expiring soon",
        description: "You will be logged out in 2 minutes due to inactivity.",
      });
    }, SESSION_TIMEOUT_MS - WARNING_BEFORE_MS);

    // Set actual logout
    timeoutRef.current = window.setTimeout(async () => {
      toast({
        variant: "destructive",
        title: "Session expired",
        description: "You have been logged out due to inactivity.",
      });
      await signOut(() => {});
    }, SESSION_TIMEOUT_MS);
  }, [isAuthenticated]);

  // Activity events to listen on
  useEffect(() => {
    if (!isAuthenticated) return;
    resetTimeout();
    const activityEvents = [
      "mousemove", "keydown", "mousedown",
      "touchstart", "scroll", "focus"
    ];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimeout)
    );
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (warningRef.current) window.clearTimeout(warningRef.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimeout)
      );
    };
  }, [isAuthenticated, resetTimeout]);

  return null;
};

export default SessionTimeoutDetector;
