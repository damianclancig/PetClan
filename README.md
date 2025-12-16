# PetClan - Libreta Sanitaria Digital 🐾

Aplicación web para gestionar el historial sanitario de mascotas, permitiendo a los dueños registrar vacunas, desparasitaciones y consultas.

![PetClan Dashboard](https://placehold.co/1200x600/cyan/white?text=PetClan+Dashboard)

## 🚀 Tecnologías

### Frontend
- **Next.js 14+ (App Router)**
- **React 18**
- **Mantine UI v7** (Componentes y Theming)
- **Framer Motion** (Animaciones)
- **TanStack Query** (Gestión de estado asíncrono)
- **React Hook Form + Zod** (Formularios validados)

### Backend & Datos
- **Next.js API Routes**
- **MongoDB** con **Mongoose**
- **NextAuth.js** (Autenticación con Google)
- **TypeScript**

## 🛠️ Instalación Local

1.  **Clonar el repositorio:**
    ```bash
    git clone <repo_url>
    cd PetClan
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # Si falla por binarios faltantes:
    npm rebuild
    ```

3.  **Configurar entorno:**
    Crea un archivo `.env.local` basado en `.env.example`:
    ```env
    MONGODB_URI=mongodb+srv://...
    GOOGLE_CLIENT_ID=...
    GOOGLE_CLIENT_SECRET=...
    NEXTAUTH_SECRET=...
    NEXTAUTH_URL=http://localhost:3000
    ```

4.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Visita `http://localhost:3000`.

## 📁 Estructura del Proyecto

```txt
src/
├── app/                  # App Router (Páginas y API)
│   ├── (auth)/           # Rutas públicas de auth
│   ├── dashboard/        # Área privada protegida
│   │   ├── pets/         # CRUD Mascotas
│   │   └── page.tsx      # Dashboard Home
│   ├── api/              # Endpoints Backend
│   └── layout.tsx        # Root Layout con Providers
├── components/
│   ├── layout/           # Componentes estructurales (Shell)
│   ├── health/           # Componentes específicos (Timeline)
│   └── providers/        # Context Providers (Query, Auth, UI)
├── hooks/                # Custom Hooks (usePets, useHealthRecords)
├── lib/                  # Utilidades (dbConnect, authOptions)
├── models/               # Schemas Mongoose (User, Pet, HealthRecord)
└── styles/               # Configuración global de estilos
```

## ✨ Funcionalidades (MVP)

- [x] **Autenticación:** Login seguro con Google.
- [x] **Gestión de Mascotas:** Registrar nuevas mascotas con fotos (avatar generado) y datos básicos.
- [x] **Historia Clínica:** Timeline visual de vacunas, consultas y desparasitaciones.
- [x] **Responsive:** Diseño optimizado para móviles con Mantine UI.

## 🔮 Roadmap Futuro

- [ ] Rol Veterinario (Validación de firmas).
- [ ] Recordatorios por Email (Maileroo).
- [ ] Compartir Perfil (QR Público).
- [ ] Soporte Multi-idioma.

---
Desarrollado con ❤️ para las mascotas.
