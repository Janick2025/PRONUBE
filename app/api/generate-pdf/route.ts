import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { prisma } from '@/lib/prisma';
import { convert } from 'html-to-text';

export async function POST(request: NextRequest) {
  try {
    const { templateId, fields } = await request.json();

    // Obtener la plantilla de la base de datos
    const template = await prisma.contractTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Plantilla no encontrada' },
        { status: 404 }
      );
    }

    // Reemplazar los campos en el contenido
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

    // Función para agregar nueva página si es necesario
    const checkAndAddPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Configurar fuente
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    // Dividir el contenido en líneas y agregar al PDF
    const lines = contenido.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) {
        yPosition += 5;
        continue;
      }

      // Detectar si es un título (línea corta en mayúsculas)
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

    // Generar el PDF como buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${template.nombre}-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Error al generar el PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
