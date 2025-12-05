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

    topSellersList?: { 
        name: string;
        email: string;
        posts: number;
        totalValue: number;
    }[];
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/analytics/dashboard'); 
  return data;
};