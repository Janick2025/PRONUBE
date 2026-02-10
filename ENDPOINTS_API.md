# API Endpoints - PRONUBE con Quipux

## 🔍 Búsqueda de Usuarios por Cédula

### Endpoint Principal: Buscar Usuario por Cédula
```
GET /api/users/by-cedula?cedula={numero}
```

**Descripción:** Busca un usuario en la base de datos de Quipux usando su número de cédula. Primero busca en la tabla `usuarios`, si no encuentra resultados, busca en `ciudadano`.

**Parámetros:**
- `cedula` (string, requerido): Número de cédula del usuario

**Ejemplo de petición:**
```bash
curl http://localhost:3000/api/users/by-cedula?cedula=1001234567
```

**Respuesta exitosa (200):**
```json
{
  "id": "123",
  "nombre": "Juan Pérez García",
  "cedula": "1001234567",
  "email": "juan.perez@example.com",
  "telefono": "3001234567",
  "cargo": "Desarrollador",
  "direccion": "Calle 123 #45-67",
  "ciudad": "",
  "salario": "",
  "institucion": "Ministerio de TIC"
}
```

**Respuesta de error (404):**
```json
{
  "error": "Usuario no encontrado"
}
```

---

## 📋 Listar Usuarios

### Endpoint: Listar Usuarios con Búsqueda
```
GET /api/users?search={texto}&limit={numero}
```

**Descripción:** Lista usuarios con opción de búsqueda por nombre, cédula o email.

**Parámetros:**
- `search` (string, opcional): Texto a buscar en nombre, cédula o email
- `limit` (number, opcional, default: 50): Cantidad máxima de resultados

**Ejemplo de petición:**
```bash
# Listar primeros 50 usuarios
curl http://localhost:3000/api/users

# Buscar usuarios que contengan "Juan"
curl http://localhost:3000/api/users?search=Juan&limit=20
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "123",
    "nombre": "Juan Pérez García",
    "cedula": "1001234567",
    "email": "juan.perez@example.com",
    "cargo": "Desarrollador",
    "telefono": "3001234567",
    "direccion": "Calle 123",
    "institucion": "Ministerio de TIC",
    "estado": 1
  },
  ...
]
```

---

## 🔎 Búsqueda Avanzada de Usuarios

### Endpoint GET: Búsqueda Simple
```
GET /api/users/search?q={texto}&limit={numero}
```

**Parámetros:**
- `q` (string, requerido): Término de búsqueda
- `limit` (number, opcional, default: 20): Cantidad de resultados

**Ejemplo:**
```bash
curl http://localhost:3000/api/users/search?q=rodriguez&limit=10
```

### Endpoint POST: Búsqueda con Múltiples Criterios
```
POST /api/users/search
Content-Type: application/json
```

**Body:**
```json
{
  "cedula": "1001234567",
  "nombre": "Juan",
  "email": "juan@example.com",
  "limit": 20
}
```

**Nota:** Al menos uno de los criterios (cedula, nombre, email) es requerido.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "count": 5,
  "usuarios": [
    {
      "id": "123",
      "nombre": "Juan Pérez García",
      "nombreCompleto": "Juan Pérez García",
      "nombreSolo": "Juan",
      "apellido": "Pérez García",
      "cedula": "1001234567",
      "email": "juan.perez@example.com",
      "cargo": "Desarrollador",
      "telefono": "3001234567",
      "direccion": "Calle 123",
      "institucion": "Ministerio de TIC",
      "ciudad": "",
      "salario": "",
      "estado": 1
    }
  ]
}
```

---

## 📄 Plantillas de Contratos

### Listar Plantillas
```
GET /api/templates
```

**Descripción:** Obtiene todas las plantillas de contratos disponibles.

**Respuesta exitosa (200):**
```json
[
  {
    "id": "tpl_123",
    "nombre": "Contrato de Trabajo a Término Fijo",
    "tipo": "Laboral",
    "contenido": "CONTRATO DE TRABAJO...",
    "campos": ["EMPRESA", "NOMBRE_CONTRATADO", "CEDULA", "CARGO", ...]
  }
]
```

### Crear Plantilla
```
POST /api/templates
Content-Type: application/json
```

**Body:**
```json
{
  "nombre": "Contrato de Servicios Profesionales",
  "tipo": "Servicios",
  "contenido": "CONTRATO DE PRESTACIÓN DE SERVICIOS...",
  "campos": ["CONTRATANTE", "CONTRATISTA", "CEDULA", ...]
}
```

### Actualizar Plantilla
```
PUT /api/templates
Content-Type: application/json
```

**Body:**
```json
{
  "id": "tpl_123",
  "nombre": "Nuevo nombre",
  "tipo": "Laboral",
  "contenido": "Contenido actualizado...",
  "campos": ["CAMPO1", "CAMPO2"]
}
```

### Eliminar Plantilla
```
DELETE /api/templates
Content-Type: application/json
```

**Body:**
```json
{
  "id": "tpl_123"
}
```

---

## 📑 Generar Contratos

### Generar y Descargar PDF
```
POST /api/generate-pdf
Content-Type: application/json
```

**Body:**
```json
{
  "templateId": "tpl_123",
  "fields": {
    "EMPRESA": "ACME Corp",
    "NOMBRE_CONTRATADO": "Juan Pérez",
    "CEDULA": "1001234567",
    "CARGO": "Desarrollador Senior",
    "SALARIO": "5000000",
    "FECHA_INICIO": "2026-02-10"
  }
}
```

**Respuesta:** Archivo PDF descargable

---

## 🏥 Estado del Sistema

### Verificar Conexión y Estado
```
GET /api/health
```

**Descripción:** Verifica la conexión con la base de datos y muestra estadísticas del sistema.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Conexión exitosa a la base de datos",
  "statistics": {
    "usuarios": 1523,
    "plantillas": 3,
    "contratos": 45
  },
  "sampleData": {
    "usuarios": [...],
    "plantillas": [...]
  },
  "endpoints": {
    "buscarPorCedula": "/api/users/by-cedula?cedula=XXXXXXXXXX",
    "listarUsuarios": "/api/users?search=nombre&limit=50",
    "buscarUsuarios": "/api/users/search?q=nombre",
    "buscarAvanzada": "POST /api/users/search {cedula, nombre, email}",
    "listarPlantillas": "/api/templates",
    "generarPDF": "POST /api/generate-pdf {templateId, fields}"
  }
}
```

---

## 🧪 Ejemplos de Uso con JavaScript/TypeScript

### Buscar usuario por cédula (en componente React)

```typescript
const buscarUsuarioPorCedula = async (cedula: string) => {
  try {
    const response = await fetch(`/api/users/by-cedula?cedula=${cedula}`);
    
    if (!response.ok) {
      console.error('Usuario no encontrado');
      return null;
    }
    
    const usuario = await response.json();
    console.log('Usuario encontrado:', usuario);
    return usuario;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

// Uso
const usuario = await buscarUsuarioPorCedula('1001234567');
if (usuario) {
  console.log(`Nombre: ${usuario.nombre}`);
  console.log(`Email: ${usuario.email}`);
  console.log(`Cargo: ${usuario.cargo}`);
}
```

### Búsqueda avanzada de usuarios

```typescript
const buscarUsuarios = async (criterios: {
  cedula?: string;
  nombre?: string;
  email?: string;
  limit?: number;
}) => {
  try {
    const response = await fetch('/api/users/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criterios)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`Se encontraron ${data.count} usuarios`);
      return data.usuarios;
    }
    
    return [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// Uso
const usuarios = await buscarUsuarios({ 
  nombre: 'Juan',
  limit: 10 
});
```

### Generar contrato PDF

```typescript
const generarContratoPDF = async (templateId: string, campos: Record<string, string>) => {
  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId,
        fields: campos
      })
    });
    
    if (!response.ok) {
      throw new Error('Error al generar PDF');
    }
    
    // Descargar el PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contrato-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log('PDF generado y descargado exitosamente');
  } catch (error) {
    console.error('Error generando PDF:', error);
  }
};

// Uso
await generarContratoPDF('tpl_123', {
  EMPRESA: 'ACME Corp',
  NOMBRE_CONTRATADO: 'Juan Pérez',
  CEDULA: '1001234567',
  CARGO: 'Desarrollador',
  SALARIO: '5000000'
});
```

---

## 📊 Estructura de Datos

### Usuario (Quipux)
```typescript
interface Usuario {
  id: string;
  nombre: string;           // Nombre completo concatenado
  nombreSolo?: string;      // Solo primer nombre
  apellido?: string;        // Apellidos
  cedula: string;
  email?: string;
  telefono?: string;
  cargo?: string;
  direccion?: string;
  ciudad?: string;
  salario?: string;
  institucion?: string;     // Institución donde trabaja
  empresa?: string;         // Empresa (para ciudadanos)
  estado?: number;          // 0=Inactivo, 1=Activo
}
```

### Plantilla de Contrato
```typescript
interface PlantillaContrato {
  id: string;
  nombre: string;
  tipo: string;
  contenido: string;        // Texto con {CAMPOS} a reemplazar
  campos: string[];         // Array de nombres de campos: ["EMPRESA", "CEDULA", ...]
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚀 Cómo Probar los Endpoints

### 1. Verificar que el sistema esté funcionando
```bash
curl http://localhost:3000/api/health
```

### 2. Buscar un usuario por cédula
```bash
curl http://localhost:3000/api/users/by-cedula?cedula=1001234567
```

### 3. Listar usuarios
```bash
curl http://localhost:3000/api/users?limit=5
```

### 4. Búsqueda avanzada
```bash
curl -X POST http://localhost:3000/api/users/search \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","limit":5}'
```

### 5. Listar plantillas disponibles
```bash
curl http://localhost:3000/api/templates
```

---

## ⚠️ Notas Importantes

1. **Base de Datos:** Los endpoints están configurados para leer de las tablas de Quipux (`usuarios`, `ciudadano`) y las tablas de PRONUBE (`contract_templates`, `contratos`).

2. **Seguridad:** En producción, asegúrate de implementar autenticación y autorización adecuadas.

3. **Formato de Cédula:** El sistema busca cédulas usando LIKE, por lo que puede encontrar coincidencias parciales.

4. **Campos Dinámicos:** En las plantillas, los campos se definen usando la sintaxis `{NOMBRE_CAMPO}` en MAYÚSCULAS.

5. **Codificación:** Todos los endpoints usan UTF-8 y retornan JSON.
