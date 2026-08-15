// AppShell — header 56px + content + bottom nav 64px.
// FR-020: header persistente que nunca muestra cliente ni saldo.
// FR-026: SessionExpiredModal integrado.

import { type ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ConnectionIndicator } from "./ConnectionIndicator";
import { BottomNav } from "./BottomNav";
import { OfflineBanner } from "../feedback/OfflineBanner";
import { SessionExpiredModal } from "../feedback/SessionExpiredModal";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const [tick, setTick] = useState(0);

  // Verificar expiración de sesión cada segundo (research.md R7)
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!isLogin && <OfflineBanner />}
      <header
        data-testid="app-header"
        style={{
          height: "var(--header-height)",
          minHeight: "var(--header-height)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          backgroundColor: "var(--surface-0)",
          borderBottom: "1px solid var(--border-hairline)",
          flexShrink: 0,
        }}
      >
        <div
          data-testid="logo-placeholder"
          style={{
            width: "32px",
            height: "32px",
            maxWidth: "40px",
            maxHeight: "40px",
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--border-hairline)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            color: "var(--ink-muted)",
          }}
        >
          [LOGO]
        </div>
        <ConnectionIndicator />
      </header>
      <main
        style={{
          flex: 1,
          padding: "16px",
          paddingBottom: isLogin ? "16px" : "calc(var(--bottom-nav-height) + var(--safe-area-bottom) + 16px)",
        }}
      >
        {children}
      </main>
      {!isLogin && <BottomNav />}
      <SessionExpiredModal key={tick} />
    </div>
  );
}
