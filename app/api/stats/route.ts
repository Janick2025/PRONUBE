import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Contar usuarios
    const totalUsers = await prisma.user.count();
    
    // Contar contratos
    const totalContracts = await prisma.contrato.count();
    
    // Contratos por estado
    const contractsByStatus = await prisma.contrato.groupBy({
      by: ['estado'],
      _count: true,
    });
    
    // Contratos generados por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const contractsByMonth = await prisma.$queryRaw`
      SELECT 
        TO_CHAR(fecha, 'YYYY-MM') as month,
        COUNT(*)::int as count
      FROM contratos
      WHERE fecha >= ${sixMonthsAgo}
      GROUP BY TO_CHAR(fecha, 'YYYY-MM')
      ORDER BY month
    `;
    
    // Contratos por template
    const contractsByTemplate = await prisma.contrato.groupBy({
      by: ['templateId'],
      _count: true,
    });
    
    // Obtener nombres de templates
    const templates = await prisma.contractTemplate.findMany({
      select: { id: true, nombre: true },
    });
    
    const contractsByTemplateWithNames = contractsByTemplate.map(item => {
      const template = templates.find(t => t.id === item.templateId);
      return {
        template: template?.nombre || 'Sin template',
        count: item._count,
      };
    });
    
    return NextResponse.json({
      totalUsers,
      totalContracts,
      contractsByStatus: contractsByStatus.map(item => ({
        estado: item.estado,
        count: item._count,
      })),
      contractsByMonth,
      contractsByTemplate: contractsByTemplateWithNames,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
