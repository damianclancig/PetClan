---
trigger: always_on
---

# Rule: Software Architecture & Clean Code (SOLID/DRY/KISS)

## Role & Context
Estándares de arquitectura escalable y código limpio para PetClan (Next.js 16, React 19, TypeScript, Mantine 8 y MongoDB/Mongoose 9). Prioridad absoluta en simplicidad, mantenibilidad y ausencia de sobre-ingeniería.

## 1. Principios de Diseño: KISS vs DRY
- **Regla de Tres para DRY**: No abstraigas prematuramente. Aplica la regla: "La primera vez se escribe, la segunda se duplica (KISS), la tercera se refactoriza y se abstrae (DRY)".
- **Evita la Abstracción Compleja**: Es preferible la duplicación temporal antes que una abstracción incorrecta o acoplada. Si una función o componente requiere más de 3 props o parámetros para cubrir casos de borde, la abstracción falló; divídela en piezas simples.
- **Legibilidad sobre Concisión**: El código debe leerse como prosa clara. Evita one-liners crípticos.
- **Estandarización de Fechas**: Mantine 8 depende internamente de `dayjs`. Prioriza `dayjs` sobre `date-fns` en nuevos desarrollos para evitar duplicidad de bundles en el cliente.

## 2. Componentes y Separación Server/Client
- **Single Responsibility Principle (SRP)**:
  - Los componentes de React se encargan únicamente de la presentación y la orquestación mínima.
  - Extrae lógica compleja de mutaciones, estado o cálculo a custom hooks (`src/hooks/`) o servicios en el servidor.
- **Separación Server/Client**:
  - Los componentes de React deben ser Server Components por defecto.
  - Usa `'use client'` únicamente cuando exista interactividad (hooks, listeners de eventos o estado local).
  - En vistas con Mantine, sitúa `'use client'` en los límites hoja interactivos o en contenedores de layout dedicados (`PageContainer`, `DashboardShell`).

## 3. Capa de Acceso a Datos y Persistencia
- **Aislamiento de Modelos**: Queda prohibido instanciar o consultar modelos de Mongoose directamente dentro de componentes de presentación. Toda consulta o mutación debe residir en `src/services/` o en Server Actions dedicadas.
- **Manejo de Conexiones Serverless**: Cualquier interacción con MongoDB debe reutilizar la conexión singleton cacheada importada desde `src/lib/mongodb.ts` para no saturar el pool de conexiones.
- **Tipado y Serialización de IDs**: Al transferir datos desde Server Components o servicios a Client Components, serializa siempre los `ObjectId` de MongoDB a `string` (`_id.toString()`) para evitar errores de hidratación y serialización de Next.js.