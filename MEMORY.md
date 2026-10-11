# StudyPlanner — Registro de Memoria y Estado (MEMORY.md)

## Estado Actual
- **Fase:** Hito 3 Completado — Persistencia en la nube, respaldo automático y autenticación con Firebase (Cloud Firestore & Auth).
- **Entorno:** Angular 21 (Zoneless, Signals) + Tailwind CSS + Fraunces & Hanken Grotesk + Firebase Cloud Firestore + Express SSR.
- **Verificación:** `set_up_firebase` aprovisionado, `firestore.rules` desplegadas (`deploy_firebase`), `compile_applet` exitoso, `lint_applet` sin errores ni advertencias (100% de cumplimiento).
- **Última Actualización:** 2026-10-09

---

## Componentes y Módulos Desplegados
- `firebase-applet-config.json` y `firebase-blueprint.json`: Configuración y esquema intermedio del modelo de datos de Firestore.
- `firestore.rules`: Reglas de seguridad ABAC desplegadas para la colección `/tasks/{taskId}` con validación estricta de esquema y aislamiento por `userId`.
- `src/app/core/services/firebase.service.ts`:
  - Autenticación anónima automática al arrancar para sesión inmediata sin fricción.
  - Soporte de vinculación con Google (`signInWithPopup`) para sincronización entre múltiples dispositivos.
  - Sincronización en tiempo real (`onSnapshot`) y escrituras atómicas en lote (`writeBatch`) para respaldos completos.
  - Verificación de conectividad activa (`getDocFromServer`).
- `src/app/core/services/task.service.ts`: Persistencia tripartita integrada (Reactividad local en Signals + Respaldo en `localStorage` + Persistencia en Firebase Cloud Firestore + API Express).
- Interfaz de Usuario:
  - Indicador discreto en cabecera del estado de sincronización (*Nube activa* / *Sincronizando* / *Local*).
  - Botón "Respaldar" en la cabecera para sincronización inmediata de todas las tareas a la nube.
  - Selector de vinculación con cuenta de Google en pie de página para sincronización permanente.
- `DESIGN.md`: Implementación completa de la guía de diseño editorial ("El cuaderno de la tarde").
- Tipografía y Tokens (`src/index.html`, `src/styles.css`): Fraunces (serif para títulos, temporalidad y cifras) y Hanken Grotesk (sans humanista para interfaz); tokens de color cálidos de papel y tinta (`paper`, `surface`, `ink`, `ink-muted`, `line`), acento único funcional (`signal`, `signal-wash`, `success`) y modo oscuro nativo con `prefers-color-scheme`.
- Regla *The One Signal Rule*: El color `signal` se reserva exclusivamente para tareas atrasadas, exámenes, el día actual y alertas reales; nunca como acento decorativo.
- Regla *The Dot-Only Rule*: Tonos de materia aplicados estrictamente como puntos coloreados de 8px acompañados del nombre legible.
- Captura Rápida (`src/app/features/tasks/quick-add.ts`): Componente inline en superficie `surface` con borde `line` y botón en `ink`/`paper` para crear tareas inmediatamente para hoy; barra flotante inferior en móviles para alcance del pulgar.
- Fila Editorial (`src/app/features/tasks/task-row.ts`): Rejilla de `2.75rem | 1fr | auto`, checkbox cuadrado con zona táctil mínima de 44×44px, etiqueta sobria de examen `badge-exam`, separación por líneas finas de 1px (sin tarjetas anidadas).
- Agrupación en Lista (`src/app/features/tasks/task-list.ts`): Organización natural en Atrasadas → Hoy → Esta Semana → Más Adelante → Completadas con encabezados tipográficos limpios.
- Vistas de Calendario (`src/app/features/calendar/calendar-view.ts`):
  - Vista Mes: Celdas de 52px con puntos de materia, subrayado interno en `signal` para exámenes, día actual destacado y lista detallada del día seleccionado directamente debajo.
  - Vista Semana: Siete bloques apilados (lunes a domingo) con separadores finos.
- Barra Lateral Editorial (`src/app/features/sidebar/editorial-sidebar.ts`):
  - Cuenta regresiva prominente con cifra Fraunces (4rem) para el examen más cercano.
  - Gráfico de barras de carga semanal animado con día de hoy en `signal`.
  - Filtro por materias con conteo y estado "Filtrando".

---

## Decisiones Técnicas Registradas
1. **Módulo de Fechas Centralizado (`src/app/lib/dates.ts`):**
   - Implementado para descomponer strings `"YYYY-MM-DD"` en año, mes y día de forma numérica estricta para evitar desfases UTC provocados por el constructor nativo de `Date`.
2. **Modelo de Tareas:**
   - Tipos restringidos a `assignment` (Deberes) y `exam` (Exámenes).
   - Atributos: `id`, `title`, `course`, `type`, `dueDate` (YYYY-MM-DD), `time` (opcional HH:mm), `completed`, `completedAt`, `priority` (`low`, `medium`, `high`), `notes`, `estimatedHours`.
3. **Persistencia Híbrida:**
   - API REST en `src/server.ts` bajo `/api/tasks` con soporte para listado, creación (201), actualización y eliminación (204).
   - Sincronización transparente con almacenamiento local (`localStorage`) en el frontend para resiliencia offline y carga instantánea.
4. **Experiencia de Usuario (UI):**
   - Idioma de interfaz 100% en español.
   - Calendario mensual y semanal integrado, lista filtrable, estadísticas rápidas de entrega y modal reactivo para creación/edición.
