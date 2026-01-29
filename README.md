# PetClan - Libreta Sanitaria Digital 🐾

![PetClan Banner](https://placehold.co/1200x400/0ea5e9/ffffff?text=PetClan+Digital+Health+Record&font=montserrat)

> **PetClan** es una aplicación moderna y segura diseñada para simplificar la gestión de la salud de tus mascotas. Lleva un registro detallado de vacunas, peso, eventos médicos y más, todo en una interfaz fluida y amigable.

## ✨ Características Principales

- 🔐 **Autenticación Robusta**: Inicio de sesión seguro con Google (NextAuth.js).
- 🐶 **Gestión de Mascotas**: Perfiles detallados con avatares generados automáticamente según el nombre.
- 💉 **Línea de Tiempo de Salud**: Visualización cronológica de vacunas, desparasitaciones y consultas.
- ⚖️ **Control de Peso**: Gráficos interactivos para monitorear la evolución del peso de tu mascota.
- 🎨 **UI/UX Premium**:
  - **Diseño Mobile-First** adaptable a cualquier dispositivo.
  - **Modo Oscuro/Claro** totalmente integrado.
  - **Micro-interacciones Mágicas** (Framer Motion) para una experiencia táctil y fluida.
  - **Hero Selection**: Transiciones dramáticas al seleccionar mascotas.
- 🌐 **Internacionalización**: Soporte multi-idioma (i18n ready).
- 🤝 **Comunidad y Soporte**: Modal de colaboración integrado y páginas legales (Términos y Condiciones).

## 🚀 Tecnologías (Tech Stack)

Este proyecto está construido sobre un stack moderno y eficiente:

### Core
- **[Next.js 16](https://nextjs.org/)** (App Router) - Framework React de última generación.
- **[React 19](https://react.dev/)** - Biblioteca para interfaces de usuario.
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para código robusto.

### UI & Animación
- **[Mantine v8](https://mantine.dev/)** - Sistema de diseño y componentes accesibles.
- **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca de animación potente para React.
- **[Tabler Icons](https://tabler-icons.io/)** - Iconografía consistente y limpia.

### Datos & Estado
- **[MongoDB](https://www.mongodb.com/)** + **[Mongoose v9](https://mongoosejs.com/)** - Base de datos NoSQL y modelado de objetos.
- **[TanStack Query v5](https://tanstack.com/query/latest)** - Gestión de estado asíncrono y cacheo.
- **[Zod](https://zod.dev/)** - Validación de esquemas y tipos.

### Auth & Extras
- **[NextAuth.js](https://next-auth.js.org/)** - Sistema de autenticación flexible.
- **[Next-Intl](https://next-intl-docs.vercel.app/)** - Rutas y traducciones internacionalizadas.

## 🛠️ Instalación y Configuración

Sigue estos pasos para correr el proyecto localmente:

### 1. Prerrequisitos
- Node.js 18+ (Recomendado LTS)
- NPM o Yarn
- Una base de datos MongoDB (Local o Atlas)

### 2. Clonar el Repositorio
```bash
git clone <tu-repositorio-url>
cd PetClan
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto y completa las siguientes variables:

```env
# Base de Datos
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/petclan

# Autenticación (Google OAuth)
GOOGLE_CLIENT_ID=tuc-client-id-google
GOOGLE_CLIENT_SECRET=tu-client-secret-google

# Configuración NextAuth
NEXTAUTH_SECRET=genera-un-string-seguro-aqui
NEXTAUTH_URL=http://localhost:3000

# App Config (SEO & Canonical)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Enlaces de Soporte y Donaciones
NEXT_PUBLIC_CAFECITO_USER="tu-usuario-cafecito"
NEXT_PUBLIC_PAYPAL_URL="https://paypal.me/tuuser"
NEXT_PUBLIC_PORTFOLIO_URL="https://tuportfolio.com"
NEXT_PUBLIC_GITHUB_REPO_URL="https://github.com/tu-repo"

# Configuración de Correo (Maileroo)
MAILEROO_API_KEY=your_maileroo_api_key
MAILEROO_FROM_EMAIL=no-reply@libretasanitaria.app
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```txt
src/
├── app/                  # App Router
│   ├── [locale]/         # Rutas internacionalizadas
│   │   ├── (auth)/       # Rutas de login/registro
│   │   └── dashboard/    # Área privada (Mascotas, Perfil)
│   ├── api/              # API Routes (Backend)
│   ├── robots.ts         # Configuración SEO
│   └── sitemap.ts        # Mapa del sitio
├── components/
│   ├── layout/           # Shell, Navbar, Headers
│   ├── pets/             # Tarjetas, Formularios, Listas de Mascotas
│   ├── ui/               # Componentes base y MotionWrappers
│   └── providers/        # Contextos globales (Auth, Query, Mantine)
├── hooks/                # Custom Hooks (Lógica de negocio reutilizable)
├── lib/                  # Utilidades (DB connection, Auth options)
├── models/               # Schemas de base de datos (Mongoose)
└── styles/               # Tokens de diseño y fuentes
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue para discutir cambios mayores o envía un Pull Request directo para correcciones menores.

## 📄 Licencia

Este proyecto está bajo la Licencia [ISC](LICENSE).
