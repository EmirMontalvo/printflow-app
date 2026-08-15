// PrintFlow AI — mockGateway.ts
// Implementación mock de PrintflowGateway con latencia simulada.
// Constitution Principle V: sin fetch, sin Supabase.

import type {
  SessionDTO,
  ScanOutcome,
  ConfirmDeliveryResult,
  RouteItemDTO,
} from "../contracts";
import type { PrintflowGateway } from "../gateway";
import { FIXTURES, MOCK_CREDENTIALS, MOCK_ROUTE_ITEMS, createMockSession } from "./fixtures";

/** Latencia simulada: 500-800ms (clarificación Q2) */
function mockDelay(): Promise<void> {
  const ms = Math.random() * 300 + 500;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockGateway implements PrintflowGateway {
  private isOnline: boolean = true;

  /** Permite al store controlar el estado de conexión del mock */
  setOnline(online: boolean): void {
    this.isOnline = online;
  }

  async signIn(email: string, password: string): Promise<SessionDTO> {
    await mockDelay();
    if (!this.isOnline) {
      throw new Error("NETWORK_ERROR");
    }
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      return createMockSession();
    }
    throw new Error("Credenciales inválidas");
  }

  async scanOrder(payload: string): Promise<ScanOutcome> {
    await mockDelay();
    if (!this.isOnline) {
      return { kind: "NETWORK_ERROR" };
    }
    // F7-QR-DESCONOCIDO o cualquier payload no reconocido
    if (payload === "F7-QR-DESCONOCIDO") {
      return { kind: "NOT_FOUND" };
    }
    const order = FIXTURES[payload];
    if (order) {
      return { kind: "FOUND", order };
    }
    // Payload inválido
    return { kind: "INVALID_PAYLOAD" };
  }

  async confirmDelivery(orderToken: string): Promise<ConfirmDeliveryResult> {
    await mockDelay();
    if (!this.isOnline) {
      throw new Error("NETWORK_ERROR");
    }
    // Mock: siempre exitoso
    return { ok: true, deliveredAt: new Date().toISOString() };
  }

  async getMyRoute(filter: "today" | "upcoming"): Promise<RouteItemDTO[]> {
    await mockDelay();
    if (!this.isOnline) {
      throw new Error("NETWORK_ERROR");
    }
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 86400000);

    if (filter === "today") {
      // Hoy + vencidos
      return MOCK_ROUTE_ITEMS.filter((item) => {
        if (!item.promisedDate) return false;
        const date = new Date(item.promisedDate);
        return date < endOfToday;
      }).sort((a, b) => {
        const da = a.promisedDate ? new Date(a.promisedDate).getTime() : Infinity;
        const db = b.promisedDate ? new Date(b.promisedDate).getTime() : Infinity;
        return da - db;
      });
    }
    // Próximas (mañana en adelante)
    return MOCK_ROUTE_ITEMS.filter((item) => {
      if (!item.promisedDate) return false;
      const date = new Date(item.promisedDate);
      return date >= endOfToday;
    }).sort((a, b) => {
      const da = a.promisedDate ? new Date(a.promisedDate).getTime() : Infinity;
      const db = b.promisedDate ? new Date(b.promisedDate).getTime() : Infinity;
      return da - db;
    });
  }
}

/** Instancia singleton del gateway mock */
export const gateway: PrintflowGateway = new MockGateway();
