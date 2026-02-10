'use client';

import Link from 'next/link';
import { FaArrowLeft, FaFileContract, FaDownload, FaEye } from 'react-icons/fa';

export default function MisContratos() {
  // Datos de ejemplo - en producción vendrían de una base de datos
  const contratos = [
    {
      id: 1,
      tipo: 'Contrato Laboral',
      parteA: 'Juan Pérez',
      parteB: 'Empresa ABC',
      fecha: '2026-01-15',
      estado: 'Activo',
    },
    {
      id: 2,
      tipo: 'Contrato de Arrendamiento',
      parteA: 'María García',
      parteB: 'Pedro López',
      fecha: '2026-01-20',
      estado: 'Activo',
    },
    {
      id: 3,
      tipo: 'Contrato de Servicios',
      parteA: 'Carlos Ruiz',
      parteB: 'Consultora XYZ',
      fecha: '2026-02-01',
      estado: 'Pendiente',
    },
  ];

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Mis Contratos</h2>
          <Link
            href="/crear-contrato"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition duration-300"
          >
            + Nuevo Contrato
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Tipo de Contrato</th>
                  <th className="px-6 py-4 text-left">Primera Parte</th>
                  <th className="px-6 py-4 text-left">Segunda Parte</th>
                  <th className="px-6 py-4 text-left">Fecha</th>
                  <th className="px-6 py-4 text-left">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contratos.map((contrato) => (
                  <tr key={contrato.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaFileContract className="text-primary-600 mr-2" />
                        {contrato.tipo}
                      </div>
                    </td>
                    <td className="px-6 py-4">{contrato.parteA}</td>
                    <td className="px-6 py-4">{contrato.parteB}</td>
                    <td className="px-6 py-4">{contrato.fecha}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          contrato.estado === 'Activo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {contrato.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="Ver Contrato"
                        >
                          <FaEye size={20} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800"
                          title="Descargar PDF"
                        >
                          <FaDownload size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {contratos.length === 0 && (
            <div className="text-center py-12">
              <FaFileContract className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No tienes contratos guardados aún</p>
              <Link
                href="/crear-contrato"
                className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold"
              >
                Crear tu primer contrato →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
