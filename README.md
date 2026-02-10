# PRONUBE

Plataforma Profesional de Creación de Contratos en la Nube

## 🚀 Características

- ✨ Creación de contratos personalizados
- 👥 Gestión de usuarios con sistema de roles
- 📊 Dashboard con estadísticas y reportes
- 📄 Generación masiva de contratos
- 📥 Exportación a Excel
- 🔐 Sistema de autenticación y permisos

## 👤 Roles del Sistema

### 🔴 Administrador (ADMIN)
- Acceso total al sistema
- Gestiona usuarios y contratos
- Crea, edita y elimina registros
- Acceso al dashboard y reportes
- Gestiona plantillas

### 🟢 Usuario (USUARIO)
- Crea y edita sus propios contratos
- Sin acceso al dashboard
- No puede gestionar usuarios

### 🔵 Visualizador (VISUALIZADOR)
- Solo lectura en todo el sistema
- Acceso al dashboard y reportes
- No puede crear ni editar

## 🛠️ Tecnologías

- Next.js 14
- TypeScript
- PostgreSQL + Prisma
- Tailwind CSS
- Recharts (gráficos)
- XLSX (exportación Excel)

## 📦 Instalación

```bash
npm install
```

## ⚙️ Configuración

1. Configurar PostgreSQL y crear base de datos
2. Crear archivo `.env`:
```
DATABASE_URL="postgresql://usuario:password@localhost:5432/pronube"
```

3. Ejecutar migraciones:
```bash
npx prisma db push
```

4. Generar cliente Prisma:
```bash
npx prisma generate
```

## 🚀 Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🔑 Credenciales por Defecto

Después de configurar la BD, crear un usuario admin manualmente o usar la página de login.

## 📝 Estado del Proyecto

- [x] Sistema de roles básico
- [x] Autenticación
- [x] Dashboard con gráficos
- [x] Gestión de usuarios
- [x] Generación masiva de contratos
- [ ] Configurar PostgreSQL
- [ ] Importar dump de datos
- [ ] Mejoras en generación de PDF
