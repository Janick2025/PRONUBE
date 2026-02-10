import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '500');

    let whereClause = '';
    let params: any[] = [];

    if (search) {
      whereClause = `WHERE usua_cedula LIKE $1 OR usua_nomb ILIKE $2 OR usua_apellido ILIKE $3 OR usua_email ILIKE $4`;
      params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
    }

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

    const users = await prisma.$queryRawUnsafe<any[]>(query, ...params);

    const formattedUsers = users.map((user: any) => ({
      id: user.id,
      nombre: `${user.nombre} ${user.apellido || ''}`.trim(),
      cedula: user.cedula,
      email: user.email || '',
      cargo: user.cargo || '',
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      institucion: user.institucion || '',
      estado: user.estado || 0
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
