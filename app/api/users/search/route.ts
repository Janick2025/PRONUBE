import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Endpoint para buscar usuarios en Quipux con múltiples criterios
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cedula, nombre, email, limit = 20 } = body;

    if (!cedula && !nombre && !email) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un criterio de búsqueda' },
        { status: 400 }
      );
    }

    let conditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (cedula) {
      conditions.push(`usua_cedula LIKE $${paramIndex}`);
      params.push(`%${cedula}%`);
      paramIndex++;
    }

    if (nombre) {
      conditions.push(`(usua_nomb ILIKE $${paramIndex} OR usua_apellido ILIKE $${paramIndex + 1})`);
      params.push(`%${nombre}%`, `%${nombre}%`);
      paramIndex += 2;
    }

    if (email) {
      conditions.push(`usua_email ILIKE $${paramIndex}`);
      params.push(`%${email}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        usua_codi as id,
        usua_nomb as nombre,
        usua_apellido as apellido,
        usua_cedula as cedula,
        usua_email as email,
        usua_cargo as cargo,
        usua_telefono as telefono,
        usua_direccion as direccion,
        inst_nombre as institucion,
        usua_esta as estado
      FROM usuarios
      ${whereClause}
      ORDER BY usua_nomb ASC
      LIMIT ${limit}
    `;

    const usuarios = await prisma.$queryRawUnsafe<any[]>(query, ...params);

    const formattedUsers = usuarios.map((user: any) => ({
      id: user.id,
      nombre: `${user.nombre} ${user.apellido || ''}`.trim(),
      nombreCompleto: `${user.nombre} ${user.apellido || ''}`.trim(),
      nombreSolo: user.nombre,
      apellido: user.apellido || '',
      cedula: user.cedula,
      email: user.email || '',
      cargo: user.cargo || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      institucion: user.institucion || '',
      ciudad: '',
      salario: '',
      estado: user.estado || 0
    }));

    return NextResponse.json({
      success: true,
      count: formattedUsers.length,
      usuarios: formattedUsers
    });

  } catch (error) {
    console.error('Error buscando usuarios:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al buscar usuarios', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET alternativo para búsqueda simple
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json(
        { error: 'Parámetro de búsqueda "q" es requerido' },
        { status: 400 }
      );
    }

    const sqlQuery = `
      SELECT 
        usua_codi as id,
        usua_nomb as nombre,
        usua_apellido as apellido,
        usua_cedula as cedula,
        usua_email as email,
        usua_cargo as cargo,
        usua_telefono as telefono,
        usua_direccion as direccion,
        inst_nombre as institucion
      FROM usuarios
      WHERE 
        usua_cedula LIKE $1 OR 
        usua_nomb ILIKE $2 OR 
        usua_apellido ILIKE $3 OR 
        usua_email ILIKE $4
      ORDER BY usua_nomb ASC
      LIMIT ${limit}
    `;

    const usuarios = await prisma.$queryRawUnsafe<any[]>(
      sqlQuery, 
      `%${query}%`, 
      `%${query}%`, 
      `%${query}%`, 
      `%${query}%`
    );

    const formattedUsers = usuarios.map((user: any) => ({
      id: user.id,
      nombre: `${user.nombre} ${user.apellido || ''}`.trim(),
      cedula: user.cedula,
      email: user.email || '',
      cargo: user.cargo || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      institucion: user.institucion || ''
    }));

    return NextResponse.json({
      success: true,
      count: formattedUsers.length,
      usuarios: formattedUsers
    });

  } catch (error) {
    console.error('Error buscando usuarios:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al buscar usuarios', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
