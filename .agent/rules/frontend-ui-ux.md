---
trigger: always_on
---

# Rule: Frontend UI/UX, Responsive Design & Theming (Mantine 8)

## Role & Context
Estándares de interfaz, responsividad, accesibilidad y rendimiento visual para PetClan. El stack base es Next.js 16 (App Router), React 19 y Mantine Core 8.3 (`@mantine/core`). No se utiliza Tailwind CSS.

## 1. Diseño Responsivo & Mobile-First
- **Filosofía Mobile-First**: Define primero los valores para pantallas pequeñas (`base`) y escala hacia arriba (`sm`, `md`, `lg`, `xl`).
- **Props Responsivas de Mantine**: Emplea la sintaxis de objetos de Mantine en lugar de utilidades externas:
  - Espaciado y dimensiones: `py={{ base: 'sm', sm: 'lg' }}`, `w={{ base: '100%', sm: 'auto' }}`.
  - Grillas y layouts: `<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">` o `<Grid>`.
  - Contenedores: `<Container size="xl" px={{ base: 'xs', sm: 'md' }}>`.
- **Touch Targets**: En dispositivos móviles, los elementos interactivos (botones, `ActionIcon`) deben tener un área táctil mínima de 44x44px (`size="lg"` o `minHeight: 44`).
- **Adaptación de Datos**: Las tablas y vistas complejas deben transformarse automáticamente en formato de tarjetas (`Card` apiladas) en pantallas móviles.
- **Media Queries en JS**: Si se requiere renderizado condicional por viewport, usa el hook `useMediaQuery` de `@mantine/hooks` con breakpoints estándar de Mantine (`em(768)`).

## 2. Sistema de Temas (Dual Theme: Light & Dark)
- **Tokens Semánticos**:
  - Utiliza las variables CSS definidas en `src/styles/globals.css` (`var(--bg-background)`, `var(--bg-surface)`, `var(--text-primary)`, `var(--color-primary)`).
  - En componentes de Mantine, apóyate en el tema (`primaryColor: 'teal'`), colores semánticos (`c="dimmed"`, `bg="var(--bg-surface)"`) o CSS Modules.
  - Queda estrictamente prohibido hardcodear colores hexadecimales estáticos directamente en estilos inline sin soporte para dark mode.
- **Esquema de Color en CSS**:
  - El modo oscuro se gestiona mediante el selector `[data-mantine-color-scheme="dark"]` configurado en `globals.css` y `MantineProvider`.
  - Emplea las clases utilitarias de Mantine `mantine-visible-from`, `mantine-hidden-from`, o los mixins de PostCSS `light` y `dark` cuando uses CSS Modules.
- **Contraste y Ergonomía**:
  - En Light Mode: texto oscuro sobre fondos claros limpios con ratio accesible.
  - En Dark Mode: fondos oscuros profundos (`#0B1220` / `#111827`), texto claro (`#E5E7EB`) y bordes tenues en lugar de sombras densas.

## 3. Manejo y Optimización de Imágenes
- **Componentes Autorizados**:
  - Usa `<Image>` de `@mantine/core` para componentes visuales de UI y avatares con radios controlados (`radius="md"`).
  - Usa `<Image>` de `next/image` cuando se requiera prioridad de carga (`priority`), prevención de CLS con `fill` o dimensiones fijas `width`/`height`.
  - Queda prohibido el uso de la etiqueta HTML `<img>` nativa sin optimización.
- **Integración con Cloudinary**:
  - Las cargas se gestionan exclusivamente mediante las utilidades en `src/utils/cloudinary.ts` (con compresión en cliente vía `browser-image-compression`).
  - Al solicitar URLs de Cloudinary, aplica transformaciones (`q_auto,f_auto` o dimensiones acotadas) para evitar descarga de resoluciones innecesarias.
