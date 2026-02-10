-- Verificar qué tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('users', 'usuarios')
ORDER BY table_name;

-- Contar registros en cada tabla si existen
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE NOTICE 'Tabla users existe';
        PERFORM * FROM users LIMIT 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'usuarios') THEN
        RAISE NOTICE 'Tabla usuarios existe con % registros', (SELECT COUNT(*) FROM usuarios);
    END IF;
END $$;

-- Mostrar primeros 10 usuarios de la tabla usuarios
SELECT usua_codi, usua_nomb, usua_apellido, usua_cedula, usua_cargo 
FROM usuarios 
WHERE usua_esta = 1
ORDER BY usua_nomb 
LIMIT 10;
