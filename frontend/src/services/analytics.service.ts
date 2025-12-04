import api from './api';

export interface DashboardStats {
  kpis: {
    totalUsers: number;
    totalPosts: number;
    totalMarketValue: number;
    formattedMarketValue: string;
  };
  charts: {
    postsByCategory: { name: string; value: number }[];
    userSegments: { name: string; value: number }[];
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/analytics/dashboard'); 
  // Asegúrate que tu ruta en backend sea /analytics/dashboard o ajusta aquí
  return data;
};