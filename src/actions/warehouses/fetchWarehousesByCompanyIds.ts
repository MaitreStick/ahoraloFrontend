import {ahoraloApi} from '../../config/api/ahoraloApi';
import {Warehouse} from '../../infrastructure/interfaces/warehouse';

export const fetchWarehousesByCompanyIds = async (
  companyIds: string[],
): Promise<Warehouse[]> => {
  try {
    const {data} = await ahoraloApi.post('/comcity/warehouses/by-company-ids', {
      companyIds,
    });
    return data;
  } catch (error) {
    console.error('Error al obtener los almacenes:', error);
    throw error;
  }
};
