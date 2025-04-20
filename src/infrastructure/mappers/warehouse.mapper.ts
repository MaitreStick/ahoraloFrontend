import type {AhoraloWarehouse} from '../interfaces/ahoralo-products.response';
import { Warehouse } from '../interfaces/warehouse';

export class WarehouseMapper {
  static AhoraloWarehouseToEntity(ahoraloWarehouse: AhoraloWarehouse): Warehouse {
    return {
      id: ahoraloWarehouse.id,
      name: ahoraloWarehouse.name,
      latitude: ahoraloWarehouse.latitude,
      longitude: ahoraloWarehouse.longitude,
      comcityId: ahoraloWarehouse.comcityId,
      companyName: ahoraloWarehouse.companyName,
    };
  }
}
