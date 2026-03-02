"use client";

import { IdleTimer } from "@/components/idle-timer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <IdleTimer />
      {children}
    </>
  );
}
