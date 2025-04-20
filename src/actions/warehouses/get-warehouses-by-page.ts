import { ahoraloApi } from '../../config/api/ahoraloApi';
import type { Warehouse } from '../../domain/entities/warehouse';
import type { AhoraloWarehouse } from '../../infrastructure/interfaces/ahoralo-products.response';
import { WarehouseMapper } from '../../infrastructure/mappers/warehouse.mapper';

export const getWarehousesByPage = async (
  page: number,
  limit: number = 20,
): Promise<Warehouse[]> => {
  try {
    const offset = page * limit;

    const { data } = await ahoraloApi.get<AhoraloWarehouse[]>(
      `/comcity/warehouses?offset=${offset}&limit=${limit}`,
    );

    const warehouses = data.map(WarehouseMapper.AhoraloWarehouseToEntity);

    return warehouses;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting warehouses');
  }
};
