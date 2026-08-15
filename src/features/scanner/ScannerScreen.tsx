// ScannerScreen — FR-016, FR-017, FR-012.
// Constitution Principle V: sin cámara real, viewport placeholder.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlaceholderBox } from "../../components/ui/PlaceholderBox";
import { Button } from "../../components/ui/Button";
import { gateway } from "../../data/mocks/mockGateway";
import { FIXTURE_LIST } from "../../data/mocks/fixtures";
import { useSessionStore } from "../../store/session";

const SUPPORTS_TORCH = false;

export function ScannerScreen() {
  const navigate = useNavigate();
  const isOnline = useSessionStore((s) => s.isOnline);
  const [error, setError] = useState(false);

  const handleFixture = (fixtureId: string) => {
    if (fixtureId === "F7-QR-DESCONOCIDO") {
      setError(true);
      return;
    }
    setError(false);
    navigate(`/resultado/${fixtureId}`);
  };

  return (
    <div data-testid="scanner-screen" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "18px", fontWeight: 700 }}>Escanear entrega</h1>
      </div>
      <div style={{ position: "relative" }}>
        <PlaceholderBox
          label="CAMERA FEED — NO IMAGE REAL"
          aspectRatio="4/3"
          minHeight="288px"
          trama
          data-testid="camera-viewport"
        />
        {/* Retícula 224x224 con 4 esquinas en L */}
        <div
          data-testid="reticule"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "224px",
            height: "224px",
            pointerEvents: "none",
          }}
        >
          {[
            { top: 0, left: 0, borderTop: "4px solid var(--border-strong)", borderLeft: "4px solid var(--border-strong)" },
            { top: 0, right: 0, borderTop: "4px solid var(--border-strong)", borderRight: "4px solid var(--border-strong)" },
            { bottom: 0, left: 0, borderBottom: "4px solid var(--border-strong)", borderLeft: "4px solid var(--border-strong)" },
            { bottom: 0, right: 0, borderBottom: "4px solid var(--border-strong)", borderRight: "4px solid var(--border-strong)" },
          ].map((style, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "24px",
                height: "24px",
                ...style,
              }}
            />
          ))}
        </div>
        {!isOnline && (
          <div
            data-testid="scanner-offline-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "var(--surface-3)",
              opacity: 0.9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              textAlign: "center",
              fontSize: "14px",
              color: "var(--ink-strong)",
            }}
          >
            Sin conexión. Muévase a un área con cobertura para validar la entrega
          </div>
        )}
      </div>
      <p style={{ fontSize: "14px", color: "var(--ink-muted)", textAlign: "center" }}>
        Escanee el código de la remisión
      </p>
      {error && (
        <div
          data-testid="qr-not-recognized"
          style={{
            padding: "16px",
            border: "2px solid var(--border-strong)",
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: "8px" }}>Código QR no reconocido</p>
          <Button variant="secondary" onClick={() => setError(false)} data-testid="button-scan-again">
            Escanear de nuevo
          </Button>
        </div>
      )}
      {import.meta.env.DEV && (
        <div
          data-testid="dev-panel"
          style={{
            padding: "16px",
            border: "1px dashed var(--border-hairline)",
          }}
        >
          <p style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px", color: "var(--ink-muted)" }}>
            [PANEL DE DESARROLLO — 7 FIXTURES]
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {FIXTURE_LIST.map((fixture) => (
              <button
                key={fixture.id}
                data-testid={`dev-fixture-${fixture.id}`}
                onClick={() => handleFixture(fixture.id)}
                style={{
                  height: "48px",
                  padding: "0 16px",
                  backgroundColor: "var(--surface-1)",
                  border: "1px solid var(--border-hairline)",
                  fontSize: "14px",
                  cursor: "pointer",
                  color: "var(--ink-strong)",
                  textAlign: "left",
                }}
              >
                {fixture.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
