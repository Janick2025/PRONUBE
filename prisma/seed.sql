-- Script de datos de prueba para PRONUBE
-- Ejecutar después de hacer: npx prisma db push

-- Limpiar datos existentes
TRUNCATE TABLE "contratos" CASCADE;
TRUNCATE TABLE "contract_templates" CASCADE;
TRUNCATE TABLE "users" CASCADE;

-- Insertar Usuarios (30 usuarios)
INSERT INTO "users" (id, nombre, cedula, email, telefono, cargo, salario, direccion, ciudad, role, password, "createdAt", "updatedAt") VALUES
-- Administradores
('user1', 'Carlos Rodríguez', '1001234567', 'carlos.rodriguez@pronube.com', '3001234567', 'Director General', '8000000', 'Calle 100 #15-20', 'Bogotá', 'ADMIN', 'admin', NOW(), NOW()),
('user2', 'María González', '1001234568', 'maria.gonzalez@pronube.com', '3001234568', 'Gerente RRHH', '6000000', 'Carrera 7 #32-45', 'Bogotá', 'ADMIN', 'admin123', NOW(), NOW()),

-- Usuarios regulares
('user3', 'Juan Pérez', '1002345678', 'juan.perez@email.com', '3101234567', 'Desarrollador Senior', '4500000', 'Calle 45 #12-34', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user4', 'Ana Martínez', '1003456789', 'ana.martinez@email.com', '3102345678', 'Diseñadora UX', '4000000', 'Carrera 15 #67-89', 'Medellín', 'USUARIO', 'user123', NOW(), NOW()),
('user5', 'Pedro López', '1004567890', 'pedro.lopez@email.com', '3103456789', 'Contador', '3500000', 'Calle 50 #23-45', 'Cali', 'USUARIO', 'user123', NOW(), NOW()),
('user6', 'Laura Ramírez', '1005678901', 'laura.ramirez@email.com', '3104567890', 'Analista de Datos', '3800000', 'Carrera 20 #45-67', 'Barranquilla', 'USUARIO', 'user123', NOW(), NOW()),
('user7', 'Diego Torres', '1006789012', 'diego.torres@email.com', '3105678901', 'Ingeniero DevOps', '5000000', 'Calle 80 #10-20', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user8', 'Sofía Hernández', '1007890123', 'sofia.hernandez@email.com', '3106789012', 'Product Manager', '5500000', 'Carrera 9 #70-80', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user9', 'Andrés Castro', '1008901234', 'andres.castro@email.com', '3107890123', 'Arquitecto de Software', '6000000', 'Calle 90 #15-25', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user10', 'Valentina Morales', '1009012345', 'valentina.morales@email.com', '3108901234', 'QA Engineer', '3500000', 'Carrera 11 #85-90', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),

-- Visualizadores
('user11', 'Roberto Silva', '1010123456', 'roberto.silva@pronube.com', '3109012345', 'Auditor', '4500000', 'Calle 72 #8-10', 'Bogotá', 'VISUALIZADOR', 'view123', NOW(), NOW()),
('user12', 'Carolina Ruiz', '1011234567', 'carolina.ruiz@pronube.com', '3100123456', 'Analista Legal', '4200000', 'Carrera 13 #55-60', 'Bogotá', 'VISUALIZADOR', 'view123', NOW(), NOW()),

-- Más usuarios
('user13', 'Miguel Ángel Gómez', '1012345678', 'miguel.gomez@email.com', '3111234567', 'Desarrollador Frontend', '4000000', 'Calle 60 #18-22', 'Medellín', 'USUARIO', 'user123', NOW(), NOW()),
('user14', 'Daniela Vargas', '1013456789', 'daniela.vargas@email.com', '3112345678', 'Desarrollador Backend', '4200000', 'Carrera 25 #40-50', 'Cali', 'USUARIO', 'user123', NOW(), NOW()),
('user15', 'Felipe Mendoza', '1014567890', 'felipe.mendoza@email.com', '3113456789', 'Scrum Master', '4800000', 'Calle 100 #20-30', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user16', 'Isabella Rojas', '1015678901', 'isabella.rojas@email.com', '3114567890', 'Marketing Digital', '3600000', 'Carrera 30 #65-70', 'Barranquilla', 'USUARIO', 'user123', NOW(), NOW()),
('user17', 'Sebastián Ortiz', '1016789012', 'sebastian.ortiz@email.com', '3115678901', 'Vendedor Senior', '3200000', 'Calle 40 #12-18', 'Cartagena', 'USUARIO', 'user123', NOW(), NOW()),
('user18', 'Camila Jiménez', '1017890123', 'camila.jimenez@email.com', '3116789012', 'Diseñadora Gráfica', '3400000', 'Carrera 5 #28-35', 'Pereira', 'USUARIO', 'user123', NOW(), NOW()),
('user19', 'Mateo Sánchez', '1018901234', 'mateo.sanchez@email.com', '3117890123', 'Analista de Negocios', '4100000', 'Calle 85 #22-28', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user20', 'Lucía Díaz', '1019012345', 'lucia.diaz@email.com', '3118901234', 'HR Specialist', '3700000', 'Carrera 14 #48-52', 'Medellín', 'USUARIO', 'user123', NOW(), NOW()),

('user21', 'Nicolás Parra', '1020123456', 'nicolas.parra@email.com', '3119012345', 'Support Engineer', '3300000', 'Calle 55 #9-15', 'Cali', 'USUARIO', 'user123', NOW(), NOW()),
('user22', 'Gabriela Cruz', '1021234567', 'gabriela.cruz@email.com', '3120123456', 'Content Writer', '3000000', 'Carrera 18 #72-78', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user23', 'Samuel Reyes', '1022345678', 'samuel.reyes@email.com', '3121234567', 'DevOps Engineer', '4900000', 'Calle 70 #16-20', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user24', 'Juliana Mejía', '1023456789', 'juliana.mejia@email.com', '3122345678', 'UX Researcher', '4300000', 'Carrera 22 #58-62', 'Medellín', 'USUARIO', 'user123', NOW(), NOW()),
('user25', 'Tomás Vega', '1024567890', 'tomas.vega@email.com', '3123456789', 'Business Analyst', '4000000', 'Calle 45 #25-30', 'Cali', 'USUARIO', 'user123', NOW(), NOW()),
('user26', 'Mariana Guzmán', '1025678901', 'mariana.guzman@email.com', '3124567890', 'Project Manager', '5200000', 'Carrera 8 #90-95', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user27', 'David Herrera', '1026789012', 'david.herrera@email.com', '3125678901', 'Security Engineer', '5800000', 'Calle 95 #12-16', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW()),
('user28', 'Emma Castillo', '1027890123', 'emma.castillo@email.com', '3126789012', 'Data Scientist', '5500000', 'Carrera 10 #78-82', 'Medellín', 'USUARIO', 'user123', NOW(), NOW()),
('user29', 'Lucas Flores', '1028901234', 'lucas.flores@email.com', '3127890123', 'Mobile Developer', '4700000', 'Calle 65 #20-25', 'Cali', 'USUARIO', 'user123', NOW(), NOW()),
('user30', 'Victoria Molina', '1029012345', 'victoria.molina@email.com', '3128901234', 'Legal Advisor', '4400000', 'Carrera 12 #52-56', 'Bogotá', 'USUARIO', 'user123', NOW(), NOW());

-- Insertar Plantillas de Contratos (10 plantillas)
INSERT INTO "contract_templates" (id, nombre, tipo, contenido, campos, "createdAt", "updatedAt") VALUES
('template1', 'Contrato Laboral Indefinido', 'Laboral', 
'CONTRATO DE TRABAJO A TÉRMINO INDEFINIDO

Entre {EMPRESA} y {EMPLEADO}, identificado con cédula {CEDULA}, se celebra el presente contrato de trabajo.

PRIMERA: OBJETO. El trabajador se obliga a prestar sus servicios como {CARGO} en {CIUDAD}.
SEGUNDA: REMUNERACIÓN. El empleador pagará al trabajador un salario mensual de ${SALARIO}.
TERCERA: JORNADA. La jornada de trabajo será de 48 horas semanales.
CUARTA: DURACIÓN. Este contrato es a término indefinido.

Firmado en {CIUDAD} el {FECHA}.', 
'["EMPRESA", "EMPLEADO", "CEDULA", "CARGO", "CIUDAD", "SALARIO", "FECHA"]'::json, 
NOW(), NOW()),

('template2', 'Contrato Laboral Término Fijo', 'Laboral',
'CONTRATO DE TRABAJO A TÉRMINO FIJO

Entre {EMPRESA} representada por {REPRESENTANTE} y {EMPLEADO}, se establece:

PRIMERA: El trabajador prestará servicios como {CARGO} por un período de {DURACION} meses.
SEGUNDA: Salario mensual: ${SALARIO}
TERCERA: Inicio: {FECHA_INICIO}, Fin: {FECHA_FIN}

Firmado en {CIUDAD}.', 
'["EMPRESA", "REPRESENTANTE", "EMPLEADO", "CARGO", "DURACION", "SALARIO", "FECHA_INICIO", "FECHA_FIN", "CIUDAD"]'::json,
NOW(), NOW()),

('template3', 'Contrato de Arrendamiento Vivienda', 'Arrendamiento',
'CONTRATO DE ARRENDAMIENTO DE VIVIENDA

ARRENDADOR: {ARRENDADOR}, CC {CEDULA_ARRENDADOR}
ARRENDATARIO: {ARRENDATARIO}, CC {CEDULA_ARRENDATARIO}

PRIMERA: Se arrienda el inmueble ubicado en {DIRECCION}, {CIUDAD}
SEGUNDA: Canon mensual: ${CANON}
TERCERA: Duración: {DURACION} meses
CUARTA: Servicios incluidos: {SERVICIOS}

Fecha: {FECHA}', 
'["ARRENDADOR", "CEDULA_ARRENDADOR", "ARRENDATARIO", "CEDULA_ARRENDATARIO", "DIRECCION", "CIUDAD", "CANON", "DURACION", "SERVICIOS", "FECHA"]'::json,
NOW(), NOW()),

('template4', 'Contrato de Prestación de Servicios', 'Servicios',
'CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

CONTRATANTE: {CONTRATANTE}
CONTRATISTA: {CONTRATISTA}, identificado con CC {CEDULA}

OBJETO: Prestar servicios de {SERVICIOS} por un valor de ${VALOR}
PLAZO: {PLAZO} meses iniciando el {FECHA_INICIO}
FORMA DE PAGO: {FORMA_PAGO}

Firmado en {CIUDAD} el {FECHA}.', 
'["CONTRATANTE", "CONTRATISTA", "CEDULA", "SERVICIOS", "VALOR", "PLAZO", "FECHA_INICIO", "FORMA_PAGO", "CIUDAD", "FECHA"]'::json,
NOW(), NOW()),

('template5', 'Contrato de Compraventa', 'Compraventa',
'CONTRATO DE COMPRAVENTA

VENDEDOR: {VENDEDOR}, CC {CEDULA_VENDEDOR}
COMPRADOR: {COMPRADOR}, CC {CEDULA_COMPRADOR}

Se vende: {DESCRIPCION_BIEN}
Precio: ${PRECIO}
Forma de pago: {FORMA_PAGO}
Lugar de entrega: {LUGAR_ENTREGA}

Fecha: {FECHA}, Ciudad: {CIUDAD}', 
'["VENDEDOR", "CEDULA_VENDEDOR", "COMPRADOR", "CEDULA_COMPRADOR", "DESCRIPCION_BIEN", "PRECIO", "FORMA_PAGO", "LUGAR_ENTREGA", "FECHA", "CIUDAD"]'::json,
NOW(), NOW()),

('template6', 'Acuerdo de Confidencialidad (NDA)', 'Confidencialidad',
'ACUERDO DE CONFIDENCIALIDAD

Entre {EMPRESA} y {PARTE_RECEPTORA}, se acuerda:

PRIMERA: Proteger información confidencial sobre {TEMA}
SEGUNDA: Vigencia: {VIGENCIA} años desde {FECHA}
TERCERA: Jurisdicción: {CIUDAD}

Las partes se comprometen a no divulgar información confidencial.', 
'["EMPRESA", "PARTE_RECEPTORA", "TEMA", "VIGENCIA", "FECHA", "CIUDAD"]'::json,
NOW(), NOW()),

('template7', 'Contrato de Arrendamiento Comercial', 'Arrendamiento',
'CONTRATO DE ARRENDAMIENTO LOCAL COMERCIAL

ARRENDADOR: {ARRENDADOR}
ARRENDATARIO: {ARRENDATARIO} para la actividad de {ACTIVIDAD}

Inmueble: {DIRECCION}, {CIUDAD}
Canon: ${CANON} + IVA
Plazo: {PLAZO} años
Incremento anual: {INCREMENTO}%

Fecha: {FECHA}', 
'["ARRENDADOR", "ARRENDATARIO", "ACTIVIDAD", "DIRECCION", "CIUDAD", "CANON", "PLAZO", "INCREMENTO", "FECHA"]'::json,
NOW(), NOW()),

('template8', 'Contrato de Trabajo por Obra', 'Laboral',
'CONTRATO DE TRABAJO POR OBRA O LABOR

Entre {EMPRESA} y {TRABAJADOR}:

Obra: {DESCRIPCION_OBRA}
Cargo: {CARGO}
Salario: ${SALARIO}
Lugar: {CIUDAD}
Duración estimada: {DURACION_ESTIMADA}

El contrato termina al culminar la obra.

Fecha: {FECHA}', 
'["EMPRESA", "TRABAJADOR", "DESCRIPCION_OBRA", "CARGO", "SALARIO", "CIUDAD", "DURACION_ESTIMADA", "FECHA"]'::json,
NOW(), NOW()),

('template9', 'Contrato de Suministro', 'Comercial',
'CONTRATO DE SUMINISTRO

PROVEEDOR: {PROVEEDOR}
CLIENTE: {CLIENTE}

Productos: {PRODUCTOS}
Cantidad: {CANTIDAD}
Precio unitario: ${PRECIO_UNITARIO}
Total: ${TOTAL}
Plazo de entrega: {PLAZO_ENTREGA}
Lugar: {CIUDAD}

Fecha: {FECHA}', 
'["PROVEEDOR", "CLIENTE", "PRODUCTOS", "CANTIDAD", "PRECIO_UNITARIO", "TOTAL", "PLAZO_ENTREGA", "CIUDAD", "FECHA"]'::json,
NOW(), NOW()),

('template10', 'Contrato de Sociedad', 'Societario',
'CONTRATO DE SOCIEDAD

Entre {SOCIO1} y {SOCIO2} crean {NOMBRE_SOCIEDAD}

Capital social: ${CAPITAL}
Participación {SOCIO1}: {PARTICIPACION1}%
Participación {SOCIO2}: {PARTICIPACION2}%
Objeto social: {OBJETO_SOCIAL}
Domicilio: {CIUDAD}

Fecha: {FECHA}', 
'["SOCIO1", "SOCIO2", "NOMBRE_SOCIEDAD", "CAPITAL", "PARTICIPACION1", "PARTICIPACION2", "OBJETO_SOCIAL", "CIUDAD", "FECHA"]'::json,
NOW(), NOW()),

('template11', 'Contrato Técnico Docente UEA', 'Académico',
'CONTRATO DE SERVICIOS OCASIONALES - PERSONAL DE APOYO ACADÉMICO NO TITULAR OCASIONAL
No. {NUMERO_CONTRATO}

CLÁUSULA PRIMERA: COMPARECIENTES. En la ciudad del {CIUDAD}, a los {DIA} días del mes de {MES} de {ANIO}, comparecen a la celebración del presente Contrato de Servicios Ocasionales, por una parte, {NOMBRE_INSTITUCION} con RUC: {RUC_INSTITUCION}, debidamente representada por el señor {REPRESENTANTE_LEGAL}, {CARGO_REPRESENTANTE}, persona No. {CEDULA_REPRESENTANTE}, según acción de personal en adelante se le denominará como "{NOMBRE_CORTO_INSTITUCION}"; y, por otra parte, el Ing. {NOMBRE_CONTRATADO}, portador/a de la cédula de ciudadanía No. {CEDULA_CONTRATADO}, por sus propios derechos, a quien en adelante se le denominará para los efectos derivados de este contrato como el/la "{NOMBRE_CORTO_CONTRATADO}", quienes voluntariamente comparecen a la celebración del presente instrumento, al tenor de las siguientes cláusulas:

CLÁUSULA SEGUNDA: ANTECEDENTES

{ANTECEDENTES}

CLÁUSULA TERCERA: OBJETO DEL CONTRATO

Con los antecedentes expuestos, {NOMBRE_INSTITUCION}, procede a la contratación del Ing. {NOMBRE_CONTRATADO} como PERSONAL DE APOYO ACADÉMICO – TÉCNICO DOCENTE, con dedicación {DEDICACION}, para que asuma y cumpla las actividades de docencia señaladas al artículo {ARTICULO_REGLAMENTO} del Reglamento de Carrera y Escalafón del Personal Académico del Sistema de Educación Superior, y las demás actividades que defina {NOMBRE_INSTITUCION}, en ejercicio de su autonomía responsable, en el marco del desarrollo de la oferta académica institucional.

Además, el contratado deberá presentar en la Dirección de Investigación, Posgrados, Vinculación y Transferencia Tecnológica, (01) un artículo científico publicado o la carta de aceptación para su publicación del mismo, en una base de datos indexada, esta publicación podrá desarrollarse de forma individual o en un grupo de máximo cuatro docentes admitidos del Período Académico Ordinario 2025 – 2026. Las fechas límite deberán suscribirse a las líneas de investigación de {NOMBRE_INSTITUCION}. Al finalizar el PAO, la Dirección de Investigación, Posgrados, Vinculación y Transferencia Tecnológica enviará un reporte con el cumplimiento de la presente Disposición.

CLÁUSULA CUARTA: REMUNERACIÓN Y FORMA DE PAGO

{NOMBRE_INSTITUCION} pagará al CONTRATADO/A, la cantidad de {REMUNERACION}, por el cabal cumplimiento del objeto del presente contrato. {NOMBRE_INSTITUCION} cancelará el valor correspondiente al final de cada mes.

El/la CONTRATADO/A, tendrá relación de dependencia y derecho a todos los beneficios económicos contemplados para el personal de nombramiento, con excepción de las indemnizaciones por supresión de puesto o partida o incentivo para jubilación, no ingresará a la Carrera del Servicio público mientras dure el plazo del contrato; pero por tratarse de un contrato ocasional, por su naturaleza, de ninguna manera representa establecida laboral en la institución, ni derechos adquiridos para la emisión de un nombramiento permanente, pudiendo darse por terminado en cualquier momento.

CLÁUSULA QUINTA: DURACIÓN

Se fija la duración del presente contrato desde el {FECHA_INICIO} hasta el {FECHA_FIN}. En tal virtud y transcurrido el tiempo estipulado anteriormente, el presente contrato se dará por terminado automáticamente sin que para el efecto se requiera notificación o trámite alguno.

CLÁUSULA SEXTA: TERMINACIÓN DEL CONTRATO

Acorde a lo determinado en el artículo 146 del Reglamento General a la Ley Orgánica del Servicio Público, el contrato podrá darse por terminado por las siguientes causales:

a) Cumplimiento del plazo;
b) Mutuo acuerdo de las partes;
c) Renuncia voluntaria presentada;
d) Incapacidad absoluta y permanente de la o el contratado para prestar servicios;
e) Pérdida de los derechos de ciudadanía declarada judicialmente en providencia ejecutoriada;
f) Por terminación unilateral del contrato por parte de la autoridad nominadora, sin que fuere necesario otro requisito previo;
g) Por obtener una calificación regular o insuficiente establecida mediante el proceso de la evaluación del desempeño;
h) Destitución; e,
i) Muerte.

CLÁUSULA SÉPTIMA: LUGAR Y HORARIO DE TRABAJO

El contratado prestará sus servicios en {LUGAR_TRABAJO} o en cualquier sede de {NOMBRE_INSTITUCION} en virtud de los requerimientos institucionales para lo cual se le dará la disposición que para el efecto emita la autoridad nominadora la misma que no alterará ni contendrá el presente contrato, el contratado previa autorización, Por Rector del Delegado, deberá trasladarse a los diversos lugares de la Región Amazónica Ecuatoriana o a otros sectores del país, para lo cual se le brindará la facilidades del caso y se le reconocerá los valores equivalentes determinados en la Ley, referente a los viáticos, movilizaciones, subsistencias y alimentación para el cumplimiento de licencias de servicios institucional.

El/La CONTRATADO/A se obliga a laborar por jornada ordinaria de trabajo, las máximas horas diarias y semanales, de conformidad con su dedicación académica a Tiempo Completo, dentro de los horarios establecidos por la autoridad nominadora, que serán determinados de acuerdo con las necesidades institucionales, siempre y cuando ello se observe los principios de continuidad, equidad y optimización del servicio, esto en razón de lo establecido en el Art. 5 del Reglamento de Escalafón del Personal de Educación Superior, que en su parte pertinente dice: "(…)Las normas sobre las jornadas de trabajo establecidas en la Ley Orgánica de Servicio Público y el Código de Trabajo no serán aplicables para el desarrollo de las actividades del personal académico y personal de apoyo académico de las universidades y escuelas politécnicas públicas".

CLÁUSULA OCTAVA: PARTIDA PRESUPUESTARIA

La entidad pagará al contratado por la prestación de sus servicios, la remuneración convenida con cargo a la partida No. {PARTIDA_PRESUPUESTARIA} de Servicios Personales por Contrato de Trabajo. {DETALLE_PARTIDAS}

CLÁUSULA NOVENA: OBLIGACIONES LEGALES CONEXAS

En todo lo que no estuviere previsto en el presente contrato, las partes declaran incorporadas las disposiciones de la Ley Orgánica de Educación Superior, su Reglamento General, el Reglamento de Carrera y Escalafón del Persona Académico del Sistema de Educación Superior, la Ley Orgánica del Servicio Público, su Reglamento General, y las demás normas vigentes para el efecto.

CLÁUSULA DÉCIMA: CONFIDENCIALIDAD

El/la CONTRATADO/A acepta, que toda información que llegue a su conocimiento, en razón de la ejecución del presente contrato, debe ser tratada con absoluta reserva, especialmente aquella considerada como estratégica o no divulgable por {NOMBRE_INSTITUCION}, a través de sus autoridades. Por lo tanto, está prohibida su utilización y distribución en beneficio propio o de terceros, sin la autorización expresa por parte de la autoridad competente. El incumplimiento de esta obligación será causal para dar por terminado el presente contrato de servicios ocasionales, previo al derecho a la defensa conforme a la ley, sin perjuicio de las acciones civiles o penales que le asiste a {NOMBRE_INSTITUCION}.

El/la CONTRATADO/A queda expresamente prohibido de reproducir o publicar la información que llegue a su conocimiento en razón de la ejecución del contrato, sin previa autorización de su inmediato superior o de la autoridad competente.

CLÁUSULA DÉCIMA PRIMERA: DERECHOS DE AUTOR

Las partes conforme lo faculta la Ley de Propiedad Intelectual vigente, de común acuerdo estatuir que los descubrimientos e invenciones, las mejoras en los procedimientos, así como, los trabajos y resultados de las actividades de investigación que desarrolle el/la profesional contratado/a para "{NOMBRE_INSTITUCION}", quedarán en beneficio exclusivo de la {NOMBRE_INSTITUCION}, quien podrá patentar o registrar a su nombre tales trabajos, inventos, descubrimientos o mejoras; sin perjuicio de lo cual, reconocerá el nombre del profesional como autor, descubridor o inventor de los mismos; así como el derecho señalado en el artículo 118 de la Ley Orgánica de Educación Superior.

CLÁUSULA DÉCIMA SEGUNDA: DOCUMENTOS HABILITANTES

Forman parte integrante del presente contrato los siguientes documentos: {DOCUMENTOS_HABILITANTES}

CLÁUSULA DÉCIMA TERCERA: CONTROVERSIAS

En el caso de controversias, las partes se someterán a su resolución de mutuo acuerdo o a través del Sistema de Mediación y Arbitraje en caso de acta fallida o parcial, las partes renuncian fuero y domicilio y se someten a los jueces competentes de esta ciudad de {CIUDAD_JURISDICCION}, en la parte no adecuada en la mediación.

CLÁUSULA DÉCIMA CUARTA: ACEPTACIÓN

Las partes por encontrarse de acuerdo en todas y cada una de las cláusulas antes descritas, manifiestan que aceptan íntegramente su contenido.

Para constancia y fe del acuerdo de las partes, y en uso de sus facultades las mismas aceptan y firman este contrato en tres ejemplares del mismo tenor y valor.


{REPRESENTANTE_LEGAL}
{CARGO_REPRESENTANTE}

{NOMBRE_CONTRATADO}
C.c. {CEDULA_CONTRATADO}
CONTRATADO/A', 
'["NUMERO_CONTRATO", "CIUDAD", "DIA", "MES", "ANIO", "NOMBRE_INSTITUCION", "RUC_INSTITUCION", "REPRESENTANTE_LEGAL", "CARGO_REPRESENTANTE", "CEDULA_REPRESENTANTE", "NOMBRE_CORTO_INSTITUCION", "NOMBRE_CONTRATADO", "CEDULA_CONTRATADO", "NOMBRE_CORTO_CONTRATADO", "ANTECEDENTES", "DEDICACION", "ARTICULO_REGLAMENTO", "REMUNERACION", "FECHA_INICIO", "FECHA_FIN", "LUGAR_TRABAJO", "PARTIDA_PRESUPUESTARIA", "DETALLE_PARTIDAS", "DOCUMENTOS_HABILITANTES", "CIUDAD_JURISDICCION"]'::json,
NOW(), NOW());

-- Insertar Contratos (60 contratos con diferentes estados y fechas)
INSERT INTO "contratos" (id, "userId", "templateId", contenido, estado, fecha, "createdAt") VALUES
-- Contratos de Enero 2026
('contract1', 'user3', 'template1', 'Contrato laboral para Juan Pérez como Desarrollador Senior...', 'firmado', '2026-01-05', '2026-01-05'),
('contract2', 'user4', 'template1', 'Contrato laboral para Ana Martínez como Diseñadora UX...', 'firmado', '2026-01-08', '2026-01-08'),
('contract3', 'user5', 'template2', 'Contrato temporal para Pedro López...', 'generado', '2026-01-10', '2026-01-10'),
('contract4', 'user6', 'template1', 'Contrato laboral para Laura Ramírez...', 'firmado', '2026-01-12', '2026-01-12'),
('contract5', 'user7', 'template4', 'Prestación de servicios DevOps...', 'firmado', '2026-01-15', '2026-01-15'),
('contract6', 'user8', 'template1', 'Contrato Product Manager...', 'firmado', '2026-01-18', '2026-01-18'),
('contract7', 'user9', 'template1', 'Contrato Arquitecto de Software...', 'firmado', '2026-01-20', '2026-01-20'),
('contract8', 'user10', 'template2', 'Contrato QA temporal...', 'generado', '2026-01-22', '2026-01-22'),
('contract9', 'user13', 'template1', 'Contrato Frontend Developer...', 'firmado', '2026-01-25', '2026-01-25'),
('contract10', 'user14', 'template1', 'Contrato Backend Developer...', 'firmado', '2026-01-28', '2026-01-28'),

-- Contratos de Diciembre 2025
('contract11', 'user15', 'template1', 'Contrato Scrum Master...', 'firmado', '2025-12-02', '2025-12-02'),
('contract12', 'user16', 'template4', 'Servicios de Marketing...', 'firmado', '2025-12-05', '2025-12-05'),
('contract13', 'user17', 'template2', 'Vendedor temporal...', 'anulado', '2025-12-10', '2025-12-10'),
('contract14', 'user18', 'template4', 'Diseño gráfico...', 'firmado', '2025-12-15', '2025-12-15'),
('contract15', 'user19', 'template1', 'Analista de Negocios...', 'firmado', '2025-12-18', '2025-12-18'),
('contract16', 'user20', 'template1', 'HR Specialist...', 'firmado', '2025-12-20', '2025-12-20'),
('contract17', 'user21', 'template2', 'Support temporal...', 'generado', '2025-12-22', '2025-12-22'),
('contract18', 'user22', 'template4', 'Content Writer servicios...', 'firmado', '2025-12-25', '2025-12-25'),

-- Contratos de Noviembre 2025
('contract19', 'user23', 'template1', 'DevOps Engineer...', 'firmado', '2025-11-03', '2025-11-03'),
('contract20', 'user24', 'template1', 'UX Researcher...', 'firmado', '2025-11-08', '2025-11-08'),
('contract21', 'user25', 'template4', 'Business Analyst servicios...', 'firmado', '2025-11-12', '2025-11-12'),
('contract22', 'user26', 'template1', 'Project Manager...', 'firmado', '2025-11-15', '2025-11-15'),
('contract23', 'user27', 'template1', 'Security Engineer...', 'firmado', '2025-11-20', '2025-11-20'),
('contract24', 'user28', 'template1', 'Data Scientist...', 'firmado', '2025-11-25', '2025-11-25'),

-- Contratos de Octubre 2025
('contract25', 'user29', 'template1', 'Mobile Developer...', 'firmado', '2025-10-05', '2025-10-05'),
('contract26', 'user30', 'template4', 'Legal Advisor servicios...', 'firmado', '2025-10-10', '2025-10-10'),
('contract27', 'user3', 'template3', 'Arrendamiento vivienda Juan...', 'firmado', '2025-10-15', '2025-10-15'),
('contract28', 'user4', 'template3', 'Arrendamiento vivienda Ana...', 'generado', '2025-10-20', '2025-10-20'),
('contract29', 'user5', 'template5', 'Compraventa equipo...', 'firmado', '2025-10-25', '2025-10-25'),

-- Contratos de Septiembre 2025
('contract30', 'user6', 'template6', 'NDA proyecto confidencial...', 'firmado', '2025-09-02', '2025-09-02'),
('contract31', 'user7', 'template7', 'Arrendamiento local comercial...', 'firmado', '2025-09-08', '2025-09-08'),
('contract32', 'user8', 'template4', 'Consultoría PM...', 'firmado', '2025-09-15', '2025-09-15'),
('contract33', 'user9', 'template6', 'NDA arquitectura...', 'firmado', '2025-09-20', '2025-09-20'),
('contract34', 'user10', 'template8', 'Contrato por obra QA...', 'anulado', '2025-09-25', '2025-09-25'),

-- Contratos de Agosto 2025
('contract35', 'user13', 'template9', 'Suministro equipos...', 'firmado', '2025-08-05', '2025-08-05'),
('contract36', 'user14', 'template5', 'Compraventa software...', 'firmado', '2025-08-10', '2025-08-10'),
('contract37', 'user15', 'template10', 'Sociedad tech startup...', 'firmado', '2025-08-15', '2025-08-15'),
('contract38', 'user16', 'template4', 'Servicios marketing digital...', 'generado', '2025-08-20', '2025-08-20'),
('contract39', 'user17', 'template5', 'Venta productos...', 'firmado', '2025-08-25', '2025-08-25'),

-- Más contratos recientes (Febrero 2026)
('contract40', 'user18', 'template3', 'Arrendamiento oficina...', 'generado', '2026-02-01', '2026-02-01'),
('contract41', 'user19', 'template4', 'Análisis de negocios...', 'generado', '2026-02-02', '2026-02-02'),
('contract42', 'user20', 'template2', 'Contrato temporal RRHH...', 'generado', '2026-02-03', '2026-02-03'),
('contract43', 'user21', 'template4', 'Soporte técnico...', 'generado', '2026-02-04', '2026-02-04'),

-- Contratos adicionales variados
('contract44', 'user3', 'template6', 'NDA proyecto nuevo...', 'firmado', '2026-01-30', '2026-01-30'),
('contract45', 'user4', 'template5', 'Compra equipo diseño...', 'firmado', '2025-12-28', '2025-12-28'),
('contract46', 'user5', 'template7', 'Local contabilidad...', 'firmado', '2025-11-30', '2025-11-30'),
('contract47', 'user6', 'template8', 'Proyecto análisis...', 'firmado', '2025-10-30', '2025-10-30'),
('contract48', 'user7', 'template9', 'Suministro servers...', 'firmado', '2025-09-30', '2025-09-30'),
('contract49', 'user8', 'template4', 'Consultoría producto...', 'generado', '2026-01-31', '2026-01-31'),
('contract50', 'user9', 'template1', 'Renovación contrato...', 'firmado', '2025-12-30', '2025-12-30'),

-- Últimos 10 contratos
('contract51', 'user10', 'template3', 'Arrendamiento casa...', 'firmado', '2025-11-28', '2025-11-28'),
('contract52', 'user13', 'template6', 'NDA frontend...', 'firmado', '2025-10-28', '2025-10-28'),
('contract53', 'user14', 'template4', 'Backend freelance...', 'generado', '2026-01-29', '2026-01-29'),
('contract54', 'user15', 'template5', 'Venta licencias...', 'firmado', '2025-12-27', '2025-12-27'),
('contract55', 'user16', 'template2', 'Campaña temporal...', 'anulado', '2025-11-27', '2025-11-27'),
('contract56', 'user17', 'template7', 'Local comercial ventas...', 'firmado', '2025-10-27', '2025-10-27'),
('contract57', 'user18', 'template8', 'Diseño por proyecto...', 'firmado', '2025-09-28', '2025-09-28'),
('contract58', 'user19', 'template9', 'Suministro materiales...', 'firmado', '2025-08-28', '2025-08-28'),
('contract59', 'user20', 'template4', 'Consultoría RRHH...', 'generado', '2026-02-01', '2026-02-01'),
('contract60', 'user21', 'template1', 'Soporte definitivo...', 'firmado', '2026-01-27', '2026-01-27');

-- Verificar datos insertados
SELECT 'Usuarios insertados:' as tipo, COUNT(*) as cantidad FROM users
UNION ALL
SELECT 'Plantillas insertadas:', COUNT(*) FROM contract_templates
UNION ALL
SELECT 'Contratos insertados:', COUNT(*) FROM contratos;

-- Estadísticas por estado
SELECT estado, COUNT(*) as cantidad 
FROM contratos 
GROUP BY estado 
ORDER BY cantidad DESC;

-- Contratos por mes
SELECT 
    TO_CHAR(fecha, 'YYYY-MM') as mes, 
    COUNT(*) as cantidad 
FROM contratos 
GROUP BY TO_CHAR(fecha, 'YYYY-MM')
ORDER BY mes DESC;
