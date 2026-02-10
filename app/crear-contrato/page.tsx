'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaFileDownload, FaEye } from 'react-icons/fa';

interface Template {
  id: string;
  nombre: string;
  tipo: string;
  campos: string[];
  contenido: string;
}

export default function CrearContrato() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchingUser, setSearchingUser] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      
      // Validar que sea un array
      if (Array.isArray(data)) {
        setTemplates(data);
      } else {
        console.error('Las plantillas no son un array:', data);
        setTemplates([]);
        alert('Error: No se pudieron cargar las plantillas. Asegúrate de que la base de datos esté poblada.');
      }
    } catch (error) {
      console.error('Error:', error);
      setTemplates([]);
      alert('Error al cargar las plantillas. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Inicializar campos vacíos
      const initialFields: Record<string, string> = {};
      template.campos.forEach((campo: string) => {
        initialFields[campo] = '';
      });
      setFields(initialFields);
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFields(prev => ({ ...prev, [fieldName]: value }));
    
    // Si el campo es CEDULA o CEDULA_CONTRATADO, buscar usuario automáticamente
    if ((fieldName === 'CEDULA' || fieldName === 'CEDULA_CONTRATADO') && value.length >= 6) {
      searchUserByCedula(value);
    }
  };

  // Generar vista previa del contrato con los campos rellenados
  const generatePreview = () => {
    if (!selectedTemplate) return '';
    
    let contenido = selectedTemplate.contenido;
    Object.keys(fields).forEach(key => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      const value = fields[key] || `{${key}}`;
      contenido = contenido.replace(regex, value);
    });
    
    return contenido;
  };

  const isHtmlContent = (content: string): boolean => {
    return content.includes('<p>') || content.includes('<div>') || content.includes('<span>') || content.includes('<strong>') || content.includes('<em>');
  };

  const renderPreview = (content: string) => {
    if (!content) return null;
    
    if (isHtmlContent(content)) {
      // Renderizar HTML con estilos
      return (
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ color: '#000', fontFamily: 'serif' }}
        />
      );
    } else {
      // Renderizar texto plano con formato básico
      return content.split('\n').map((line, index) => {
        const isTitle = line === line.toUpperCase() && line.length < 100 && line.trim().length > 0;
        const isEmpty = !line.trim();
        
        if (isEmpty) return <div key={index} className="h-3"></div>;
        if (isTitle) return <div key={index} className="text-center font-bold text-base mb-2 mt-3">{line}</div>;
        return <p key={index} className="text-sm text-justify leading-relaxed mb-2">{line}</p>;
      });
    }
  };

  const searchUserByCedula = async (cedula: string) => {
    setSearchingUser(true);
    try {
      const response = await fetch(`/api/users/by-cedula?cedula=${cedula}`);
      
      if (response.ok) {
        const user = await response.json();
        
        // Mapear los datos del usuario a los campos del contrato
        const fieldMapping: Record<string, string> = {
          'EMPLEADO': user.nombre,
          'NOMBRE_CONTRATADO': user.nombre,
          'CONTRATISTA': user.nombre,
          'CEDULA': user.cedula,
          'CEDULA_CONTRATADO': user.cedula,
          'CARGO': user.cargo || '',
          'SALARIO': user.salario || '',
          'CIUDAD': user.ciudad || '',
          'EMAIL': user.email || '',
          'TELEFONO': user.telefono || '',
          'DIRECCION': user.direccion || '',
        };

        // Actualizar solo los campos que existen en la plantilla
        const updatedFields = { ...fields };
        Object.keys(fieldMapping).forEach(key => {
          if (selectedTemplate?.campos.includes(key)) {
            updatedFields[key] = fieldMapping[key];
          }
        });
        
        setFields(updatedFields);
      }
    } catch (error) {
      console.error('Error buscando usuario:', error);
    } finally {
      setSearchingUser(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedTemplate) {
      alert('Selecciona una plantilla primero');
      return;
    }

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          fields: fields
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedTemplate.nombre}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(`Error al generar el PDF: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Inténtalo nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando plantillas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary-700">PRONUBE</h1>
            <Link href="/" className="flex items-center text-gray-700 hover:text-primary-600">
              <FaArrowLeft className="mr-2" />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Crear Nuevo Contrato</h2>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Selecciona una Plantilla</h3>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Plantilla de Contrato</label>
              <select
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 font-medium"
                defaultValue=""
              >
                <option value="" disabled>Selecciona una plantilla...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.nombre} ({template.tipo})
                  </option>
                ))}
              </select>
            </div>

            {selectedTemplate && (
              <>
                {searchingUser && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                    🔍 Buscando datos del usuario...
                  </div>
                )}
                
                {/* Toggle Vista Previa */}
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaEye />
                    {showPreview ? 'Ocultar Vista Previa' : 'Mostrar Vista Previa'}
                  </button>
                </div>

                {/* Layout de dos columnas */}
                <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                  {/* Columna de Formulario */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Completa los Campos</h4>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {selectedTemplate.campos.map((campo) => (
                        <div key={campo}>
                          <label className="block text-gray-900 font-bold mb-2 uppercase text-sm">
                            {campo.replace(/_/g, ' ')}
                            {(campo === 'CEDULA' || campo === 'CEDULA_CONTRATADO') && (
                              <span className="text-blue-600 text-xs ml-2 normal-case">
                                (autocompletado disponible)
                              </span>
                            )}
                          </label>
                          {campo.includes('ANTECEDENTES') || campo.includes('DOCUMENTOS') || campo.includes('DETALLE') ? (
                            <textarea
                              value={fields[campo] || ''}
                              onChange={(e) => handleFieldChange(campo, e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 font-medium placeholder:text-gray-500"
                              rows={3}
                              placeholder={`Ingrese ${campo.replace(/_/g, ' ').toLowerCase()}`}
                            />
                          ) : (
                            <input
                              type="text"
                              value={fields[campo] || ''}
                              onChange={(e) => handleFieldChange(campo, e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 font-medium placeholder:text-gray-500"
                              placeholder={`Ingrese ${campo.replace(/_/g, ' ').toLowerCase()}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Columna de Vista Previa */}
                  {showPreview && (
                    <div className="border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-6 lg:pl-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Vista Previa en Tiempo Real</h4>
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto">
                        <div className="bg-white p-6 rounded shadow-sm" style={{ fontFamily: 'serif' }}>
                          {renderPreview(generatePreview())}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                  >
                    <FaFileDownload className="mr-2" />
                    Generar y Descargar Contrato PDF
                  </button>
                </div>
              </>
            )}

            {!selectedTemplate && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Selecciona una plantilla para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
