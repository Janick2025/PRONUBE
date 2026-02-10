-- Ver plantillas actuales
SELECT id, nombre, tipo, LENGTH(contenido) as longitud FROM contract_templates;

-- Limpiar plantillas existentes
TRUNCATE TABLE contract_templates CASCADE;

-- Insertar plantillas con codificación correcta
INSERT INTO contract_templates (id, nombre, tipo, contenido, campos, "createdAt", "updatedAt")
VALUES 
('tpl_' || gen_random_uuid()::text, 'Contrato de Trabajo a Término Fijo', 'Laboral', 
'CONTRATO DE TRABAJO A TERMINO FIJO

Entre {EMPRESA}, identificada con NIT {NIT_EMPRESA}, representada por {REPRESENTANTE_LEGAL}, y {NOMBRE_CONTRATADO}, identificado(a) con cedula de ciudadania numero {CEDULA}, se celebra el presente contrato de trabajo a termino fijo.

PRIMERA: OBJETO
{EMPRESA} contrata los servicios personales de {NOMBRE_CONTRATADO} para desempeñar el cargo de {CARGO}.

SEGUNDA: DURACION
El presente contrato tendra vigencia desde {FECHA_INICIO} hasta {FECHA_FIN}.

TERCERA: LUGAR DE TRABAJO
El trabajador prestara sus servicios en {DIRECCION_TRABAJO}, {CIUDAD}.

CUARTA: JORNADA LABORAL
La jornada sera de {HORAS_SEMANA} horas semanales.

QUINTA: REMUNERACION
El salario mensual sera de {SALARIO} pesos.

Para constancia se firma en {CIUDAD} el {FECHA_FIRMA}.

_____________________________          _____________________________
{REPRESENTANTE_LEGAL}                  {NOMBRE_CONTRATADO}
Representante Legal                    Trabajador
C.C. {CEDULA_REPRESENTANTE}           C.C. {CEDULA}',
'["EMPRESA", "NIT_EMPRESA", "REPRESENTANTE_LEGAL", "NOMBRE_CONTRATADO", "CEDULA", "CARGO", "FECHA_INICIO", "FECHA_FIN", "DIRECCION_TRABAJO", "CIUDAD", "HORAS_SEMANA", "SALARIO", "FECHA_FIRMA", "CEDULA_REPRESENTANTE"]'::jsonb,
NOW(), NOW()),

('tpl_' || gen_random_uuid()::text, 'Contrato de Prestación de Servicios', 'Servicios',
'CONTRATO DE PRESTACION DE SERVICIOS

Entre {CONTRATANTE}, identificada con NIT {NIT_CONTRATANTE}, representada por {REPRESENTANTE}, y {CONTRATISTA}, identificado con cedula {CEDULA_CONTRATISTA}, se celebra el presente contrato de prestacion de servicios.

PRIMERA: OBJETO
{CONTRATISTA} se compromete a prestar los servicios de {DESCRIPCION_SERVICIOS} en beneficio de {CONTRATANTE}.

SEGUNDA: OBLIGACIONES DEL CONTRATISTA
{OBLIGACIONES}

TERCERA: VALOR DEL CONTRATO
El valor total del contrato es de {VALOR_CONTRATO} pesos.

CUARTA: PLAZO
El plazo de ejecucion es de {PLAZO} contados desde {FECHA_INICIO}.

QUINTA: FORMA DE PAGO
{FORMA_PAGO}

Firmado en {CIUDAD} el {FECHA}.

_____________________________          _____________________________
{REPRESENTANTE}                        {CONTRATISTA}
Contratante                            Contratista
C.C. {CEDULA_REPRESENTANTE}           C.C. {CEDULA_CONTRATISTA}',
'["CONTRATANTE", "NIT_CONTRATANTE", "REPRESENTANTE", "CONTRATISTA", "CEDULA_CONTRATISTA", "DESCRIPCION_SERVICIOS", "OBLIGACIONES", "VALOR_CONTRATO", "PLAZO", "FECHA_INICIO", "FORMA_PAGO", "CIUDAD", "FECHA", "CEDULA_REPRESENTANTE"]'::jsonb,
NOW(), NOW()),

('tpl_' || gen_random_uuid()::text, 'Contrato de Trabajo Indefinido', 'Laboral',
'CONTRATO DE TRABAJO A TERMINO INDEFINIDO

Entre {EMPRESA}, con NIT {NIT}, representada por {REPRESENTANTE_LEGAL}, y {EMPLEADO}, con cedula {CEDULA}, se celebra el presente contrato.

PRIMERA: OBJETO
{EMPLEADO} prestara sus servicios como {CARGO}.

SEGUNDA: REMUNERACION
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
NOW(), NOW());

-- Verificar que se insertaron correctamente
SELECT id, nombre, tipo FROM contract_templates;
