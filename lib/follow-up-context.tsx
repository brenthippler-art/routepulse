"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { FollowUp } from "./follow-ups";

type FollowUpMap = Record<string, FollowUp[]>;

interface FollowUpContextValue {
  followUps: FollowUpMap;
  addFollowUp: (exceptionId: string, followUp: FollowUp) => void;
}

const FollowUpContext = createContext<FollowUpContextValue | null>(null);

export function FollowUpProvider({ children }: { children: ReactNode }) {
  const [followUps, setFollowUps] = useState<FollowUpMap>({});

  const addFollowUp = useCallback((exceptionId: string, followUp: FollowUp) => {
    setFollowUps((prev) => ({
      ...prev,
      [exceptionId]: [...(prev[exceptionId] ?? []), followUp],
    }));
  }, []);

  const value = useMemo(() => ({ followUps, addFollowUp }), [followUps, addFollowUp]);

  return <FollowUpContext value={value}>{children}</FollowUpContext>;
}

export function useFollowUps(): FollowUpContextValue {
  const context = useContext(FollowUpContext);
  if (!context) {
    throw new Error("useFollowUps must be used inside a FollowUpProvider");
  }
  return context;
}