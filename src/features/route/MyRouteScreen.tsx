// MyRouteScreen — FR-004: sin dinero. Constitution Principle III.
// Semáforo estructural sin color.

import { useState, useEffect } from "react";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { gateway } from "../../data/mocks/mockGateway";
import { useSessionStore } from "../../store/session";
import type { RouteItemDTO } from "../../data/contracts";

type RouteState = "loading" | "success" | "empty" | "offline" | "error";

function getRouteStatus(promisedDate: string | null): "overdue" | "due-today" | "due-tomorrow" | "on-time" | "error" {
  if (!promisedDate) return "error";
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
  const startOfDayAfter = new Date(startOfTomorrow.getTime() + 86400000);
  const date = new Date(promisedDate);

  if (date < startOfToday) return "overdue";
  if (date >= startOfToday && date < startOfTomorrow) return "due-today";
  if (date >= startOfTomorrow && date < startOfDayAfter) return "due-tomorrow";
  return "on-time";
}

function getRouteLabel(status: ReturnType<typeof getRouteStatus>): string {
  switch (status) {
    case "overdue": return "VENCIDO";
    case "due-today": return "VENCE HOY";
    case "due-tomorrow": return "VENCE MAÑANA";
    case "on-time": return "EN TIEMPO";
    case "error": return "DATOS INCOMPLETOS";
  }
}

export function MyRouteScreen() {
  const isOnline = useSessionStore((s) => s.isOnline);
  const [filter, setFilter] = useState<"today" | "upcoming">("today");
  const [state, setState] = useState<RouteState>("loading");
  const [items, setItems] = useState<RouteItemDTO[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isOnline) {
        setState("offline");
        return;
      }
      setState("loading");
      try {
        const result = await gateway.getMyRoute(filter);
        if (cancelled) return;
        setItems(result);
        setState(result.length === 0 ? "empty" : "success");
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => { cancelled = true; };
  }, [filter, isOnline]);

  return (
    <div data-testid="route-screen" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1 style={{ fontSize: "18px", fontWeight: 700 }}>Mi Ruta</h1>
      <div data-testid="route-filters" style={{ display: "flex", gap: "8px" }}>
        {(["today", "upcoming"] as const).map((f) => (
          <button
            key={f}
            data-testid={`filter-${f}`}
            onClick={() => setFilter(f)}
            style={{
              flex: 1,
              height: "48px",
              minHeight: "var(--hitbox-min)",
              border: filter === f ? "2px solid var(--border-strong)" : "1px solid var(--border-hairline)",
              backgroundColor: filter === f ? "var(--surface-1)" : "var(--surface-0)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--ink-strong)",
            }}
          >
            {f === "today" ? "Hoy" : "Próximas"}
          </button>
        ))}
      </div>
      {state === "loading" && (
        <div data-testid="route-loading" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton-pulse"
              style={{ height: "80px", backgroundColor: "var(--surface-2)", border: "1px solid var(--border-hairline)" }}
            />
          ))}
        </div>
      )}
      {state === "empty" && (
        <div data-testid="route-empty" style={{ padding: "32px 16px", textAlign: "center" }}>
          <p style={{ marginBottom: "16px" }}>[EMPTY] No hay instalaciones listas para entrega</p>
          <Button variant="secondary" onClick={() => setState("loading")} data-testid="button-refresh">
            Actualizar
          </Button>
        </div>
      )}
      {state === "offline" && (
        <div data-testid="route-offline" style={{ padding: "32px 16px", textAlign: "center" }}>
          <p>Sin conexión. La ruta no puede actualizarse</p>
        </div>
      )}
      {state === "error" && (
        <div data-testid="route-error" style={{ padding: "32px 16px", textAlign: "center" }}>
          <p style={{ marginBottom: "16px" }}>[!] No pudimos cargar Mi Ruta</p>
          <Button variant="secondary" onClick={() => setState("loading")} data-testid="button-retry">
            Reintentar
          </Button>
        </div>
      )}
      {state === "success" && (
        <div data-testid="route-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {items.map((item) => {
            const status = getRouteStatus(item.promisedDate);
            const label = getRouteLabel(status);
            return (
              <div
                key={item.routeItemToken}
                data-testid="route-card"
                style={{
                  padding: "16px",
                  backgroundColor: "var(--surface-0)",
                  border: status === "overdue" || status === "due-today"
                    ? "4px solid var(--border-strong)"
                    : status === "due-tomorrow"
                    ? "2px dashed var(--border-strong)"
                    : "1px solid var(--border-hairline)",
                }}
              >
                <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                  {item.productLabel}
                </p>
                <p style={{ fontSize: "14px", color: "var(--ink-muted)", marginBottom: "8px" }}>
                  {item.promisedDate ? new Date(item.promisedDate).toLocaleDateString("es-MX") : "—"}
                </p>
                <StatusBadge variant={status === "error" ? "error" : status} label={label} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
