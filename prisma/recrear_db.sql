-- Terminar todas las conexiones activas a pronube
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'pronube'
  AND pid <> pg_backend_pid();

-- Recrear base de datos
DROP DATABASE IF EXISTS pronube;
CREATE DATABASE pronube WITH ENCODING 'UTF8';
