<div align="center">
  <img src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1770054971/PetClan/Logo_PetClan_h9vtjo.png" alt="PetClan Logo" width="400" />
  
  # PetClan - Libreta Sanitaria Digital 🐾
  
  **El cuidado que tu mascota merece, todo en un solo lugar**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Mantine](https://img.shields.io/badge/Mantine-8.3-339AF0?style=flat-square)](https://mantine.dev/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-9.0-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](LICENSE)

  [🚀 Ver Aplicación](https://petclan.clancig.com.ar) • [📖 Documentación](#-sobre-el-proyecto) • [🐛 Reportar Bug](https://github.com/damianclancig/PetClan/issues) • [💡 Solicitar Feature](https://github.com/damianclancig/PetClan/issues)
</div>

---

## 📖 Sobre el Proyecto

**PetClan** es una aplicación web moderna y completa diseñada para simplificar la gestión integral de la salud de tus mascotas. Con una interfaz intuitiva y elegante, permite llevar un registro detallado de vacunas, control de peso, desparasitaciones, consultas veterinarias y mucho más.

### 🎯 Características Destacadas

#### 📋 Gestión de Salud Completa
- **💉 Calendario de Vacunas**: Control exhaustivo de vacunas aplicadas con alertas automáticas de próximos vencimientos y estados (al día, próximo a vencer, vencido)
- **🐛 Desparasitaciones**: Registro y programación de desparasitaciones internas y externas con recordatorios inteligentes
- **⚖️ Control de Peso**: Gráficos interactivos (Recharts) para visualizar la evolución histórica del peso de tu mascota
- **🏥 Historia Clínica Digital**: Almacenamiento completo de consultas, diagnósticos, tratamientos y observaciones veterinarias
- **📊 Dashboard Inteligente**: Vista consolidada con análisis automático de salud, alertas activas y acciones rápidas

#### 🐾 Gestión de Mascotas
- **👤 Perfiles Detallados**: Información completa de cada mascota (nombre, especie, raza, fecha de nacimiento, sexo, status)
- **🎨 Avatares Dinámicos**: Generación automática de avatares únicos y responsivos basados en la mascota.
- **🆔 Código QR**: Generación de códigos QR de emergencia para rápida identificación y acceso al perfil público.
- **👥 Co-tutores**: Sistema de invitaciones y tokens para compartir la gestión de la libreta sanitaria entre familiares.
- **📸 Línea de Tiempo Visual**: Galería cronológica integrada con Cloudinary para inmortalizar el crecimiento de la mascota.
- **🕊️ Modo "In Memoriam"**: Un diseño conmemorativo y respetuoso para mascotas fallecidas, adaptando la UI para preservar su legado como un hermoso tributo.
- **⚡ Carga Rápida (Smart Entry)**: Modales inteligentes y pre-completados que interpretan la intención del usuario desde el dashboard, reduciendo clics al añadir peso o vacunas.

#### 📱 Progressive Web App (PWA)
- **⚡ Instalable**: Soporte completo para PWA con `manifest.json` y carga optimizada.
- **🚀 Acceso Rápido**: Capacidad de agregar a la pantalla de inicio en Android y iOS para una experiencia de app nativa.
- **🎨 Branding Consistente**: Splash screens y temas configurados para una integración fluida con el sistema operativo.

#### 🔔 Sistema de Notificaciones
- **⏰ Recordatorios Inteligentes**: Alertas automáticas para vacunas, desparasitaciones y eventos importantes
- **📱 Notificaciones en Tiempo Real**: Sistema de notificaciones in-app con indicadores visuales
- **📧 Email Notifications**: Integración con Maileroo para envío de recordatorios por correo electrónico
- **🎯 Alertas Contextuales**: Análisis automático del estado de salud con alertas categorizadas por prioridad

#### 🎨 Experiencia de Usuario Premium
- **📱 Mobile-First**: Diseño responsive adaptable a cualquier dispositivo (móvil, tablet, desktop)
- **🌓 Modo Oscuro/Claro**: Soporte completo de temas con transición suave
- **✨ Animaciones Fluidas**: Micro-interacciones y transiciones con Framer Motion para una experiencia táctil
- **🦸 Hero Selection**: Transiciones dramáticas al seleccionar y gestionar mascotas
- **♿ Accesibilidad**: Componentes accesibles con soporte de teclado y lectores de pantalla (Mantine)

#### 🌍 Internacionalización
- **🗣️ Multi-idioma**: Soporte completo para Español, Inglés y Portugués
- **🌐 Rutas Localizadas**: Sistema de routing internacionalizado con next-intl
- **📅 Formatos Locales**: Fechas y números formateados según el idioma del usuario

#### 🔐 Seguridad y Privacidad
- **🔒 Autenticación Segura**: Sistema de autenticación robusto con NextAuth.js (Google OAuth) completamente configurado para producción.
- **🛡️ Protección de Datos**: Control de acceso basado en roles y relaciones (owner, co-owner).
- **🔑 Tokens Seguros**: Sistema de invitaciones y compartición con tokens encriptados.
- **📜 Páginas Legales**: Implementación completa de **Términos y Condiciones** y **Política de Privacidad** (requerimiento de Google OAuth) con navegación inteligente.
- **📈 Monitoreo y Logging Unificado**: Sistema robusto de observabilidad en servidor con Pino para trazabilidad de errores sin exponer datos sensibles.

---

---

## 🚀 Stack Tecnológico

PetClan está construido sobre un stack moderno, escalable y eficiente que garantiza rendimiento y una excelente experiencia de desarrollo:

### 🎯 Core Framework
- **[Next.js 16.0.10](https://nextjs.org/)** - Framework React con App Router, Server Components, y optimizaciones automáticas
- **[React 19.2.3](https://react.dev/)** - Biblioteca UI de última generación con Concurrent Features
- **[TypeScript 5.9.3](https://www.typescriptlang.org/)** - Tipado estático fuerte para código robusto y seguro

### 🎨 UI/UX & Design System
- **[Mantine 8.3.10](https://mantine.dev/)** - Sistema de diseño completo con 100+ componentes accesibles
  - `@mantine/core` - Componentes base
  - `@mantine/hooks` - Hooks utilitarios
  - `@mantine/form` - Gestión de formularios
  - `@mantine/dates` - Selectores de fecha
  - `@mantine/modals` - Sistema de modales
  - `@mantine/notifications` - Sistema de notificaciones
- **[Framer Motion 12.23.26](https://www.framer.com/motion/)** - Animaciones y transiciones fluidas
- **[Tabler Icons React 3.36](https://tabler-icons.io/)** - Biblioteca de iconos consistente (+4,000 iconos)
- **PostCSS** con Mantine Preset - Procesamiento y optimización de CSS

### 💾 Base de Datos & Estado
- **[MongoDB](https://www.mongodb.com/)** (Atlas) - Base de datos NoSQL escalable en la nube
- **[Mongoose 9.0.1](https://mongoosejs.com/)** - ODM con esquemas tipados y validaciones
- **[TanStack Query 5.90.12](https://tanstack.com/query/latest)** (React Query) - Gestión de estado del servidor, caché inteligente y sincronización
- **[Zod 4.2.1](https://zod.dev/)** - Validación de esquemas runtime con inferencia de tipos

### 🔐 Autenticación & Seguridad
- **[NextAuth.js 4.24.13](https://next-auth.js.org/)** - Sistema de autenticación robusto
  - Proveedores OAuth (Google)
  - JWT Sessions
  - Callbacks personalizados
  - Protección de rutas

### 🌍 Internacionalización
- **[Next-Intl 4.6.1](https://next-intl-docs.vercel.app/)** - Internacionalización completa
  - Routing localizado
  - Traducciones tipadas
  - Formateo de fechas y números
- **[date-fns 4.1.0](https://date-fns.org/)** & **[Day.js 1.11.19](https://day.js.org/)** - Manipulación de fechas

### 📊 Visualización de Datos
- **[Recharts 3.6.0](https://recharts.org/)** - Gráficos interactivos para control de peso y estadísticas

### 📝 Formularios & Validación
- **[React Hook Form 7.68.0](https://react-hook-form.com/)** - Formularios performantes con validación
- **[@hookform/resolvers 5.2.2](https://github.com/react-hook-form/resolvers)** - Integración con Zod

### 🔧 Herramientas de Desarrollo
- **[ESLint](https://eslint.org/)** con configuración Next.js - Linting y estándares de código
- **PostCSS** - Transformación de CSS
- **TypeScript Compiler** - Verificación de tipos estricta

### 📱 Extras & Utilidades
- **[Pino 10.3.1](https://getpino.io/)** - Sistema unificado de logging estructurado de alto rendimiento para monitoreo y depuración de servidor
- **[react-qr-code 2.0.18](https://github.com/rosskhanas/react-qr-code)** - Generación de códigos QR
- **Cloudinary** - Almacenamiento y optimización de imágenes
- **Maileroo** - Servicio de emails transaccionales

---

## 🏗️ Arquitectura del Proyecto

PetClan sigue una arquitectura moderna basada en Next.js App Router con separación clara de responsabilidades:

### 📂 Estructura de Directorios

```txt
PetClan/
├── 📁 src/
│   ├── 📁 app/                           # Next.js App Router
│   │   ├── 📁 [locale]/                  # Rutas internacionalizadas (es, en, pt)
│   │   │   ├── 📁 (auth)/                # Grupo de rutas de autenticación
│   │   │   │   └── login/                # Página de inicio de sesión
│   │   │   ├── 📁 dashboard/             # Panel principal (protegido)
│   │   │   │   ├── page.tsx              # Vista principal del dashboard
│   │   │   │   ├── pets/                 # Gestión de mascotas
│   │   │   │   │   ├── [id]/             # Detalle y edición de mascota
│   │   │   │   │   │   ├── health/       # Registros de salud
│   │   │   │   │   │   └── profile/      # Perfil de mascota
│   │   │   │   │   └── new/              # Crear nueva mascota
│   │   │   │   └── settings/             # Configuración de usuario
│   │   │   ├── 📁 invitations/           # Sistema de invitaciones
│   │   │   ├── 📁 requests/              # Solicitudes de co-tutoría
│   │   │   ├── 📁 public/                # Perfiles públicos de mascotas
│   │   │   ├── 📁 terms/                 # Términos y condiciones
│   │   │   └── 📁 privacy-policy/        # Política de privacidad
│   │   ├── 📁 api/                       # API Routes (Backend)
│   │   │   ├── auth/                     # NextAuth endpoints
│   │   │   ├── pets/                     # CRUD de mascotas
│   │   │   ├── records/                  # Registros de salud
│   │   │   ├── invitations/              # Sistema de invitaciones
│   │   │   ├── requests/                 # Solicitudes de compartir
│   │   │   ├── notifications/            # Notificaciones de usuario
│   │   │   ├── user/                     # Preferencias de usuario
│   │   │   ├── cron/                     # Jobs programados (reminders)
│   │   │   └── debug/                    # Herramientas de debugging
│   │   ├── layout.tsx                    # Layout raíz
│   │   ├── error.tsx                     # Página de error global
│   │   ├── not-found.tsx                 # Página 404
│   │   ├── robots.ts                     # Configuración SEO robots
│   │   └── sitemap.ts                    # Sitemap dinámico
│   ├── 📁 components/                    # Componentes React
│   │   ├── dashboard/                    # Componentes del dashboard
│   │   │   ├── DashboardView.tsx         # Vista principal
│   │   │   ├── DashboardHeader.tsx       # Header del dashboard
│   │   │   ├── ActiveAlertsWidget.tsx    # Widget de alertas
│   │   │   ├── PetSnapshotGrid.tsx       # Grid de mascotas
│   │   │   └── QuickActionsGrid.tsx      # Acciones rápidas
│   │   ├── pets/                         # Componentes de mascotas
│   │   │   ├── PetCard.tsx               # Tarjeta de mascota
│   │   │   ├── PetForm.tsx               # Formulario de mascota
│   │   │   ├── PetQRCode.tsx             # Generador QR
│   │   │   ├── SharePetModal.tsx         # Modal para compartir
│   │   │   ├── EmptyPetsState.tsx        # Estado vacío
│   │   │   ├── profile/                  # Perfil detallado
│   │   │   └── wizard/                   # Wizard de creación
│   │   ├── health/                       # Componentes de salud
│   │   │   ├── HealthTimeline.tsx        # Línea de tiempo
│   │   │   ├── HealthRecordForm.tsx      # Formulario de registros
│   │   │   ├── SmartHealthRecordModal.tsx # Modal inteligente
│   │   │   ├── DewormingCard.tsx         # Tarjeta de desparasitación
│   │   │   ├── VaccinationCalendar.tsx   # Calendario de vacunas
│   │   │   ├── WeightControl.tsx         # Control de peso
│   │   │   └── WeightEntryModal.tsx      # Modal de peso
│   │   ├── notifications/                # Sistema de notificaciones
│   │   │   ├── NotificationBell.tsx      # Campana de notificaciones
│   │   │   └── NotificationItem.tsx      # Item de notificación
│   │   ├── landing/                      # Componentes del landing
│   │   │   ├── LandingPage.tsx           # Página principal
│   │   │   ├── HeroSection.tsx           # Sección hero
│   │   │   ├── FeaturesSection.tsx       # Características
│   │   │   ├── BenefitsSection.tsx       # Beneficios
│   │   │   └── CallToAction.tsx          # CTA
│   │   ├── layout/                       # Componentes de layout
│   │   │   ├── DashboardShell.tsx        # Shell del dashboard
│   │   │   ├── Footer.tsx                # Footer global
│   │   │   └── SupportProjectModal.tsx   # Modal de apoyo
│   │   ├── legal/                        # Componentes legales
│   │   │   ├── TermsOfService.tsx        # Términos de servicio
│   │   │   └── PrivacyPolicy.tsx         # Política de privacidad
│   │   ├── debug/                        # Herramientas de debug
│   │   │   └── TimeTravelModal.tsx       # Modal de viaje en el tiempo
│   │   ├── providers/                    # Providers de contexto
│   │   │   └── Providers.tsx             # Wrapper de providers
│   │   └── ui/                           # Componentes UI reutilizables
│   │       ├── AnimatedBackground.tsx    # Fondo animado
│   │       ├── MagicWrappers.tsx         # Wrappers con animaciones
│   │       └── ...                       # Componentes base
│   ├── 📁 services/                      # Capa de servicios (Business Logic)
│   │   ├── DashboardService.ts           # Lógica del dashboard
│   │   ├── HealthAnalysisService.ts      # Análisis de salud
│   │   └── VeterinaryStatusService.ts    # Estados veterinarios
│   ├── 📁 lib/                          # Bibliotecas y utilidades
│   │   ├── auth.ts                       # Configuración NextAuth
│   │   ├── mongodb.ts                    # Conexión MongoDB
│   │   ├── email.ts                      # Servicio de emails
│   │   ├── dateUtils.ts                  # Utilidades de fechas
│   │   ├── healthUtils.ts                # Utilidades de salud
│   │   └── vaccinationRules.ts           # Reglas de vacunación
│   ├── 📁 models/                       # Modelos de Mongoose
│   │   ├── Pet.ts                        # Modelo de Mascota
│   │   ├── User.ts                       # Modelo de Usuario
│   │   ├── HealthRecord.ts               # Modelo de Registro de Salud
│   │   ├── Notification.ts               # Modelo de Notificación
│   │   └── Invitation.ts                 # Modelo de Invitación
│   ├── 📁 hooks/                        # Custom React Hooks
│   │   ├── usePets.ts                    # Hook de mascotas
│   │   └── useHealthRecords.ts           # Hook de registros
│   ├── 📁 utils/                        # Funciones utilitarias
│   │   ├── vaccinationLogic.ts           # Lógica de vacunación
│   │   ├── vaccinationUtils.ts           # Utils de vacunación
│   │   ├── dewormingLogic.ts             # Lógica de desparasitación
│   │   ├── veterinaryRules.ts            # Reglas veterinarias
│   │   ├── recordUtils.ts                # Utils de registros
│   │   ├── pet-identity.ts               # Identidad de mascotas
│   │   └── server-logger.ts              # Logger unificado de servidor (Pino)
│   ├── 📁 types/                        # Definiciones de tipos
│   │   ├── dashboard.ts                  # Tipos del dashboard
│   │   └── next-auth.d.ts                # Extensiones de NextAuth
│   ├── 📁 i18n/                         # Configuración i18n
│   │   ├── routing.ts                    # Configuración de rutas
│   │   └── request.ts                    # Request context
│   ├── 📁 styles/                       # Estilos globales
│   │   ├── globals.css                   # Estilos CSS globales
│   │   ├── pet-pattern.css               # Patrones de mascotas
│   │   ├── fonts.ts                      # Configuración de fuentes
│   │   └── theme.ts                      # Tema de Mantine
│   ├── 📁 data/                         # Datos estáticos
│   │   └── petTips.ts                    # Tips para mascotas
│   └── middleware.ts                     # Middleware de Next.js
├── 📁 messages/                         # Traducciones
│   ├── es.json                           # Español
│   ├── en.json                           # Inglés
│   └── pt.json                           # Portugués
├── 📁 public/                           # Archivos estáticos
│   └── assets/
│       └── images/                       # Imágenes públicas
├── 📄 next.config.mjs                   # Configuración Next.js
├── 📄 tsconfig.json                     # Configuración TypeScript
├── 📄 postcss.config.cjs                # Configuración PostCSS
├── 📄 package.json                      # Dependencias
└── 📄 README.md                         # Este archivo
```

### 🔄 Flujo de Datos

```
Usuario → Componente UI → Custom Hook → TanStack Query → API Route → Service Layer → Model (Mongoose) → MongoDB
                                        ↓
                                  Client Cache
```

### 🎯 Servicios Principales

#### 📊 DashboardService
Responsable de la lógica del dashboard principal:
- Obtención y agregación de datos de mascotas
- Análisis de alertas activas
- Generación de snapshots de mascotas
- Cálculo de estadísticas globales

#### 🏥 HealthAnalysisService
Análisis inteligente del estado de salud:
- Evaluación de estado de vacunación
- Verificación de desparasitaciones
- Detección de alertas y vencimientos
- Generación de recomendaciones

#### 💉 VeterinaryStatusService
Gestión de estados veterinarios:
- Cálculo de próximas dosis
- Validación de esquemas de vacunación
- Estados categorizados (al día, próximo, vencido)
- Soporte multi-especie (perros, gatos, etc.)

### 🔌 API Endpoints

#### Autenticación
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

#### Mascotas
- `GET /api/pets` - Listar mascotas del usuario
- `POST /api/pets` - Crear nueva mascota
- `GET /api/pets/[id]` - Obtener detalle de mascota
- `PUT /api/pets/[id]` - Actualizar mascota
- `DELETE /api/pets/[id]` - Eliminar mascota
- `POST /api/pets/[id]/share` - Compartir mascota
- `POST /api/pets/[id]/owners/leave` - Abandonar co-tutoría
- `POST /api/pets/[id]/owners/remove-request` - Eliminar solicitud

#### Registros de Salud
- `GET /api/records` - Listar registros (filtrados por mascota)
- `POST /api/records` - Crear nuevo registro
- `PUT /api/records/[id]` - Actualizar registro
- `DELETE /api/records/[id]` - Eliminar registro

#### Notificaciones
- `GET /api/notifications` - Obtener notificaciones del usuario
- `PUT /api/notifications/[id]` - Marcar como leída
- `POST /api/notifications/mark-all-read` - Marcar todas como leídas

#### Invitaciones
- `POST /api/invitations` - Crear invitación
- `GET /api/invitations/[token]` - Obtener detalle de invitación
- `POST /api/invitations/[token]/actions` - Aceptar/rechazar invitación

#### Solicitudes
- `GET /api/requests/[token]` - Obtener detalle de solicitud
- `POST /api/requests/[token]/action` - Aceptar/rechazar solicitud

#### Usuario
- `GET /api/user/preferences` - Obtener preferencias
- `PUT /api/user/preferences` - Actualizar preferencias

#### Cron Jobs
- `GET /api/cron/reminders` - Ejecutar recordatorios automáticos

#### Debug (Solo desarrollo)
- `POST /api/debug/time-travel` - Viaje en el tiempo para testing



---

## 🛠️ Instalación y Configuración

Sigue estos pasos para correr el proyecto localmente:

### 📋 Prerrequisitos

Asegúrate de tener instalado:
- **Node.js 18+** (Recomendado: LTS 20.x)
- **pnpm 11+** (o npm/yarn)
- **MongoDB** (Local o cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** para clonar el repositorio

### 📥 1. Clonar el Repositorio

```bash
git clone https://github.com/damianclancig/PetClan.git
cd PetClan
```

### 📦 2. Instalar Dependencias

```bash
pnpm install
```

### 🔐 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local  # Si existe un ejemplo
# o
touch .env.local
```

Completa las siguientes variables de entorno:

```env
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🗄️ BASE DE DATOS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MongoDB connection string (Atlas o local)
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/petclan?retryWrites=true&w=majority

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔐 AUTENTICACIÓN (Google OAuth)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Obtener en: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=tu-client-id-de-google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret-de-google

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔑 NEXTAUTH CONFIGURACIÓN
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Generar con: openssl rand -base64 32
NEXTAUTH_SECRET=genera-un-string-seguro-de-al-menos-32-caracteres
NEXTAUTH_URL=http://localhost:3000

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🌐 CONFIGURACIÓN DE LA APP
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# URL pública de la aplicación (para SEO y canonical URLs)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 📧 SERVICIO DE CORREO ELECTRÓNICO (Maileroo)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Obtener en: https://maileroo.com/
MAILEROO_API_KEY=tu-api-key-de-maileroo
MAILEROO_FROM_EMAIL=no-reply@tudominio.com

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🎁 ENLACES DE SOPORTE Y DONACIONES (Opcionales)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT_PUBLIC_CAFECITO_USER=tu-usuario-cafecito
NEXT_PUBLIC_PAYPAL_URL=https://paypal.me/tuusuario
NEXT_PUBLIC_MERCADOPAGO_URL=https://link.mercadopago.com.ar/tu-enlace
NEXT_PUBLIC_PORTFOLIO_URL=https://tuportfolio.com
NEXT_PUBLIC_GITHUB_REPO_URL=https://github.com/damianclancig/PetClan

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🖼️ CLOUDINARY (Para almacenamiento de imágenes)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Obtener en: https://cloudinary.com/
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

### 🚀 4. Iniciar Servidor de Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## 📜 Scripts Disponibles

```bash
# 🚀 Desarrollo
pnpm dev             # Inicia servidor de desarrollo (http://localhost:3000)

# 🏗️ Producción
pnpm build           # Genera build optimizado para producción
pnpm start           # Inicia servidor de producción

# 🧹 Linting
pnpm lint            # Ejecuta ESLint para verificar código
```

---

## 🌍 Internacionalización

PetClan soporta múltiples idiomas:

- 🇪🇸 **Español** (es) - Por defecto
- 🇬🇧 **Inglés** (en)
- 🇧🇷 **Portugués** (pt)

### Cambiar Idioma

Los usuarios pueden cambiar el idioma desde:
1. Selector en el header/navbar
2. URL directa: `/es/dashboard`, `/en/dashboard`, `/pt/dashboard`

### Agregar Nuevas Traducciones

1. Añade un nuevo archivo en `messages/` (ej: `fr.json` para francés)
2. Copia la estructura de `messages/es.json`
3. Traduce todos los strings
4. Actualiza la configuración en [src/i18n/routing.ts](src/i18n/routing.ts):

```typescript
export const routing = defineRouting({
  locales: ['es', 'en', 'pt', 'fr'], // Añade el nuevo idioma
  defaultLocale: 'es'
});
```

---

## 🚢 Deployment

### Vercel (Recomendado)

PetClan está optimizado para deployment en [Vercel](https://vercel.com/):

1. **Push a GitHub**
   ```bash
   git push origin main
   ```

2. **Importar en Vercel**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Conecta tu repositorio de GitHub
   - Vercel detectará automáticamente Next.js

3. **Configurar Variables de Entorno**
   - En el dashboard de Vercel, ve a Settings → Environment Variables
   - Añade todas las variables de `.env.local`

4. **Deploy**
   - Vercel desplegará automáticamente en cada push a main
   - Preview deployments para cada PR

### Docker (Alternativa)

```bash
# Construir imagen
docker build -t petclan .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env.local petclan
```

### Otras Plataformas

PetClan es compatible con cualquier plataforma que soporte Node.js:
- **Netlify**: Usar plugin de Next.js
- **Railway**: Deploy directo desde GitHub
- **DigitalOcean App Platform**: Deploy con Dockerfile
- **AWS Amplify**: Configuración Next.js SSR

---

## 🔒 Seguridad

### Buenas Prácticas Implementadas

- ✅ **Autenticación segura** con NextAuth.js y tokens JWT
- ✅ **Validación de datos** en cliente y servidor (Zod)
- ✅ **Protección CSRF** con tokens
- ✅ **Headers de seguridad** configurados en Next.js
- ✅ **Rate limiting** en API routes críticas
- ✅ **Sanitización de inputs** para prevenir XSS
- ✅ **Control de acceso** basado en roles (owner, co-owner)
- ✅ **Conexión segura** a MongoDB con SSL/TLS
- ✅ **Variables de entorno** nunca expuestas al cliente

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Aquí está cómo puedes ayudar:

### Proceso de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guías de Estilo

- Usa **TypeScript** para todo el código nuevo
- Sigue las reglas de **ESLint** configuradas
- Escribe **nombres descriptivos** para variables y funciones
- Añade **comentarios** para lógica compleja
- Mantén **componentes pequeños** y reutilizables
- Usa **Conventional Commits**: `feat:`, `fix:`, `docs:`, `style:`, etc.

### Áreas de Contribución

- 🐛 Reportar y corregir bugs
- ✨ Proponer nuevas características
- 📝 Mejorar documentación
- 🌍 Añadir traducciones
- 🎨 Mejorar UI/UX
- ⚡ Optimizar rendimiento
- 🧪 Añadir tests

---

## 📄 Licencia

Este proyecto está bajo la Licencia **ISC**.

```
ISC License

Copyright (c) 2026 PetClan

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 🙏 Agradecimientos

- **[Mantine](https://mantine.dev/)** por el increíble sistema de diseño
- **[Vercel](https://vercel.com/)** por el hosting y deployment
- **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** por la base de datos
- **[Cloudinary](https://cloudinary.com/)** por el almacenamiento de imágenes
- **[Tabler Icons](https://tabler-icons.io/)** por los iconos hermosos
- La comunidad de **Next.js** y **React** por las herramientas increíbles

---

## 📞 Contacto & Soporte

- 🐛 **Reportar Bugs**: [GitHub Issues](https://github.com/damianclancig/PetClan/issues)
- 💡 **Solicitar Features**: [GitHub Issues](https://github.com/damianclancig/PetClan/issues)
- 📧 **Email**: damian@clancig.com.ar
- 🌐 **Website**: [petclan.clancig.com.ar](https://petclan.clancig.com.ar)

---

## ☕ Apoyo al Proyecto

Si te gusta PetClan y quieres apoyar su desarrollo:

- ⭐ Dale una estrella al repositorio en GitHub
- 🐛 Reporta bugs y sugiere mejoras
- 🤝 Contribuye con código
- ☕ Invítame un café en [Cafecito](https://cafecito.app/damianclancig)
- 💙 Colabora fácilmente con [Mercado Pago](https://link.mercadopago.com.ar/clancigfullstackdev) o [PayPal](https://paypal.me/Clancig)
- 📢 Comparte el proyecto con otros amantes de las mascotas

---

<div align="center">
  <p>Hecho con ❤️ y ☕ para todos los amantes de las mascotas</p>
  <p>© 2026 PetClan - Libreta Sanitaria Digital</p>
  
  ⭐ **Si este proyecto te resulta útil, por favor considera darle una estrella en GitHub** ⭐
</div>
