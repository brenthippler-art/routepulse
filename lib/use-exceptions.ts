"use client";

import { useCallback, useEffect, useState } from "react";
import type { DeliveryException } from "./types";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: DeliveryException[] };

export function useExceptions() {
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const simulate = new URLSearchParams(window.location.search).get("simulate");
        const url = simulate
          ? `/api/exceptions?simulate=${encodeURIComponent(simulate)}`
          : "/api/exceptions";

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

        const data: DeliveryException[] = await res.json();
        setState({ status: "success", data });
      } catch (err) {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    load();
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return { state, retry };
}