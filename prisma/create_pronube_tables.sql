-- Crear tablas para el sistema de contratos PRONUBE sin afectar las tablas existentes de Quipux

-- Tabla de plantillas de contratos
CREATE TABLE IF NOT EXISTS contract_templates (
  id VARCHAR(255) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  campos JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de contratos generados
CREATE TABLE IF NOT EXISTS contratos (
  id VARCHAR(255) PRIMARY KEY,
  "userId" VARCHAR(255) NOT NULL,
  "templateId" VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'generado',
  fecha TIMESTAMP NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_template FOREIGN KEY ("templateId") REFERENCES contract_templates(id) ON DELETE RESTRICT
  -- Nota: La FK a usuarios se omitió porque la tabla tiene otro nombre en Quipux
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_contratos_userId ON contratos("userId");
CREATE INDEX IF NOT EXISTS idx_contratos_templateId ON contratos("templateId");
CREATE INDEX IF NOT EXISTS idx_contratos_fecha ON contratos(fecha);
CREATE INDEX IF NOT EXISTS idx_templates_tipo ON contract_templates(tipo);

-- Insertar plantillas de ejemplo si no existen
INSERT INTO contract_templates (id, nombre, tipo, contenido, campos, "createdAt", "updatedAt")
SELECT 
  'tpl_' || gen_random_uuid()::text,
  'Contrato de Trabajo a Término Fijo',
  'Laboral',
  'CONTRATO DE TRABAJO A TÉRMINO FIJO

Entre {EMPRESA}, identificada con NIT {NIT_EMPRESA}, representada por {REPRESENTANTE_LEGAL}, y {NOMBRE_CONTRATADO}, identificado(a) con cédula de ciudadanía número {CEDULA}, se celebra el presente contrato de trabajo a término fijo.

PRIMERA: OBJETO
{EMPRESA} contrata los servicios personales de {NOMBRE_CONTRATADO} para desempeñar el cargo de {CARGO}.

SEGUNDA: DURACIÓN
El presente contrato tendrá vigencia desde {FECHA_INICIO} hasta {FECHA_FIN}.

TERCERA: LUGAR DE TRABAJO
El trabajador prestará sus servicios en {DIRECCION_TRABAJO}, {CIUDAD}.

CUARTA: JORNADA LABORAL
La jornada será de {HORAS_SEMANA} horas semanales.

QUINTA: REMUNERACIÓN
El salario mensual será de {SALARIO} pesos.

Para constancia se firma en {CIUDAD} el {FECHA_FIRMA}.

_____________________________          _____________________________
{REPRESENTANTE_LEGAL}                  {NOMBRE_CONTRATADO}
Representante Legal                    Trabajador
C.C. {CEDULA_REPRESENTANTE}           C.C. {CEDULA}',
  '["EMPRESA", "NIT_EMPRESA", "REPRESENTANTE_LEGAL", "NOMBRE_CONTRATADO", "CEDULA", "CARGO", "FECHA_INICIO", "FECHA_FIN", "DIRECCION_TRABAJO", "CIUDAD", "HORAS_SEMANA", "SALARIO", "FECHA_FIRMA", "CEDULA_REPRESENTANTE"]'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM contract_templates WHERE nombre = 'Contrato de Trabajo a Término Fijo');

INSERT INTO contract_templates (id, nombre, tipo, contenido, campos, "createdAt", "updatedAt")
SELECT 
  'tpl_' || gen_random_uuid()::text,
  'Contrato de Prestación de Servicios',
  'Servicios',
  'CONTRATO DE PRESTACIÓN DE SERVICIOS

Entre {CONTRATANTE}, identificada con NIT {NIT_CONTRATANTE}, representada por {REPRESENTANTE}, y {CONTRATISTA}, identificado con cédula {CEDULA_CONTRATISTA}, se celebra el presente contrato de prestación de servicios.

PRIMERA: OBJETO
{CONTRATISTA} se compromete a prestar los servicios de {DESCRIPCION_SERVICIOS} en beneficio de {CONTRATANTE}.

SEGUNDA: OBLIGACIONES DEL CONTRATISTA
{OBLIGACIONES}

TERCERA: VALOR DEL CONTRATO
El valor total del contrato es de {VALOR_CONTRATO} pesos.

CUARTA: PLAZO
El plazo de ejecución es de {PLAZO} contados desde {FECHA_INICIO}.

QUINTA: FORMA DE PAGO
{FORMA_PAGO}

Firmado en {CIUDAD} el {FECHA}.

_____________________________          _____________________________
{REPRESENTANTE}                        {CONTRATISTA}
Contratante                            Contratista
C.C. {CEDULA_REPRESENTANTE}           C.C. {CEDULA_CONTRATISTA}',
  '["CONTRATANTE", "NIT_CONTRATANTE", "REPRESENTANTE", "CONTRATISTA", "CEDULA_CONTRATISTA", "DESCRIPCION_SERVICIOS", "OBLIGACIONES", "VALOR_CONTRATO", "PLAZO", "FECHA_INICIO", "FORMA_PAGO", "CIUDAD", "FECHA", "CEDULA_REPRESENTANTE"]'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM contract_templates WHERE nombre = 'Contrato de Prestación de Servicios');

INSERT INTO contract_templates (id, nombre, tipo, contenido, campos, "createdAt", "updatedAt")
SELECT 
  'tpl_' || gen_random_uuid()::text,
  'Contrato de Trabajo Indefinido',
  'Laboral',
  'CONTRATO DE TRABAJO A TÉRMINO INDEFINIDO

Entre {EMPRESA}, con NIT {NIT}, representada por {REPRESENTANTE_LEGAL}, y {EMPLEADO}, con cédula {CEDULA}, se celebra el presente contrato.

PRIMERA: OBJETO
{EMPLEADO} prestará sus servicios como {CARGO}.

SEGUNDA: REMUNERACIÓN
Salario mensual: {SALARIO} pesos.

TERCERA: LUGAR
{DIRECCION}, {CIUDAD}.

CUARTA: JORNADA
{JORNADA}

Firmado en {CIUDAD} el {FECHA}.

_____________________________          _____________________________
{REPRESENTANTE_LEGAL}                  {EMPLEADO}
Empleador                              Trabajador',
  '["EMPRESA", "NIT", "REPRESENTANTE_LEGAL", "EMPLEADO", "CEDULA", "CARGO", "SALARIO", "DIRECCION", "CIUDAD", "JORNADA", "FECHA"]'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM contract_templates WHERE nombre = 'Contrato de Trabajo Indefinido');

-- Comentario de confirmación
COMMENT ON TABLE contract_templates IS 'Plantillas de contratos para el sistema PRONUBE';
COMMENT ON TABLE contratos IS 'Contratos generados en el sistema PRONUBE';
