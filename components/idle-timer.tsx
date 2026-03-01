"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const IDLE_TIMEOUT_MS = 5.5 * 60 * 1000; // 5.5 minutes

export function IdleTimer() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    // Events to track user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity >= IDLE_TIMEOUT_MS) {
        console.log("User idle for 5.5 minutes. Logging out...");
        signOut(() => router.push("/login"));
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      clearInterval(intervalId);
    };
  }, [lastActivity, signOut, router]);

  return null; // This component doesn't render anything
}
