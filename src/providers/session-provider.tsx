"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { User } from '@/types';

type SessionProviderProps = {
  children: React.ReactNode;
  user: User | null;
}

export function SessionProvider({ user, children }: SessionProviderProps) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    setUser(user as User);
  }, [user, setUser]);

  return <>{children}</>;;
}