"use client"
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient =  new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});

interface ReactQueryProviderProps {
  children: ReactNode,
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}