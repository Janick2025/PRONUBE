import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  console.log('🗑️  Limpiando datos existentes...');
  await prisma.contrato.deleteMany();
  await prisma.contractTemplate.deleteMany();
  await prisma.user.deleteMany();

  // Insertar usuarios
  console.log('👥 Insertando usuarios...');
  await prisma.user.createMany({
    data: [
      { id: 'user1', nombre: 'Carlos Rodríguez', cedula: '1001234567', email: 'carlos.rodriguez@pronube.com', telefono: '3001234567', cargo: 'Director General', salario: '8000000', direccion: 'Calle 100 #15-20', ciudad: 'Bogotá', role: 'ADMIN', password: 'admin' },
      { id: 'user2', nombre: 'María González', cedula: '1001234568', email: 'maria.gonzalez@pronube.com', telefono: '3001234568', cargo: 'Gerente RRHH', salario: '6000000', direccion: 'Carrera 7 #32-45', ciudad: 'Bogotá', role: 'ADMIN', password: 'admin123' },
      { id: 'user3', nombre: 'Juan Pérez', cedula: '1002345678', email: 'juan.perez@email.com', telefono: '3101234567', cargo: 'Desarrollador Senior', salario: '4500000', direccion: 'Calle 45 #12-34', ciudad: 'Bogotá', role: 'USUARIO', password: 'user123' },
      { id: 'user4', nombre: 'Ana Martínez', cedula: '1003456789', email: 'ana.martinez@email.com', telefono: '3102345678', cargo: 'Diseñadora UX', salario: '4000000', direccion: 'Carrera 15 #67-89', ciudad: 'Medellín', role: 'USUARIO', password: 'user123' },
      { id: 'user5', nombre: 'Pedro López', cedula: '1004567890', email: 'pedro.lopez@email.com', telefono: '3103456789', cargo: 'Contador', salario: '3500000', direccion: 'Calle 50 #23-45', ciudad: 'Cali', role: 'USUARIO', password: 'user123' },
    ]
  });

  // Insertar plantilla template11 (Contrato UEA)
  console.log('📝 Insertando plantillas...');
  await prisma.contractTemplate.create({
    data: {
      id: 'template11',
      nombre: 'Contrato Técnico Docente UEA',
      tipo: 'Académico',
      contenido: 'CONTRATO DE SERVICIOS OCASIONALES - PERSONAL DE APOYO ACADÉMICO\nNo. {NUMERO_CONTRATO}\n\nCLÁUSULA PRIMERA: COMPARECIENTES. En la ciudad del {CIUDAD}, a los {DIA} días del mes de {MES} de {ANIO}, comparecen {NOMBRE_INSTITUCION} representada por {REPRESENTANTE_LEGAL} y {NOMBRE_CONTRATADO} con cédula {CEDULA_CONTRATADO}.',
      campos: ["NUMERO_CONTRATO", "CIUDAD", "DIA", "MES", "ANIO", "NOMBRE_INSTITUCION", "REPRESENTANTE_LEGAL", "NOMBRE_CONTRATADO", "CEDULA_CONTRATADO"]
    }
  });

  await prisma.contractTemplate.create({
    data: {
      id: 'template1',
      nombre: 'Contrato Laboral Indefinido',
      tipo: 'Laboral',
      contenido: 'CONTRATO DE TRABAJO A TÉRMINO INDEFINIDO\n\nEntre {EMPRESA} y {EMPLEADO}, identificado con cédula {CEDULA}, se celebra el presente contrato de trabajo.\n\nPRIMERA: OBJETO. El trabajador se obliga a prestar sus servicios como {CARGO} en {CIUDAD}.\nSEGUNDA: REMUNERACIÓN. El empleador pagará al trabajador un salario mensual de ${SALARIO}.\nTERCERA: JORNADA. La jornada de trabajo será de 48 horas semanales.\nCUARTA: DURACIÓN. Este contrato es a término indefinido.\n\nFirmado en {CIUDAD} el {FECHA}.',
      campos: ["EMPRESA", "EMPLEADO", "CEDULA", "CARGO", "CIUDAD", "SALARIO", "FECHA"]
    }
  });

  await prisma.contractTemplate.create({
    data: {
      id: 'template2',
      nombre: 'Contrato de Prestación de Servicios',
      tipo: 'Servicios',
      contenido: 'CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES\n\nCONTRATANTE: {CONTRATANTE}\nCONTRATISTA: {CONTRATISTA}, identificado con CC {CEDULA}\n\nOBJETO: Prestar servicios de {SERVICIOS} por un valor de ${VALOR}\nPLAZO: {PLAZO} meses iniciando el {FECHA_INICIO}\nFORMA DE PAGO: {FORMA_PAGO}\n\nFirmado en {CIUDAD} el {FECHA}.',
      campos: ["CONTRATANTE", "CONTRATISTA", "CEDULA", "SERVICIOS", "VALOR", "PLAZO", "FECHA_INICIO", "FORMA_PAGO", "CIUDAD", "FECHA"]
    }
  });

  console.log('✅ Seed completado exitosamente!');
  
  const userCount = await prisma.user.count();
  const templateCount = await prisma.contractTemplate.count();
  
  console.log(`\n📊 Resumen:`);
  console.log(`   - Usuarios: ${userCount}`);
  console.log(`   - Plantillas: ${templateCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
