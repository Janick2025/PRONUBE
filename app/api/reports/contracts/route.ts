import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contratos = await prisma.contrato.findMany({
      include: {
        user: {
          select: {
            nombre: true,
            cedula: true,
            email: true,
            cargo: true,
          },
        },
        template: {
          select: {
            nombre: true,
            tipo: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });
    
    // Formatear datos para Excel
    const reportData = contratos.map(contrato => ({
      'ID Contrato': contrato.id,
      'Usuario': contrato.user.nombre,
      'Cédula': contrato.user.cedula,
      'Email': contrato.user.email || '',
      'Cargo': contrato.user.cargo || '',
      'Tipo de Contrato': contrato.template.tipo,
      'Template': contrato.template.nombre,
      'Estado': contrato.estado,
      'Fecha Generación': new Date(contrato.fecha).toLocaleDateString('es-ES'),
      'Fecha Creación': new Date(contrato.createdAt).toLocaleDateString('es-ES'),
    }));
    
    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Error al generar reporte' }, { status: 500 });
  }
}
