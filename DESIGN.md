---
name: StudyPlanner
description: Planificador académico en papel cálido y tinta, con un único color de señal para lo que vence.
colors:
  paper: "#f6f1e7"
  surface: "#fffdf8"
  ink: "#1c1a17"
  ink-muted: "#5b564c"
  line: "#ddd5c4"
  signal: "#b9321a"
  signal-wash: "#f7e1da"
  success: "#2f6b4a"
  course-blue: "#2d5fa8"
  course-ochre-rust: "#b4561b"
  course-violet: "#6a3fa0"
  course-teal: "#1f7a6d"
  course-gold: "#8a6a00"
  paper-dark: "#17150f"
  surface-dark: "#201d15"
  ink-dark: "#f1ebdd"
  ink-muted-dark: "#b4ad9c"
  line-dark: "#38341f"
  signal-dark: "#ff7a5c"
  signal-wash-dark: "#3a1f18"
  success-dark: "#6fcf9a"
typography:
  display:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2rem, 4.5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
  numeral:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "4rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: "'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.06em"
  meta:
    fontFamily: "'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  badge:
    fontFamily: "'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.04em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  gutter: "20px"
  lg: "32px"
  xl: "40px"
  xxl: "56px"
  row-min: "56px"
  tap-min: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    height: "44px"
    padding: "0 18px"
  quick-add:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "11px 14px"
  view-toggle:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 18px"
  view-toggle-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  task-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    height: "56px"
    padding: "10px 0"
  task-row-done:
    textColor: "{colors.ink-muted}"
  checkbox:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    size: "20px"
  checkbox-checked:
    backgroundColor: "{colors.success}"
    textColor: "{colors.paper}"
  badge-exam:
    backgroundColor: "{colors.signal-wash}"
    textColor: "{colors.signal}"
    typography: "{typography.badge}"
    rounded: "{rounded.xs}"
    padding: "2px 7px"
  chip-course:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "6px 14px"
  chip-course-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  month-cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "52px"
  month-cell-selected:
    backgroundColor: "{colors.surface}"
---

## Overview

**Creative North Star: "El cuaderno de la tarde."**

Un cuaderno de papel cálido y tinta oscura para estudiar con calma: sin gamificación, sin urgencia ficticia. La interfaz responde a una sola pregunta, "¿qué hago ahora?", así que la jornada de hoy lidera y el calendario apoya. Es un producto de modo *Operate*: la legibilidad, la consistencia y la rapidez de captura pesan más que la expresión.

**Key Characteristics:**

- Tono calmado y enfocado. Nada celebra, nada parpadea.
- Filas con separadores finos en lugar de tarjetas. No existen tarjetas anidadas.
- Un único color de señal (arcilla bermellón) reservado a lo atrasado, los exámenes y el día actual.
- Serif editorial para títulos y cifras; sans humanista para la interfaz.
- Modo claro y oscuro con los mismos roles; el tema sigue `prefers-color-scheme`.
- Movimiento mínimo: aparición breve de filas y cambios de estado de 200 ms.

**The One Signal Rule.** `signal` significa "requiere atención". Nunca se usa como acento decorativo, en enlaces genéricos ni en botones primarios.

**The Meaning-Beyond-Color Rule.** Ningún estado depende solo del color: cada punto de materia lleva su nombre al lado, los exámenes llevan la etiqueta "Examen" y lo atrasado dice "Venció ayer".

## Colors

Estrategia: neutros cálidos de baja saturación + un solo acento funcional + cinco tonos de materia que solo aparecen como puntos de 8px.

### Primary

- **Tinta (`ink` #1c1a17):** títulos, texto principal, botón primario, estado activo de los controles. Es el único "énfasis" fuerte del sistema.

### Tertiary

- **Señal (`signal` #b9321a):** "arcilla bermellón". Tareas atrasadas, etiqueta de examen, subrayado de días con examen, el día de hoy en la vista de mes, y la cifra de la semana actual en el gráfico de carga.
- **Lavado de señal (`signal-wash` #f7e1da):** fondo de la etiqueta de examen. Solo junto a `signal`.

### Neutral

- **Papel (`paper` #f6f1e7):** fondo de página.
- **Superficie (`surface` #fffdf8):** campo de captura rápida y celda de día seleccionada.
- **Tinta tenue (`ink-muted` #5b564c):** texto secundario, fechas, metadatos, borde del checkbox vacío.
- **Línea (`line` #ddd5c4):** separadores de fila y bordes de controles. Es decorativa, nunca la única pista de un límite interactivo.
- **Éxito (`success` #2f6b4a):** únicamente el checkbox completado.

### Course dots (no textuales)

`course-blue` #2d5fa8 · `course-ochre-rust` #b4561b · `course-violet` #6a3fa0 · `course-teal` #1f7a6d · `course-gold` #8a6a00. Se dibujan como círculo de 8px junto al nombre de la materia. **Nunca como color de texto ni de fondo.**

### Dark theme

Los mismos roles con sufijo `-dark`. Papel `#17150f`, tinta `#f1ebdd`, señal `#ff7a5c`. Los tonos de materia se aclaran (`#7fb0f2`, `#f0955a`, `#b995ea`, `#5cd0bf`, `#e0bf4a`; definidos en CSS como `--c1`…`--c5`).

### Contraste verificado (WCAG 2.1, calculado)

| Par | Ratio | Uso | Umbral |
|---|---|---|---|
| ink / paper | 15.42 | texto principal | 4.5 ✔ |
| ink-muted / paper | 6.48 | fechas, metadatos | 4.5 ✔ |
| ink-muted / surface | 7.17 | placeholder del campo | 4.5 ✔ |
| signal / paper | 5.28 | atrasado, "hoy" | 4.5 ✔ |
| signal / signal-wash | 4.74 | etiqueta de examen | 4.5 ✔ |
| success / paper | 5.61 | checkbox completado | 3 ✔ |
| paper / ink | 15.42 | texto del botón y control activo | 4.5 ✔ |
| course-ochre-rust / paper | 4.35 | punto de materia (no texto) | 3 ✔ |
| ink-dark / paper-dark | 15.36 | texto principal oscuro | 4.5 ✔ |
| ink-muted-dark / paper-dark | 8.17 | secundario oscuro | 4.5 ✔ |
| signal-dark / paper-dark | 7.12 | señal oscura | 4.5 ✔ |
| signal-dark / signal-wash-dark | 5.90 | etiqueta de examen oscura | 4.5 ✔ |

**The Gray-Never Rule.** El texto secundario es siempre `ink-muted` (cálido), nunca un gris neutro.

**The Dot-Only Rule.** Los cinco tonos de materia son de relleno de punto. Si un tono de materia aparece como texto, el sistema está roto.

## Typography

**Display y títulos: Fraunces** (serif con eje óptico). **Interfaz y cuerpo: Hanken Grotesk.** Ambas se cargan desde Google Fonts con pila de respaldo definida; todos los números usan `font-variant-numeric: tabular-nums`.

### Hierarchy

| Rol | Fuente | Tamaño | Peso | Notas |
|---|---|---|---|---|
| display | Fraunces | clamp(2rem, 4.5vw, 3.25rem) | 700 | fecha del día; `text-wrap: balance`; tracking −0.025em |
| headline | Fraunces | 1.25rem | 700 | logotipo y encabezado del mes (capitalizado) |
| title | Fraunces | 1.125rem | 700 | solo el título de un examen |
| numeral | Fraunces | 4rem | 700 | cuenta regresiva del examen |
| body | Hanken Grotesk | 1rem | 400 | lead y texto general; interlineado 1.5 |
| body-strong | Hanken Grotesk | 1rem | 500 | títulos de tarea, controles |
| label | Hanken Grotesk | 0.8125rem | 600 | encabezado de grupo; mayúsculas; tracking 0.06em |
| meta | Hanken Grotesk | 0.8125rem | 400 | materia y fecha |
| badge | Hanken Grotesk | 0.6875rem | 600 | solo la etiqueta "Examen" |

**The Serif-For-Time Rule.** El serif se reserva a lo temporal y de jerarquía: la fecha, el mes y la cuenta regresiva. Los títulos de tarea ordinarios van en sans.

**The Measure Rule.** El texto de lectura (`.lede`) no pasa de 46ch. El tracking nunca baja de −0.04em y el display nunca supera 6rem.

## Layout

Modo Operate: densidad media, la columna de trabajo domina.

- **Contenedor:** máximo 68rem (1088px), centrado, relleno lateral de 20px.
- **Escritorio (>860px):** rejilla de dos columnas, `minmax(0,1fr)` + 19rem, separación de 56px. La columna lateral es *sticky* a 24px del borde superior e incluye carga semanal, cuenta regresiva y lista de materias.
- **Móvil (≤860px):** una columna. La lista de materias pasa a chips con desplazamiento horizontal sobre el contenido; el gráfico semanal y la cuenta regresiva se ocultan, porque la vista Semana cubre esa necesidad.
- **Barra de captura móvil:** fija abajo (`bottom: 16px` + `safe-area-inset-bottom`), a 16px de cada lado, para alcance con el pulgar. El contenido reserva 6.5rem inferiores.
- **Ritmo vertical:** más espacio sobre un encabezado de grupo (40px) que bajo él (8px); filas de 56px mínimo.
- **Vistas:** Lista (atrasadas → hoy → esta semana → más adelante), Semana (lunes a domingo, siete bloques apilados), Mes (rejilla de 7 columnas con la lista del día elegido debajo). El control de vista tiene exactamente tres opciones.
- **Seguridad de pantalla:** `viewport-fit=cover` y relleno con `env(safe-area-inset-*)` en `:root`.

**The Thumb-Zone Rule.** En móvil, la acción principal (añadir tarea) vive en la mitad inferior de la pantalla.

**The Four-Choices Rule.** Ningún punto de decisión muestra más de cuatro opciones simultáneas sin agrupar; las cinco materias se resuelven como chips de un solo eje.

## Elevation & Depth

Sistema **plano y tonal**: la profundidad se expresa con papel contra superficie y con líneas finas de 1px, no con sombras.

- Única sombra del sistema, para la barra de captura flotante en móvil: `0 8px 24px rgba(28,26,23,0.18), 0 1px 3px rgba(28,26,23,0.12)`.
- Sin halos de color, sin desenfoque de fondo, sin sombras de desplazamiento duro.

**The Flat-By-Default Rule.** Una sombra solo existe si el elemento flota sobre el contenido que se desplaza.

## Shapes

Esquinas suaves y discretas, nada de cápsulas salvo en chips.

- **4px (`xs`):** etiqueta de examen, barras del gráfico semanal.
- **6px (`sm`):** checkbox.
- **8px (`md`):** botón, celdas del mes, opciones del control de vista.
- **10px (`lg`):** campo de captura, contenedor del control de vista.
- **999px (`pill`):** solo los chips de materia en móvil.
- **Bordes:** 1px `line`; el checkbox usa 1.5px `ink-muted`. Sin `border-left` de color mayor a 1px en filas ni avisos.

## Components

### Captura rápida (`quick-add`)

Campo `surface` con borde 1px `line` y botón "Añadir" integrado a la derecha. Placeholder en `ink-muted`; el caret usa `signal`. Un solo campo: la tarea se crea para hoy.

### Botón primario (`button-primary`)

Fondo `ink`, texto `paper`, 44px de alto. Hover: opacidad 0.85 en 200 ms. Es el único botón relleno de la interfaz.

### Control de vista (`view-toggle`)

Grupo de tres botones (Lista, Semana, Mes) con `aria-pressed`. Activo: fondo `ink`, texto `paper`. En móvil ocupa todo el ancho y cada opción se expande por igual.

### Fila de tarea (`task-row`)

Rejilla `2.75rem | 1fr | auto` con separadores de 1px `line` arriba y abajo del grupo. Contiene checkbox (zona táctil 44×44px), título en `body-strong`, línea de metadatos (punto + materia) y fecha a la derecha. Completada: título tachado en `ink-muted`, checkbox en `success` con marca en `paper`. Atrasada: fecha en `signal`, peso 600.

### Examen (`badge-exam`)

Fila con título en `title` (Fraunces 1.125rem) y etiqueta "Examen" en mayúsculas sobre `signal-wash`. Es la única fila con tratamiento tipográfico distinto.

### Chip de materia (`chip-course`)

Punto de 8px + nombre. Activo: relleno `ink`, texto `paper`; en escritorio muestra el texto "Filtrando" a la derecha en lugar de un color. Se activa y desactiva con el mismo clic.

### Celda de mes (`month-cell`)

Número del día y hasta tres puntos de materia. Hoy: número en `signal`, peso 700. Día con examen: subrayado interno de 2px `signal`. Seleccionada: fondo `surface` y borde 1px `ink`. Etiqueta accesible: "9 de octubre, 2 pendientes".

### Movimiento

- Entrada de filas: 500 ms, `cubic-bezier(.16,1,.3,1)`, desplazamiento de 6px y opacidad, con escalonado de 40ms por fila.
- Estados (hover, marca, color): 200 ms.
- Barras del gráfico semanal: altura en 600 ms con la misma curva.
- Con `prefers-reduced-motion: reduce`, todas las animaciones y transiciones se desactivan.

### Superficies del navegador

`::selection` en `signal` sobre `paper`; `caret-color: signal`; anillo de foco `:focus-visible` de 2px `signal` con desplazamiento de 3px; cifras tabulares en fechas y contadores.

## Do's and Don'ts

### Do

- Haz que "hoy" sea lo primero que ve el estudiante; el calendario es apoyo.
- Usa `signal` solo para lo atrasado, los exámenes y el día actual.
- Acompaña todo color con texto: nombre de materia, etiqueta "Examen", "Venció ayer".
- Mantén las zonas táctiles de al menos 44×44px y los controles activos con `aria-pressed`.
- Separa con líneas de 1px y espacio; deja que una sola columna de filas lleve la jerarquía.
- Redacta con el lenguaje del estudiante ("Hoy", "Mañana", "Venció ayer"), con el control nombrando su acción.
- Comprueba cada par de texto/fondo con WCAG AA (4.5:1 para texto, 3:1 para elementos gráficos).

### Don't

- No uses tarjetas dentro de tarjetas ni rejillas de tarjetas idénticas con icono, título y texto.
- No uses los tonos de materia como color de texto, ni `signal` como acento decorativo.
- No añadas rachas, insignias, confeti ni microcopy motivacional: rompen el tono calmado.
- No uses emoji ni glifos Unicode como iconos; si se añaden iconos, que sean de una sola familia de trazo (Lucide).
- No uses texto con degradado, desenfoque decorativo ni sombras de desplazamiento duro.
- No pongas un modal para añadir, editar o filtrar una tarea; todo ocurre en línea.
- No superes los cuatro elementos de un mismo nivel de decisión sin agrupar.
- No reemplaces Fraunces o Hanken Grotesk por una fuente del sistema como voz de display.

### Pruebas de auditoría

1. **Test de ojos entornados:** con la página borrosa, lo único de color intenso debe ser `signal`, y solo en elementos que exigen atención.
2. **Test de grises:** en escala de grises, el estado de cada tarea (atrasada, examen, completada) sigue distinguiéndose por texto o forma.
3. **Test de teclado:** crear, completar, filtrar y cambiar de vista se hacen sin ratón, con un foco siempre visible.
4. **Test del pulgar:** a 390px de ancho, añadir una tarea no requiere alcanzar el tercio superior de la pantalla.
5. **Test de borde:** con 0 tareas y con 100, la pantalla sigue mostrando un estado útil (nunca un "No hay resultados" vacío sin guía).
