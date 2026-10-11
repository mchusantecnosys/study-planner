# StudyPlanner — Guía de Arquitectura y Agentes (AGENTS.md)

Este documento define la arquitectura, convenciones y reglas de ingeniería para **StudyPlanner**, la plataforma de gestión académica y calendario de tareas y exámenes.

---

## 1. Principios de Dominio y Gotchas Críticos

### 1.1 Manejo Estricto de Fechas (`dueDate` / `due_date`)
- **Formato:** Fechas puras en formato ISO `"YYYY-MM-DD"` (sin tiempo ni zona horaria).
- **Prohibido:** `new Date("YYYY-MM-DD")` directo en el cliente (genera desfase de 1 día en husos horarios como UTC-5 / América).
- **Módulo Único:** Toda manipulación, cálculo o renderizado de fechas debe ejecutarse exclusivamente a través de `src/app/lib/dates.ts`.
- **Backend:** Validación de formato `"YYYY-MM-DD"`.

### 1.2 Tipos de Tarea (`TaskType`)
- Únicamente dos tipos estrictos:
  - `'assignment'`: Deber / Trabajo práctico / Tarea académica.
  - `'exam'`: Examen / Evaluación parcial o final.
- **Diferenciación Visual:**
  - `assignment`: Tono índigo / azul pizarra, icono de libro o apunte.
  - `exam`: Tono ámbar / carmesí de alerta, icono de examen / evaluación.

### 1.3 Comportamiento en Calendario
- Tareas completadas: **no se borran** del calendario. Se visualizan atenuadas (`opacity-60`) y con texto tachado (`line-through`).
- Sin desbordes: Al ser eventos de día completo, no se define fecha de finalización excluyente que pueda saltar al día siguiente.

---

## 2. Convenciones de Código
- **Idioma del Código:** Nombres de variables, clases, interfaces, métodos y rutas en **inglés**.
- **Interfaz de Usuario:** Textos, etiquetas, modales y mensajes en **español**.
- **Tipado:** TypeScript en modo `strict` al 100%. Sin uso de `any` ni `@ts-ignore`.
- **Estilos:** Tailwind CSS con estética cuidada (cero pills genéricas para metadatos, tipografía limpia, accesibilidad WCAG AA).
