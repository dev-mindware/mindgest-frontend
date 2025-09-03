import { useCustomMutation } from '@/hooks/common';
import { Service } from '@/types';

export const useAddService = () =>
  useCustomMutation<Service, Partial<Service>>("post", "/services", "services");

export const useEditService = (id: string) =>
  useCustomMutation<Service, Partial<Service>>("put", `/services/${id}`, "services");

export const useDeleteService = (id: string) =>
  useCustomMutation<void, void>("delete", `/services/${id}`, "services");
