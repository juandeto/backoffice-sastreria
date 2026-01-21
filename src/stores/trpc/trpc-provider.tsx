"use client";

import { TRPCReactProvider } from "@/app/api/trpc/react";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
}