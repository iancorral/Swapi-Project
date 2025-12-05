import React, { useEffect, useState } from 'react';
import { getDashboardStats, type DashboardStats } from '../../services/analytics.service';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-indigo-600 font-semibold text-lg animate-pulse">Cargando Insights...</div>
    </div>
  );
  
  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <div className="text-red-500 font-medium">No se pudieron cargar los datos.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ENCABEZADO */}
        <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            📊 Swapi Market Insights
            </h1>
            <p className="text-gray-500 mt-2">Vista general del rendimiento de la plataforma.</p>
        </div>

        {/* --- SECCIÓN 1: TARJETAS KPI --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard 
            title="Usuarios Registrados" 
            value={stats.kpis.totalUsers} 
            icon="👥"
            color="bg-blue-50 text-blue-600"
          />
          <KpiCard 
            title="Publicaciones Activas" 
            value={stats.kpis.totalPosts} 
            icon="📦" 
            color="bg-indigo-50 text-indigo-600"
          />
          <KpiCard 
            title="Valor del Inventario" 
            value={stats.kpis.formattedMarketValue} 
            icon="💰" 
            color="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* --- SECCIÓN 2: GRÁFICAS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gráfica de Barras */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Inventario por Categoría</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.postsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6B7280', fontSize: 12}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6B7280', fontSize: 12}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Bar dataKey="value" name="Posts" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfica de Pastel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Segmentación de Usuarios</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.charts.userSegments}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.charts.userSegments.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-gray-600 text-sm ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- SECCIÓN 3: TABLA DE TOP VENDEDORES (NUEVO) --- */}
        {stats.charts.topSellersList && stats.charts.topSellersList.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">🏆 Top 5 Vendedores</h2>
                        <p className="text-sm text-gray-400 mt-1">
                        </p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                        Live Data
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="py-4 px-6 text-gray-500 font-semibold text-xs uppercase tracking-wider">Usuario</th>
                                <th className="py-4 px-6 text-gray-500 font-semibold text-xs uppercase tracking-wider text-center">Actividad</th>
                                <th className="py-4 px-6 text-gray-500 font-semibold text-xs uppercase tracking-wider text-right">Valor Inventario</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.charts.topSellersList.map((seller, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/80 transition-colors duration-150">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mr-3">
                                                {seller.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 capitalize">{seller.name}</p>
                                                <p className="text-sm text-gray-500">{seller.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {seller.posts} posts activos
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <span className="font-mono text-gray-700 font-medium">
                                            ${seller.totalValue.toLocaleString()} MXN
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

// Componente de Tarjeta KPI Mejorado
interface KpiCardProps {
    title: string;
    value: string | number;
    icon: string;
    color: string;
}

const KpiCard = ({ title, value, icon, color }: KpiCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow duration-300">
    <div className={`p-4 rounded-full ${color} mr-5 flex items-center justify-center h-16 w-16 text-3xl`}>
        {icon}
    </div>
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
    </div>
  </div>
);