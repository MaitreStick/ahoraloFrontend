import { ahoraloApi } from '../../config/api/ahoraloApi';


export const deleteWarehouseById = async (id: string) => {
  await ahoraloApi.delete(`/comcity/warehouses/${id}`);
};