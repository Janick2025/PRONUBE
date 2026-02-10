'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaFileDownload } from 'react-icons/fa';

interface Template {
  id: string;
  nombre: string;
  tipo: string;
  campos: string[];
}

export default function CrearContrato() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar las plantillas');
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Datos del Contrato</h3>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tipo de Contrato</label>
                <select
                  name="type"
                  value={contractData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="laboral">Contrato Laboral</option>
                  <option value="arrendamiento">Contrato de Arrendamiento</option>
                  <option value="servicios">Contrato de Servicios</option>
                  <option value="compraventa">Contrato de Compraventa</option>
                  <option value="nda">Acuerdo de Confidencialidad (NDA)</option>
                  <option value="academico">Contrato Académico</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Primera Parte (Nombre Completo)</label>
                <input
                  type="text"
                  name="partyA"
                  value={contractData.partyA}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Identificación Primera Parte</label>
                <input
                  type="text"
                  name="partyAId"
                  value={contractData.partyAId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: DNI, RUC, etc."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Segunda Parte (Nombre Completo)</label>
                <input
                  type="text"
                  name="partyB"
                  value={contractData.partyB}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: María García"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Identificación Segunda Parte</label>
                <input
                  type="text"
                  name="partyBId"
                  value={contractData.partyBId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: DNI, RUC, etc."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Descripción del Contrato</label>
                <textarea
                  name="description"
                  value={contractData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe el objeto del contrato"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Monto/Valor (opcional)</label>
                <input
                  type="text"
                  name="amount"
                  value={contractData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: $1,000 USD"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Fecha del Contrato</label>
                <input
                  type="date"
                  name="date"
                  value={contractData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Términos y Condiciones Adicionales</label>
                <textarea
                  name="terms"
                  value={contractData.terms}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Cláusulas adicionales, condiciones especiales, etc."
                />
              </div>

              <button
                type="button"
                onClick={handleGeneratePreview}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition duration-300"
              >
                Generar Vista Previa
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Vista Previa</h3>
              {showPreview && (
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  <FaFileDownload className="mr-2" />
                  Descargar PDF
                </button>
              )}
            </div>

            {showPreview ? (
              <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 min-h-[600px]">
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-gray-900 uppercase">
                    Contrato de {contractData.type}
                  </h4>
                  <p className="text-gray-600 mt-2">Fecha: {contractData.date}</p>
                </div>

                <div className="space-y-4 text-gray-800">
                  <p>
                    Conste por el presente documento, el <strong>CONTRATO DE {contractData.type.toUpperCase()}</strong> que
                    celebran de una parte:
                  </p>

                  <div>
                    <p className="font-semibold">PRIMERA PARTE (EL CONTRATANTE):</p>
                    <p>{contractData.partyA}, identificado con {contractData.partyAId}</p>
                  </div>

                  <div>
                    <p className="font-semibold">SEGUNDA PARTE (EL CONTRATADO):</p>
                    <p>{contractData.partyB}, identificado con {contractData.partyBId}</p>
                  </div>

                  <div>
                    <p className="font-semibold">OBJETO DEL CONTRATO:</p>
                    <p>{contractData.description || 'No especificado'}</p>
                  </div>

                  {contractData.amount && (
                    <div>
                      <p className="font-semibold">VALOR DEL CONTRATO:</p>
                      <p>{contractData.amount}</p>
                    </div>
                  )}

                  {contractData.terms && (
                    <div>
                      <p className="font-semibold">TÉRMINOS Y CONDICIONES:</p>
                      <p className="whitespace-pre-line">{contractData.terms}</p>
                    </div>
                  )}

                  <div className="mt-8 pt-8 border-t border-gray-300">
                    <p className="text-center mb-12">
                      En señal de conformidad, las partes suscriben el presente contrato en la fecha indicada.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="border-t border-gray-400 pt-2">
                          <p className="font-semibold">{contractData.partyA}</p>
                          <p className="text-sm text-gray-600">Primera Parte</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="border-t border-gray-400 pt-2">
                          <p className="font-semibold">{contractData.partyB}</p>
                          <p className="text-sm text-gray-600">Segunda Parte</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-gray-400">
                <p className="text-center">
                  Completa el formulario y haz clic en<br />"Generar Vista Previa"<br />para ver tu contrato
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
