'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaUsers, FaFileContract, FaChartLine, FaDownload } from 'react-icons/fa';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

interface Stats {
  totalUsers: number;
  totalContracts: number;
  contractsByStatus: { estado: string; count: number }[];
  contractsByMonth: { month: string; count: number }[];
  contractsByTemplate: { template: string; count: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch('/api/reports/contracts');
      const data = await response.json();
      
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Contratos');
      
      XLSX.writeFile(wb, `Reporte_Contratos_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar el reporte');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900">Dashboard</h2>
          <button
            onClick={handleExportExcel}
            className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            <FaDownload className="mr-2" />
            Exportar a Excel
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FaUsers className="text-4xl" />}
            title="Total Usuarios"
            value={stats?.totalUsers || 0}
            color="bg-blue-500"
          />
          <StatCard
            icon={<FaFileContract className="text-4xl" />}
            title="Total Contratos"
            value={stats?.totalContracts || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={<FaChartLine className="text-4xl" />}
            title="Contratos Activos"
            value={stats?.contractsByStatus.find(s => s.estado === 'generado')?.count || 0}
            color="bg-purple-500"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contratos por Estado */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contratos por Estado</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.contractsByStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ estado, count }) => `${estado}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats?.contractsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Contratos por Tipo */}
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contratos por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.contractsByTemplate || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="template" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0ea5e9" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tendencia de Contratos */}
          <div className="bg-white rounded-xl shadow-xl p-6 lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Tendencia de Contratos (Últimos 6 Meses)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.contractsByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} name="Contratos Generados" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-xl p-6 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Resumen de Estadísticas</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats?.contractsByStatus.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-sm">Estado: {item.estado}</p>
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} text-white p-4 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
