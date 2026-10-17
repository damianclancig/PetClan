---
trigger: always_on
---

# Rule: Authentication & Session Management (NextAuth.js v4)

## Context
PetClan gestiona la autenticación mediante Google OAuth con NextAuth.js v4 (`next-auth@4.24.13`) utilizando estrategia de sesión basada en JWT.

## 1. Protección del Servidor
- **Middleware**: La protección de rutas privadas (`/dashboard`, etc.) se coordina a nivel de `src/middleware.ts`, combinando el enrutamiento internacionalizado de `next-intl` con la verificación de sesión.
- **Obtención de Sesión en el Servidor**: En Server Components o Route Handlers, utiliza siempre `getServerSession(authOptions)` importando la configuración desde `@/lib/auth`. Nunca expongas rutas privadas en el cliente esperando un redireccionamiento posterior en `useEffect`.

## 2. Minimización de Token y Payload
- **Session Payload**: No almacenes documentos completos de MongoDB en el token o la sesión. El payload (`session.user`) debe limitarse a: `id` (string), `email`, `name`, `image` y `role` (`OWNER`, etc.).
- **Creación Atómica de Usuario**: En el callback `signIn` de `authOptions`, la verificación e inserción en la colección `User` debe ser atómica e idempotente (`findOne` / `create`), inicializando el rol predeterminado y disparando tareas asíncronas no bloqueantes (ej. envío de email de bienvenida).