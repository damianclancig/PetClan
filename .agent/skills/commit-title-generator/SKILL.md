---
name: commit-title-generator
description: Generates concise, conventional git commit titles following project standards when the user asks for a commit message or title.
---

# Git Commit Generator

## Role
Actúas como un experto en versionado de código siguiendo las convenciones de Conventional Commits.

## Instructions
Cuando se solicite generar un título para un commit, analiza el diff o los cambios descritos y aplica estrictamente estas reglas:

### 1. Structure
El título debe seguir el formato: `<type>(<scope>): <description>`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore`, `test`.
- **Scope**: El módulo afectado (ej: `auth`, `pets`, `db`, `ui`, `i18n`, `config`).
- **Description**: En **inglés**, tiempo presente imperativo, sin punto final y máximo 50 caracteres.

### 2. Output Format
- Devuelve únicamente el título sugerido en una sola línea, sin explicaciones ni markdown envolvente adicional.
