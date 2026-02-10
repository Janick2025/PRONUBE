import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las plantillas
export async function GET() {
  try {
    const templates = await prisma.contractTemplate.findMany({
      select: {
        id: true,
        nombre: true,
        tipo: true,
        campos: true,
        contenido: true,
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Error al obtener plantillas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva plantilla
export async function POST(request: Request) {
  try {
    const { nombre, tipo, contenido, campos } = await request.json();

    if (!nombre || !tipo || !contenido) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const template = await prisma.contractTemplate.create({
      data: {
        nombre,
        tipo,
        contenido,
        campos: campos || []
      }
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Error al crear la plantilla' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar plantilla existente
export async function PUT(request: Request) {
  try {
    const { id, nombre, tipo, contenido, campos } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID de plantilla requerido' },
        { status: 400 }
      );
    }

    const template = await prisma.contractTemplate.update({
      where: { id },
      data: {
        nombre,
        tipo,
        contenido,
        campos: campos || []
      }
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la plantilla' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar plantilla
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID de plantilla requerido' },
        { status: 400 }
      );
    }

    // Verificar si hay contratos asociados
    const contractsCount = await prisma.contrato.count({
      where: { templateId: id }
    });

    if (contractsCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar. Hay ${contractsCount} contrato(s) usando esta plantilla.` },
        { status: 400 }
      );
    }

    await prisma.contractTemplate.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Plantilla eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la plantilla' },
      { status: 500 }
    );
  }
}
