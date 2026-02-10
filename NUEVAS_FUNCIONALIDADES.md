# Nuevas Funcionalidades - PRONUBE

## Vista Previa en Tiempo Real de Contratos

### Descripción
Se ha implementado un sistema de vista previa en tiempo real que permite ver el contrato mientras se completan los campos en el formulario.

### Características
- **Vista en dos columnas**: Formulario de entrada a la izquierda y vista previa a la derecha
- **Actualización instantánea**: Los cambios en los campos se reflejan inmediatamente en la vista previa
- **Toggle de vista**: Botón para mostrar/ocultar la vista previa según preferencia del usuario
- **Formato simulado**: La vista previa muestra el contrato con formato similar al PDF final
- **Detección de títulos**: Identifica y formatea automáticamente títulos en mayúsculas
- **Scroll independiente**: Cada panel tiene scroll independiente para mejor navegación

### Ubicación
- Página: `/crear-contrato`
- Función: `generatePreview()` genera el contenido en tiempo real

### Cómo usar
1. Accede a "Crear Contrato" desde el menú principal
2. Selecciona una plantilla de contrato
3. La vista previa se muestra automáticamente a la derecha
4. Completa los campos y observa los cambios en tiempo real
5. Click en "Ocultar Vista Previa" si necesitas más espacio para el formulario

---

## Sistema de Gestión de Plantillas

### Descripción
Nueva interfaz completa para gestionar plantillas de contratos, con capacidad de crear, editar, visualizar y eliminar plantillas personalizadas.

### Características Principales

#### 1. Crear Nuevas Plantillas
- Formulario intuitivo para definir nombre y tipo de contrato
- Editor de texto para el contenido de la plantilla
- **Sistema de variables**: Use `{NOMBRE_CAMPO}` para crear campos dinámicos
- **Detección automática de campos**: El sistema identifica automáticamente todos los campos definidos
- Vista previa en tiempo real mientras escribes

#### 2. Subir Documentos
- Soporte para archivos .txt, .doc, .docx
- Carga directa del contenido del archivo al editor
- Preserva el formato del documento original

#### 3. Editar Plantillas Existentes
- Selección rápida desde sidebar
- Editor con resaltado del contenido
- Actualización de nombre, tipo y contenido
- Reemplazo del contenido con un nuevo archivo
- Vista previa en tiempo real de los cambios

#### 4. Vista Previa en Tiempo Real
- Panel de vista previa que muestra cómo se verá el contrato
- Formato profesional con tipografía serif
- Identificación automática de campos en el contenido
- Muestra los campos detectados con formato `{CAMPO}`

#### 5. Gestión de Campos
- **Extracción automática**: Detecta todos los campos `{CAMPO}` en el contenido
- **Visualización**: Muestra todos los campos detectados con badges
- **Actualización automática**: Al guardar, actualiza la lista de campos
- **Validación**: Asegura que los campos tengan el formato correcto

#### 6. Eliminar Plantillas
- Botón de eliminación con confirmación
- **Protección**: No permite eliminar plantillas con contratos asociados
- Mensaje informativo sobre contratos existentes

### API Endpoints

#### GET /api/templates
Obtiene todas las plantillas disponibles
```json
Response: [
  {
    "id": "string",
    "nombre": "string",
    "tipo": "string",
    "contenido": "string",
    "campos": ["CAMPO1", "CAMPO2"]
  }
]
```

#### POST /api/templates
Crea una nueva plantilla
```json
Request: {
  "nombre": "string",
  "tipo": "string",
  "contenido": "string",
  "campos": ["CAMPO1", "CAMPO2"]
}
```

#### PUT /api/templates
Actualiza una plantilla existente
```json
Request: {
  "id": "string",
  "nombre": "string",
  "tipo": "string",
  "contenido": "string",
  "campos": ["CAMPO1", "CAMPO2"]
}
```

#### DELETE /api/templates
Elimina una plantilla
```json
Request: {
  "id": "string"
}
```

### Formato de Variables en Plantillas

Para crear campos dinámicos en las plantillas, use el siguiente formato:

```
{NOMBRE_CAMPO}
```

**Ejemplos de campos comunes:**
- `{NOMBRE_CONTRATADO}` - Nombre del empleado
- `{CEDULA}` - Número de cédula
- `{CARGO}` - Cargo o posición
- `{SALARIO}` - Monto del salario
- `{FECHA_INICIO}` - Fecha de inicio
- `{CIUDAD}` - Ciudad
- `{EMPRESA}` - Nombre de la empresa

**Ejemplo de plantilla:**

```
CONTRATO DE TRABAJO

Entre {EMPRESA}, representada por {REPRESENTANTE_LEGAL}, y {NOMBRE_CONTRATADO}, 
identificado con cédula {CEDULA}, se celebra el presente contrato de trabajo 
bajo las siguientes condiciones:

PRIMERA: CARGO Y FUNCIONES
El trabajador desempeñará el cargo de {CARGO} con las funciones inherentes 
al mismo.

SEGUNDA: REMUNERACIÓN
El trabajador recibirá un salario mensual de {SALARIO} pesos.

TERCERA: VIGENCIA
Este contrato inicia el {FECHA_INICIO} y tendrá una duración de {DURACION}.
```

### Ubicación
- Página: `/gestionar-plantillas`
- API: `/api/templates`

### Permisos
- Solo usuarios con rol **ADMIN** pueden acceder a la gestión de plantillas
- El enlace solo aparece en el menú para administradores

### Cómo usar

#### Crear una nueva plantilla:
1. Click en el botón "+" (verde) en el sidebar
2. Completa nombre y tipo de contrato
3. Opcionalmente, carga un archivo con el contenido
4. O escribe/pega el contenido directamente
5. Usa `{NOMBRE_CAMPO}` para definir campos variables
6. Observa la vista previa y los campos detectados
7. Click en "Crear Plantilla"

#### Editar una plantilla:
1. Selecciona la plantilla del sidebar
2. Click en "Editar"
3. Modifica nombre, tipo o contenido
4. Observa los cambios en tiempo real en la vista previa
5. Click en "Guardar Cambios"

#### Subir documento:
1. En modo crear o editar
2. Click en "Subir Documento" o campo de archivo
3. Selecciona archivo .txt, .doc o .docx
4. El contenido se carga automáticamente
5. Revisa y ajusta según necesites

#### Eliminar plantilla:
1. Selecciona la plantilla del sidebar
2. Click en "Eliminar" (botón rojo)
3. Confirma la acción
4. Si hay contratos asociados, se mostrará un mensaje de error

---

## Mejoras Técnicas

### Frontend
- Uso de React hooks (useState, useEffect) para gestión de estado
- Componente con vista previa dinámica y reactiva
- Diseño responsivo con Tailwind CSS
- Iconos de React Icons para mejor UX

### Backend
- API RESTful completa para operaciones CRUD
- Validación de datos en servidor
- Protección contra eliminación de plantillas en uso
- Manejo robusto de errores

### Base de Datos
- Uso de Prisma ORM para consultas eficientes
- Modelo `ContractTemplate` con campos JSON para flexibilidad
- Relaciones entre contratos y plantillas

---

## Próximas Mejoras Sugeridas

1. **Editor de texto enriquecido**: Implementar un editor WYSIWYG para mejor formato
2. **Versionado de plantillas**: Mantener historial de cambios
3. **Plantillas compartidas**: Sistema para compartir plantillas entre usuarios
4. **Categorías**: Organizar plantillas por categorías
5. **Búsqueda**: Sistema de búsqueda de plantillas por nombre o tipo
6. **Duplicar plantillas**: Función para clonar plantillas existentes
7. **Exportar/Importar**: Exportar plantillas como archivo JSON
8. **Validación de campos**: Validar que todos los campos necesarios estén completos
9. **Sugerencias**: Autocompletar campos comunes mientras se escribe
10. **Historial**: Ver qué contratos se generaron con cada plantilla

---

## Soporte Técnico

Para reportar problemas o sugerencias:
- Revisa los logs del servidor para errores detallados
- Verifica la consola del navegador para errores de cliente
- Asegúrate de tener los permisos adecuados (ADMIN)

## Notas de Desarrollo

- La detección de campos usa regex: `/\{([A-Z_]+)\}/g`
- Los campos deben estar en MAYÚSCULAS con guiones bajos
- El formato de vista previa simula el PDF final
- Los archivos .doc/.docx requieren conversión del lado del cliente
