import { api } from '@/services';
import { Plan } from '@/types';

export const planService = {
  async getAll(): Promise<Plan[]> {
    const response = await api.get<Plan[]>('/plans');
    return response.data;
  },
};
