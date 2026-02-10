'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaFileContract, FaCloudDownloadAlt, FaEdit, FaCheckCircle, FaSignOutAlt, FaUser, FaUsers } from 'react-icons/fa';
import { useAuth } from '@/lib/useAuth';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary-700">PRONUBE</h1>
            <div className="flex items-center space-x-6">
              <nav className="space-x-6">
                <Link href="/" className="text-gray-700 hover:text-primary-600">Inicio</Link>
                <Link href="/crear-contrato" className="text-gray-700 hover:text-primary-600">Crear Contrato</Link>
                <Link href="/generar-masivo" className="text-gray-700 hover:text-primary-600">Generación Masiva</Link>
                {user?.role === 'ADMIN' && (
                  <>
                    <Link href="/gestionar-plantillas" className="text-gray-700 hover:text-primary-600">Plantillas</Link>
                    <Link href="/usuarios" className="text-gray-700 hover:text-primary-600">Usuarios</Link>
                  </>
                )}
                <Link href="/mis-contratos" className="text-gray-700 hover:text-primary-600">Mis Contratos</Link>
                {(user?.role === 'ADMIN' || user?.role === 'VISUALIZADOR') && (
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">Dashboard</Link>
                )}
              </nav>
              {user ? (
                <div className="flex items-center space-x-4 border-l pl-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{user.nombre}</p>
                    <p className="text-xs text-gray-600">{user.role}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-800"
                    title="Cerrar Sesión"
                  >
                    <FaSignOutAlt size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center text-primary-600 hover:text-primary-700 font-semibold"
                >
                  <FaUser className="mr-2" />
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Crea Contratos Profesionales en Minutos
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma en la nube para generar contratos legales de forma rápida, segura y profesional
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/crear-contrato"
              className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition duration-300 shadow-lg"
            >
              Crear Contrato Individual
            </Link>
            <Link
              href="/generar-masivo"
              className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300 shadow-lg"
            >
              <FaUsers className="mr-2" />
              Generación Masiva
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<FaFileContract className="text-5xl text-primary-600" />}
            title="Múltiples Templates"
            description="Variedad de plantillas de contratos para diferentes necesidades"
          />
          <FeatureCard
            icon={<FaEdit className="text-5xl text-primary-600" />}
            title="Personalización Total"
            description="Edita y personaliza cada detalle de tu contrato"
          />
          <FeatureCard
            icon={<FaCloudDownloadAlt className="text-5xl text-primary-600" />}
            title="Descarga en PDF"
            description="Descarga tus contratos en formato PDF profesional"
          />
          <FeatureCard
            icon={<FaCheckCircle className="text-5xl text-primary-600" />}
            title="Legalmente Válidos"
            description="Contratos con validez legal y formato profesional"
          />
        </div>

        {/* Contract Types */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tipos de Contratos Disponibles
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <ContractTypeCard
              title="Contrato Laboral"
              description="Contratos de trabajo para empleados y contratistas"
            />
            <ContractTypeCard
              title="Contrato de Arrendamiento"
              description="Contratos de alquiler de propiedades e inmuebles"
            />
            <ContractTypeCard
              title="Contrato de Servicios"
              description="Acuerdos de prestación de servicios profesionales"
            />
            <ContractTypeCard
              title="Contrato de Compraventa"
              description="Documentos para transacciones comerciales"
            />
            <ContractTypeCard
              title="Confidencialidad (NDA)"
              description="Acuerdos de no divulgación de información"
            />
            <ContractTypeCard
              title="Contratos Personalizados"
              description="Crea tus propios contratos desde cero"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 PRONUBE. Todos los derechos reservados.</p>
          <p className="text-gray-400 mt-2">Creador profesional de contratos en la nube</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition duration-300">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}

function ContractTypeCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-primary-500 hover:shadow-lg transition duration-300 cursor-pointer">
      <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
