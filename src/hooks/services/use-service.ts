import { useCustomMutation } from '@/hooks/common';
import { ServiceCard } from '@/types';

export const useAddService = () =>
  useCustomMutation<ServiceCard, Partial<ServiceCard>>("post", "/services", "services");

export const useEditService = (id: string) =>
  useCustomMutation<ServiceCard, Partial<ServiceCard>>("put", `/services/${id}`, "services");

export const useDeleteService = (id: string) =>
  useCustomMutation<void, void>("delete", `/services/${id}`, "services");
