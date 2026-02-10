'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaFileDownload, FaUsers } from 'react-icons/fa';

interface Template {
  id: string;
  nombre: string;
  tipo: string;
  campos: string[];
}

interface User {
  id: string;
  nombre: string;
  cedula: string;
  email: string;
  cargo: string;
}

export default function GenerarMasivo() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templatesRes, usersRes] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/users')
      ]);
      
      const templatesData = await templatesRes.json();
      const usersData = await usersRes.json();
      
      // Validar que sean arrays
      setTemplates(Array.isArray(templatesData) ? templatesData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      
      // Mostrar mensaje si hay errores
      if (!Array.isArray(templatesData) || !Array.isArray(usersData)) {
        alert('Error: No se pudieron cargar los datos. Asegúrate de que la base de datos esté poblada.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar los datos. Verifica tu conexión.');
      setTemplates([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Inicializar campos comunes (sin los específicos del trabajador)
      const initialFields: Record<string, string> = {};
      template.campos.forEach((campo: string) => {
        if (!campo.includes('CONTRATADO') && !campo.includes('CEDULA_CONTRATADO')) {
          initialFields[campo] = '';
        }
      });
      setFields(initialFields);
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFields(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const filtered = filteredUsers();
    if (selectedUsers.length === filtered.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filtered.map(u => u.id));
    }
  };

  const filteredUsers = () => {
    return users.filter(user =>
      (user.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.cedula || '').includes(searchTerm) ||
      (user.cargo || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleDownloadBulkPDF = async () => {
    if (!selectedTemplate) {
      alert('Selecciona una plantilla primero');
      return;
    }

    if (selectedUsers.length === 0) {
      alert('Selecciona al menos un trabajador');
      return;
    }

    try {
      const response = await fetch('/api/generate-bulk-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          userIds: selectedUsers,
          commonFields: fields
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contratos-${selectedTemplate.nombre}-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(`Error al generar los contratos: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar los contratos. Inténtalo nuevamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
        <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">Generación Masiva de Contratos</h2>
        <p className="text-gray-600 mb-8 text-center">Selecciona múltiples trabajadores y genera todos los contratos en un archivo ZIP</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuración del Contrato */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaFileDownload className="mr-2" />
              Configuración del Contrato
            </h3>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Plantilla de Contrato</label>
              <select
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Campos Comunes</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Los datos del trabajador (nombre, cédula) se rellenarán automáticamente para cada contrato.
                  </p>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedTemplate.campos
                      .filter(campo => !campo.includes('CONTRATADO') || campo.includes('NOMBRE_CORTO_INSTITUCION'))
                      .map((campo) => (
                        <div key={campo}>
                          <label className="block text-gray-700 font-semibold mb-2 text-sm">
                            {campo.replace(/_/g, ' ')}
                          </label>
                          {campo.includes('ANTECEDENTES') || campo.includes('DOCUMENTOS') || campo.includes('DETALLE') ? (
                            <textarea
                              value={fields[campo] || ''}
                              onChange={(e) => handleFieldChange(campo, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                              rows={2}
                              placeholder={`Ingrese ${campo.replace(/_/g, ' ').toLowerCase()}`}
                            />
                          ) : (
                            <input
                              type="text"
                              value={fields[campo] || ''}
                              onChange={(e) => handleFieldChange(campo, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                              placeholder={`Ingrese ${campo.replace(/_/g, ' ').toLowerCase()}`}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Selección de Trabajadores */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
              <span className="flex items-center">
                <FaUsers className="mr-2" />
                Trabajadores
              </span>
              <span className="text-lg font-normal text-gray-600">
                {selectedUsers.length} seleccionados
              </span>
            </h3>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre, cédula o cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={handleSelectAll}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {selectedUsers.length === filteredUsers().length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg max-h-[500px] overflow-y-auto">
              {filteredUsers().map((user) => (
                <div
                  key={user.id}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${
                    selectedUsers.includes(user.id) ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => handleUserToggle(user.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                      className="mr-3 w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{user.nombre}</div>
                      <div className="text-sm text-gray-600">
                        <span className="mr-4">CC: {user.cedula}</span>
                        <span>{user.cargo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredUsers().length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron trabajadores
                </div>
              )}
            </div>

            {selectedTemplate && selectedUsers.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={handleDownloadBulkPDF}
                  className="w-full flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                >
                  <FaFileDownload className="mr-2" />
                  Generar {selectedUsers.length} Contrato{selectedUsers.length > 1 ? 's' : ''} en ZIP
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
