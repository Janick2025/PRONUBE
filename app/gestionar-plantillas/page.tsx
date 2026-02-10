'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaUpload, FaEdit, FaTrash, FaSave, FaPlus, FaEye } from 'react-icons/fa';
import mammoth from 'mammoth';

interface Template {
  id: string;
  nombre: string;
  tipo: string;
  contenido: string;
  campos: string[];
}

export default function GestionarPlantillas() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedNombre, setEditedNombre] = useState('');
  const [editedTipo, setEditedTipo] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Estados para crear nueva plantilla
  const [creatingNew, setCreatingNew] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    nombre: '',
    tipo: '',
    contenido: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar las plantillas.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditedContent(template.contenido);
    setEditedNombre(template.nombre);
    setEditedTipo(template.tipo);
    setEditMode(false);
    setCreatingNew(false);
  };

  const handleEditTemplate = () => {
    setEditMode(true);
  };

  const extractFieldsFromContent = (content: string): string[] => {
    const regex = /\{([A-Z_]+)\}/g;
    const matches = Array.from(content.matchAll(regex));
    const fields = new Set<string>();
    
    for (const match of matches) {
      fields.add(match[1]);
    }
    
    return Array.from(fields).sort();
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const campos = extractFieldsFromContent(editedContent);
      
      const response = await fetch('/api/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTemplate.id,
          nombre: editedNombre,
          tipo: editedTipo,
          contenido: editedContent,
          campos: campos
        }),
      });

      if (response.ok) {
        alert('Plantilla actualizada correctamente');
        setEditMode(false);
        fetchTemplates();
        // Actualizar template seleccionada
        setSelectedTemplate({
          ...selectedTemplate,
          nombre: editedNombre,
          tipo: editedTipo,
          contenido: editedContent,
          campos: campos
        });
      } else {
        alert('Error al actualizar la plantilla');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la plantilla');
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.nombre || !newTemplate.tipo || !newTemplate.contenido) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const campos = extractFieldsFromContent(newTemplate.contenido);
      
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTemplate,
          campos: campos
        }),
      });

      if (response.ok) {
        alert('Plantilla creada correctamente');
        setCreatingNew(false);
        setNewTemplate({ nombre: '', tipo: '', contenido: '' });
        fetchTemplates();
      } else {
        alert('Error al crear la plantilla');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la plantilla');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta plantilla?')) return;

    try {
      const response = await fetch('/api/templates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert('Plantilla eliminada correctamente');
        setSelectedTemplate(null);
        fetchTemplates();
      } else {
        alert('Error al eliminar la plantilla');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la plantilla');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    
    // Detectar tipo de archivo
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.docx')) {
      // Leer archivo Word (.docx) - mantener formato HTML
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const htmlContent = result.value;
        
        if (creatingNew) {
          setNewTemplate(prev => ({ ...prev, contenido: htmlContent }));
        } else if (editMode) {
          setEditedContent(htmlContent);
        }
      } catch (error) {
        console.error('Error leyendo archivo Word:', error);
        alert('Error al leer el archivo Word. Intenta con un archivo .txt o copia/pega el contenido.');
      }
    } else {
      // Leer archivo de texto (.txt, .doc como texto)
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (creatingNew) {
          setNewTemplate(prev => ({ ...prev, contenido: content }));
        } else if (editMode) {
          setEditedContent(content);
        }
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  const generatePreviewContent = () => {
    if (creatingNew) {
      return newTemplate.contenido;
    }
    return editMode ? editedContent : selectedTemplate?.contenido || '';
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
        if (isTitle) return <div key={index} className="text-center font-bold text-base mb-2 mt-3 text-gray-900">{line}</div>;
        return <p key={index} className="text-sm text-justify leading-relaxed mb-2 text-gray-900">{line}</p>;
      });
    }
  };

  const detectedFields = extractFieldsFromContent(generatePreviewContent());

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
            <h1 className="text-3xl font-bold text-primary-700">PRONUBE - Gestión de Plantillas</h1>
            <Link href="/" className="flex items-center text-gray-700 hover:text-primary-600">
              <FaArrowLeft className="mr-2" />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Sidebar - Lista de Plantillas */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-xl p-6 sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Plantillas</h3>
                  <button
                    onClick={() => {
                      setCreatingNew(true);
                      setSelectedTemplate(null);
                      setEditMode(false);
                    }}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    title="Crear Nueva Plantilla"
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedTemplate?.id === template.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-bold text-sm text-gray-900">{template.nombre}</div>
                      <div className="text-xs text-gray-600">{template.tipo}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Área Principal */}
            <div className="lg:col-span-9">
              <div className="bg-white rounded-xl shadow-xl p-8">
                {/* Crear Nueva Plantilla */}
                {creatingNew && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Plantilla</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCreatingNew(false)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleCreateTemplate}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          <FaSave />
                          Crear Plantilla
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Nombre de la Plantilla</label>
                        <input
                          type="text"
                          value={newTemplate.nombre}
                          onChange={(e) => setNewTemplate(prev => ({ ...prev, nombre: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="Ej: Contrato de Trabajo Temporal"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Tipo de Contrato</label>
                        <input
                          type="text"
                          value={newTemplate.tipo}
                          onChange={(e) => setNewTemplate(prev => ({ ...prev, tipo: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          placeholder="Ej: Laboral, Prestación de Servicios, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">Subir Documento</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".txt,.doc,.docx"
                            onChange={handleFileUpload}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            <FaUpload />
                            Cargar
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Formatos aceptados: .txt, .doc, .docx
                        </p>
                      </div>
                    </div>

                    {/* Editor y Vista Previa */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-gray-900">Contenido de la Plantilla</h4>
                          <span className="text-xs text-gray-600">Use {'{'}CAMPO{'}'} para variables</span>
                        </div>
                        <textarea
                          value={newTemplate.contenido}
                          onChange={(e) => setNewTemplate(prev => ({ ...prev, contenido: e.target.value }))}
                          className="w-full h-[500px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono text-sm"
                          placeholder="Escriba o pegue el contenido de la plantilla aquí..."
                        />
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Vista Previa</h4>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-[500px] overflow-y-auto">
                          <div className="bg-white p-6 rounded shadow-sm" style={{ fontFamily: 'serif' }}>
                            {renderPreview(newTemplate.contenido)}
                          </div>
                        </div>

                        {/* Campos Detectados */}
                        {detectedFields.length > 0 && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h5 className="font-bold text-sm text-gray-900 mb-2">Campos Detectados:</h5>
                            <div className="flex flex-wrap gap-2">
                              {detectedFields.map((field) => (
                                <span key={field} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                                  {'{' + field + '}'}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Editar/Ver Plantilla Existente */}
                {!creatingNew && selectedTemplate && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {editMode ? 'Editar Plantilla' : 'Ver Plantilla'}
                      </h2>
                      <div className="flex gap-2">
                        {!editMode ? (
                          <>
                            <button
                              onClick={handleEditTemplate}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                              <FaEdit />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(selectedTemplate.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              <FaTrash />
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditMode(false);
                                setEditedContent(selectedTemplate.contenido);
                                setEditedNombre(selectedTemplate.nombre);
                                setEditedTipo(selectedTemplate.tipo);
                              }}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleSaveTemplate}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              <FaSave />
                              Guardar Cambios
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                          <FaEye />
                          {showPreview ? 'Ocultar' : 'Mostrar'} Vista Previa
                        </button>
                      </div>
                    </div>

                    {editMode && (
                      <div className="space-y-4 mb-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Nombre de la Plantilla</label>
                            <input
                              type="text"
                              value={editedNombre}
                              onChange={(e) => setEditedNombre(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-2">Tipo de Contrato</label>
                            <input
                              type="text"
                              value={editedTipo}
                              onChange={(e) => setEditedTipo(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">Reemplazar con Archivo</label>
                          <input
                            type="file"
                            accept=".txt,.doc,.docx"
                            onChange={handleFileUpload}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                        </div>
                      </div>
                    )}

                    <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                      {/* Editor/Visor */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          {editMode ? 'Editar Contenido' : 'Contenido Original'}
                        </h4>
                        {editMode ? (
                          <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-[500px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono text-sm"
                          />
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-[500px] overflow-y-auto">
                            <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
                              {selectedTemplate.contenido}
                            </pre>
                          </div>
                        )}
                        
                        {/* Info de Campos */}
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h5 className="font-bold text-sm text-gray-900 mb-2">Campos Actuales:</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedTemplate.campos.map((field) => (
                              <span key={field} className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-mono">
                                {'{' + field + '}'}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Vista Previa */}
                      {showPreview && (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Vista Previa {editMode && 'en Tiempo Real'}</h4>
                          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-[500px] overflow-y-auto">
                            <div className="bg-white p-6 rounded shadow-sm" style={{ fontFamily: 'serif' }}>
                              {renderPreview(generatePreviewContent())}
                            </div>
                          </div>

                          {/* Campos Detectados en Edición */}
                          {editMode && detectedFields.length > 0 && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h5 className="font-bold text-sm text-gray-900 mb-2">Campos Detectados:</h5>
                              <div className="flex flex-wrap gap-2">
                                {detectedFields.map((field) => (
                                  <span key={field} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                                    {'{' + field + '}'}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Estado de No Selección */}
                {!creatingNew && !selectedTemplate && (
                  <div className="text-center py-20">
                    <div className="text-gray-400 mb-4">
                      <FaEdit size={64} className="mx-auto" />
                    </div>
                    <p className="text-xl text-gray-600 mb-4">
                      Selecciona una plantilla o crea una nueva
                    </p>
                    <button
                      onClick={() => setCreatingNew(true)}
                      className="flex items-center gap-2 mx-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <FaPlus />
                      Crear Nueva Plantilla
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
