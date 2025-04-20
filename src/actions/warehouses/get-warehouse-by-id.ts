import { ahoraloApi } from '../../config/api/ahoraloApi';
import { Warehouse } from '../../domain/entities/warehouse';
import { AhoraloWarehouse } from '../../infrastructure/interfaces/ahoralo-products.response';
import { WarehouseMapper } from '../../infrastructure/mappers/warehouse.mapper';

const emptyWarehouse: Warehouse = {
  id: '',
  name: '',
  latitude: 0,
  longitude: 0,
  comcityId: '',    
};

export const getWarehouseById = async (
  warehouseId: string,
): Promise<Warehouse> => {
  if (warehouseId === 'new') {
    return emptyWarehouse;
  }

  try {
    const { data } = await ahoraloApi.get<AhoraloWarehouse>(
      `/comcity/warehouses/${warehouseId}`,
    );

    return WarehouseMapper.AhoraloWarehouseToEntity(data);
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener el almacén con id: ${warehouseId}`);
  }
};
