# PrintFlow AI — PWA Móvil del Instalador

## Qué es

PWA móvil para los instaladores de Imprenta Escalante. Permite escanear QR de notas de remisión y validar que el saldo esté liquidado antes de confirmar la entrega física.

## Stack

- React 18 + Vite 5 + TypeScript strict
- Tailwind CSS v4 (grises via tokens.css)
- React Router v6
- Zustand (estado global)
- vite-plugin-pwa (manifest, sin SW de caché en Fase 1)
- Vitest + Testing Library

## Fase actual

**Fase 1 — Maquetado UI/UX sin color, sin backend.** Todo via mocks.

## Reglas duras (no negociables)

1. **Candado de entrega**: El botón "Confirmar entrega física" NO se renderiza si `evaluateDeliveryGuard` no devuelve `ALLOW`. No se oculta, no se deshabilita — no se instancia.
2. **Dinero como string**: `Money = string` (ej: `"0.00"`). Nunca `number`. La app no calcula saldo.
3. **Confidencialidad**: "Mi Ruta" no muestra dinero. `RouteItemDTO` no tiene campos de dinero.
4. **Sin color**: Solo grises via `tokens.css`. Prohibido hex literal en componentes.
5. **Sin backend**: Cero `fetch`, cero Supabase. Todo via `PrintflowGateway` con mocks.
6. **Sin cámara real**: Viewport placeholder tramado en Fase 1.
7. **Sesión 12h**: No renovable. Modal bloqueante al expirar.
8. **data-testid**: En cada control interactivo.
9. **Commits en español**. PR con Isaías como revisor.

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run test     # pruebas (3 negativas del candado)
npm run preview  # preview del build
```

## Estructura

```
src/
├── components/ui/        # Button, Input, Spinner, PlaceholderBox, StatusBadge
├── components/layout/    # AppShell, BottomNav, ConnectionIndicator
├── components/feedback/  # ErrorBoundary, OfflineBanner, UpdateToast, SessionExpiredModal
├── features/auth/        # LoginScreen
├── features/scanner/     # ScannerScreen
├── features/delivery/    # DeliveryResultScreen, BlockedDeliveryPanel, ClearancePanel, deliveryGuard.ts
├── features/route/       # MyRouteScreen
├── data/                 # contracts.ts, gateway.ts, mocks/
├── store/                # session.ts (Zustand)
└── styles/               # tokens.css, global.css
```

## Documentación

- Spec: `specs/001-installer-pwa-mvp/spec.md`
- Plan: `specs/001-installer-pwa-mvp/plan.md`
- Tasks: `specs/001-installer-pwa-mvp/tasks.md`
- Constitution: `.specify/memory/constitution.md`
