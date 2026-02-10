-- Verificar datos cargados
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_ciudadanos FROM ciudadano;
SELECT COUNT(*) as total_instituciones FROM institucion;
SELECT COUNT(*) as total_dependencias FROM dependencia;
SELECT COUNT(*) as total_plantillas FROM contract_templates;
SELECT COUNT(*) as total_contratos FROM contratos;

-- Muestra de datos
SELECT usua_nomb, usua_apellido, usua_cedula 
FROM usuarios 
WHERE usua_esta = 1 
LIMIT 5;
