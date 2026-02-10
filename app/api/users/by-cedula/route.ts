import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cedula = searchParams.get('cedula');

    if (!cedula) {
      return NextResponse.json(
        { error: 'Cédula es requerida' },
        { status: 400 }
      );
    }

    // Buscar en la tabla usuarios de Quipux
    const usuario = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        usua_codi as id,
        usua_nomb as nombre,
        usua_cedula as cedula,
        usua_email as email,
        usua_telefono as telefono,
        usua_cargo as cargo,
        usua_direccion as direccion,
        usua_apellido as apellido,
        inst_nombre as institucion
      FROM usuarios
      WHERE usua_cedula = $1
      LIMIT 1
    `, cedula);

    if (usuario && usuario.length > 0) {
      return NextResponse.json({
        id: usuario[0].id,
        nombre: `${usuario[0].nombre} ${usuario[0].apellido || ''}`.trim(),
        cedula: usuario[0].cedula,
        email: usuario[0].email || '',
        telefono: usuario[0].telefono || '',
        cargo: usuario[0].cargo || '',
        direccion: usuario[0].direccion || '',
        ciudad: '',
        salario: '',
        institucion: usuario[0].institucion || ''
      });
    }

    // Si no se encuentra en usuarios, buscar en ciudadano
    const ciudadano = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        ciu_codigo as id,
        ciu_nombre as nombre,
        ciu_cedula as cedula,
        ciu_email as email,
        ciu_telefono as telefono,
        ciu_cargo as cargo,
        ciu_direccion as direccion,
        ciu_apellido as apellido,
        ciu_empresa as empresa
      FROM ciudadano
      WHERE ciu_cedula = $1
      LIMIT 1
    `, cedula);

    if (ciudadano && ciudadano.length > 0) {
      return NextResponse.json({
        id: ciudadano[0].id,
        nombre: `${ciudadano[0].nombre} ${ciudadano[0].apellido || ''}`.trim(),
        cedula: ciudadano[0].cedula,
        email: ciudadano[0].email || '',
        telefono: ciudadano[0].telefono || '',
        cargo: ciudadano[0].cargo || '',
        direccion: ciudadano[0].direccion || '',
        ciudad: '',
        salario: '',
        empresa: ciudadano[0].empresa || ''
      });
    }

    return NextResponse.json(
      { error: 'Usuario no encontrado' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching user by cedula:', error);
    return NextResponse.json(
      { error: 'Error al buscar usuario', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
