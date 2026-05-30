"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CarnetVehicleDashboard } from "@/lib/db/diagauto";

type UseCarnetDashboardOptions = {
  vehicleId?: string;
  /** Initial dashboards from SSR — avoids a loading flash. */
  initial?: CarnetVehicleDashboard[];
  /** Poll interval in milliseconds. Default 10s. */
  intervalMs?: number;
  /** Disable polling when false. Useful for previews. */
  enabled?: boolean;
};

type State = {
  dashboards: CarnetVehicleDashboard[];
  lastSyncedAt: Date | null;
  isFetching: boolean;
  error: string | null;
};

/**
 * Subscribes the carnet UI to a recurring fetch of /api/carnet/dashboard.
 *
 * Behaviour:
 *  - Calls once on mount, then every `intervalMs` (default 10 000).
 *  - Pauses on document hidden and resumes on visibilitychange.
 *  - Cancels stale fetches via AbortController to avoid out-of-order state.
 *  - Exposes a manual `refresh()` that the UI can call after an action.
 */
export function useCarnetDashboard({
  vehicleId,
  initial,
  intervalMs = 10_000,
  enabled = true,
}: UseCarnetDashboardOptions = {}) {
  const [state, setState] = useState<State>(() => ({
    dashboards: initial ?? [],
    lastSyncedAt: initial && initial.length > 0 ? new Date() : null,
    isFetching: false,
    error: null,
  }));

  const abortRef = useRef<AbortController | null>(null);

  const fetchOnce = useCallback(async () => {
    if (!enabled) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, isFetching: true, error: null }));

    try {
      const url = vehicleId
        ? `/api/carnet/dashboard?vehicleId=${encodeURIComponent(vehicleId)}`
        : "/api/carnet/dashboard";
      const response = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const body = (await response.json()) as { dashboards: CarnetVehicleDashboard[] };
      setState({
        dashboards: body.dashboards ?? [],
        lastSyncedAt: new Date(),
        isFetching: false,
        error: null,
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      setState((prev) => ({
        ...prev,
        isFetching: false,
        error: error instanceof Error ? error.message : "fetch failed",
      }));
    }
  }, [vehicleId, enabled]);

  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setInterval> | null = null;
    let active = true;

    const start = () => {
      if (timer) return;
      fetchOnce();
      timer = setInterval(() => {
        if (!document.hidden && active) fetchOnce();
      }, intervalMs);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    start();

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else if (active) {
        fetchOnce();
        start();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      stop();
      abortRef.current?.abort();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchOnce, intervalMs, enabled]);

  return {
    ...state,
    refresh: fetchOnce,
  };
}
