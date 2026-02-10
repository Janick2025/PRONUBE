const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Cargando archivo seed.sql...');
    const sqlFile = fs.readFileSync(
      path.join(__dirname, '..', 'prisma', 'seed.sql'),
      'utf8'
    );

    console.log('🗑️  Limpiando tablas...');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "contratos" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "contract_templates" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE;');

    console.log('📝 Ejecutando inserts...');
    
    // Dividir el SQL en statements individuales (simplificado)
    const statements = sqlFile
      .split(';')
      .filter(stmt => stmt.trim().length > 0 && !stmt.trim().startsWith('--'));

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed.startsWith('INSERT') || trimmed.startsWith('SELECT')) {
        try {
          await prisma.$executeRawUnsafe(trimmed + ';');
        } catch (err) {
          if (!trimmed.includes('Verificar') && !trimmed.includes('Estadísticas')) {
            console.error('Error en statement:', err.message);
          }
        }
      }
    }

    console.log('✅ Base de datos poblada exitosamente!');
    
    const userCount = await prisma.users.count();
    const templateCount = await prisma.contract_templates.count();
    const contratoCount = await prisma.contratos.count();
    
    console.log(`\n📊 Resumen:`);
    console.log(`   - Usuarios: ${userCount}`);
    console.log(`   - Plantillas: ${templateCount}`);
    console.log(`   - Contratos: ${contratoCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
