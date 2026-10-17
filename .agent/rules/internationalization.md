---
trigger: always_on
---

# Rule: Internationalization & Localization (next-intl)

## Context
PetClan es una plataforma multiidioma que soporta Español (`es`), Inglés (`en`) y Portugués (`pt`), gestionada exclusivamente mediante `next-intl` y archivos de recursos en `messages/*.json`.

## 1. Cero Texto Hardcodeado
- Queda estrictamente prohibido escribir cadenas de texto plano visibles para el usuario dentro de componentes JSX/TSX.
- Todo texto debe ser extraído mediante `useTranslations` (en componentes cliente) o `getTranslations` (en componentes servidor) de `next-intl`.

## 2. Sincronización de Claves y Validez Estricta de JSON
- Al crear o modificar textos:
  1. Define una clave descriptiva agrupada bajo su namespace correspondiente (ej. `pets.card.details_button`).
  2. Proporciona la traducción simultánea para los **tres idiomas** en `messages/es.json`, `messages/en.json` y `messages/pt.json`.
  3. **PROHIBICIÓN ESTRICTA DE COMENTARIOS**: Los archivos JSON estándar no soportan comentarios (`//` o `/* */`). Queda terminantemente prohibido incluir notas como `// TODO: Review translation` en los JSONs, ya que invalidan la sintaxis y provocan fallos de parseo en compilación o ejecución.

## 3. Datos Dinámicos y Formateo
- Emplea interpolación de parámetros de `next-intl` para textos dinámicos (`{count}`, `{name}`).
- Para fechas, monedas y números con formato local, utiliza los formateadores nativos de `next-intl` o las APIs estándar `Intl.DateTimeFormat` / `Intl.NumberFormat` respetando el locale activo.