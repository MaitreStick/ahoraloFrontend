import { isAxiosError } from 'axios';
import { ahoraloApi } from '../../config/api/ahoraloApi';
import { Warehouse } from '../../infrastructure/interfaces/warehouse';

export const updateCreateWarehouse = (warehouse: Partial<Warehouse>) => {
  if (warehouse.id && warehouse.id !== 'new') {
    return updateWarehouse(warehouse);
  }
  return createWarehouse(warehouse);
};

const updateWarehouse = async (warehouse: Partial<Warehouse>) => {
  const { id, ...rest } = warehouse;
  try {
    const { data } = await ahoraloApi.patch(`/warehouses/${id}`, rest);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log('Error status:', error.response?.status);
      console.log('Error data:', error.response?.data);
    }
    throw new Error('Error al actualizar el almacén');
  }
};

const createWarehouse = async (warehouse: Partial<Warehouse>) => {
  const { id, ...rest } = warehouse;
  try {
    const { data } = await ahoraloApi.post('/warehouses', rest);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log('Error status:', error.response?.status);
      console.log('Error data:', error.response?.data);
    }
    throw new Error('Error al crear el almacén');
  }
};