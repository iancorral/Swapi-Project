import React, { useEffect, useState } from 'react';

// CORRECCIÓN CRÍTICA:
// 1. Usamos { } porque no tienes 'export default' en tu servicio.
// 2. Usamos 'type DashboardStats' porque verbatimModuleSyntax lo exige.
import { getDashboardStats, type DashboardStats } from '../../services/analytics.service';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Llamamos a la función importada
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando Analíticas...</div>;
  if (!stats) return <div className="p-10 text-center text-red-500">No se pudieron cargar los datos.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          📊 Swapi Market Insights
        </h1>

        {/* --- SECCIÓN 1: KPIS (Tarjetones) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KpiCard 
            title="Usuarios Totales" 
            value={stats.kpis.totalUsers} 
            icon="👥" 
          />
          <KpiCard 
            title="Publicaciones Activas" 
            value={stats.kpis.totalPosts} 
            icon="📦" 
          />
          <KpiCard 
            title="Valor del Mercado" 
            value={stats.kpis.formattedMarketValue} 
            icon="💰" 
          />
        </div>

        {/* --- SECCIÓN 2: GRÁFICAS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gráfica 1: Distribución por Categoría */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Inventario por Categoría</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.postsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Cantidad de Posts" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfica 2: Segmentación de Usuarios */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Segmentación de Usuarios</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.charts.userSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => {
                      const name = entry?.name ?? '';
                      const percent = typeof entry?.percent === 'number' ? entry.percent : 0;
                      return `${name} ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.charts.userSegments.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Componente simple para las tarjetas
interface KpiCardProps {
    title: string;
    value: string | number;
    icon: string;
}

const KpiCard = ({ title, value, icon }: KpiCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
    <div className="text-4xl mr-4 bg-indigo-50 p-3 rounded-full flex items-center justify-center w-16 h-16">
        {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);