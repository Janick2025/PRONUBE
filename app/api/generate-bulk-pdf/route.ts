import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { prisma } from '@/lib/prisma';
import archiver from 'archiver';
import { Readable } from 'stream';
import { convert } from 'html-to-text';

export async function POST(request: NextRequest) {
  try {
    const { templateId, userIds, commonFields } = await request.json();

    // Obtener la plantilla
    const template = await prisma.contractTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Plantilla no encontrada' },
        { status: 404 }
      );
    }

    // Obtener usuarios seleccionados de la tabla usuarios de Quipux
    const placeholders = userIds.map((_: any, i: number) => `$${i + 1}`).join(',');
    const users = await prisma.$queryRawUnsafe<any[]>(
      `SELECT 
        usua_codi::text as id,
        COALESCE(usua_nomb || ' ' || usua_apellido, usua_nomb, usua_apellido) as nombre,
        usua_cedula as cedula,
        usua_cargo as cargo
      FROM usuarios 
      WHERE usua_codi::text IN (${placeholders})`,
      ...userIds
    );

    // Crear el archivo ZIP
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const chunks: Buffer[] = [];
    
    archive.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    // Generar un PDF por cada usuario
    for (const user of users) {
      // Combinar campos comunes con datos del usuario
      const fields = {
        ...commonFields,
        NOMBRE_CONTRATADO: user.nombre,
        CEDULA_CONTRATADO: user.cedula,
        // Agregar más campos según necesites
      };

      // Reemplazar campos en el contenido
      let contenido = template.contenido;
      Object.keys(fields).forEach(key => {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        contenido = contenido.replace(regex, fields[key] || '');
      });

      // Detectar si es HTML y convertir a texto si es necesario
      const isHtml = contenido.includes('<p>') || contenido.includes('<div>') || contenido.includes('<strong>');
      if (isHtml) {
        contenido = convert(contenido, {
          wordwrap: 130,
          preserveNewlines: true,
          formatters: {
            'heading': (elem, walk, builder, formatOptions) => {
              builder.openBlock({ leadingLineBreaks: 2 });
              walk(elem.children, builder);
              builder.closeBlock({ trailingLineBreaks: 2, blockTransform: (str: string) => str.toUpperCase() });
            }
          }
        });
      }

      // Generar PDF
      const pdf = generatePDF(contenido, template.nombre);
      const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
      
      // Agregar al ZIP
      const fileName = `${template.nombre}-${user.nombre.replace(/\s+/g, '_')}.pdf`;
      archive.append(pdfBuffer, { name: fileName });
    }

    // Finalizar el archivo
    await archive.finalize();

    // Esperar a que se complete
    await new Promise((resolve) => {
      archive.on('end', resolve);
    });

    const zipBuffer = Buffer.concat(chunks);

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="contratos-${template.nombre}-${Date.now()}.zip"`,
      },
    });
  } catch (error) {
    console.error('Error generating bulk PDFs:', error);
    return NextResponse.json(
      { error: 'Error al generar los contratos', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function generatePDF(contenido: string, templateName: string): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxLineWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  const checkAndAddPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);

  const lines = contenido.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) {
      yPosition += 5;
      continue;
    }

    const isTitle = line === line.toUpperCase() && line.length < 100;
    
    if (isTitle) {
      checkAndAddPage(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
    }

    const wrappedLines = pdf.splitTextToSize(line, maxLineWidth);
    const lineHeight = isTitle ? 7 : 5;
    
    checkAndAddPage(wrappedLines.length * lineHeight + 3);
    
    if (isTitle) {
      pdf.text(wrappedLines, pageWidth / 2, yPosition, { align: 'center' });
    } else {
      pdf.text(wrappedLines, margin, yPosition);
    }
    
    yPosition += wrappedLines.length * lineHeight + (isTitle ? 3 : 0);
  }

  return pdf;
}
