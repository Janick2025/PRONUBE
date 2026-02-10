import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cedula = searchParams.get('cedula');
    const password = searchParams.get('password');

    if (!cedula || !password) {
      return NextResponse.json({ error: 'Cédula y contraseña requeridos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { cedula },
      select: {
        id: true,
        nombre: true,
        cedula: true,
        email: true,
        role: true,
        password: true,
      },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
