import { ahoraloApi } from '../../config/api/ahoraloApi';
export const getWarehouseById = async (id: string) => {
  const { data } = await ahoraloApi.get(`/warehouses/${id}`);
  return data;
};