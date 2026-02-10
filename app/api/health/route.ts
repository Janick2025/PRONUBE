import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Endpoint de verificación de conexión y estado de la base de datos
export async function GET() {
  try {
    // Verificar conexión
    await prisma.$queryRaw`SELECT 1`;

    // Contar usuarios
    const usuariosCount = await prisma.$queryRawUnsafe<any[]>(`
      SELECT COUNT(*) as count FROM usuarios
    `);

    // Contar plantillas
    const templatesCount = await prisma.$queryRawUnsafe<any[]>(`
      SELECT COUNT(*) as count FROM contract_templates
    `);

    // Contar contratos
    const contratosCount = await prisma.$queryRawUnsafe<any[]>(`
      SELECT COUNT(*) as count FROM contratos
    `);

    // Listar primeros 5 usuarios
    const sampleUsers = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        usua_codi as id,
        usua_nomb as nombre,
        usua_apellido as apellido,
        usua_cedula as cedula,
        usua_email as email
      FROM usuarios
      WHERE usua_esta = 1
      ORDER BY usua_nomb ASC
      LIMIT 5
    `);

    // Listar plantillas disponibles
    const sampleTemplates = await prisma.$queryRawUnsafe<any[]>(`
      SELECT id, nombre, tipo FROM contract_templates ORDER BY nombre LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      message: 'Conexión exitosa a la base de datos',
      statistics: {
        usuarios: usuariosCount[0]?.count || 0,
        plantillas: templatesCount[0]?.count || 0,
        contratos: contratosCount[0]?.count || 0
      },
      sampleData: {
        usuarios: sampleUsers.map(u => ({
          id: u.id,
          nombre: `${u.nombre} ${u.apellido || ''}`.trim(),
          cedula: u.cedula,
          email: u.email || ''
        })),
        plantillas: sampleTemplates
      },
      endpoints: {
        buscarPorCedula: '/api/users/by-cedula?cedula=XXXXXXXXXX',
        listarUsuarios: '/api/users?search=nombre&limit=50',
        buscarUsuarios: '/api/users/search?q=nombre',
        buscarAvanzada: 'POST /api/users/search {cedula, nombre, email}',
        listarPlantillas: '/api/templates',
        generarPDF: 'POST /api/generate-pdf {templateId, fields}'
      }
    });

  } catch (error) {
    console.error('Error en verificación de DB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al conectar con la base de datos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
