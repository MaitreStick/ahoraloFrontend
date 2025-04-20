import { ahoraloApi } from '../../config/api/ahoraloApi';
import { Comcity } from '../../domain/entities/comcity';
import { AhoraloComcity } from '../../infrastructure/interfaces/ahoralo-products.response';
import { ComcityMapper } from '../../infrastructure/mappers/comcity.mapper'; // ← opcional


export const getComcityById = async (comcityId: string): Promise<Comcity> => {
  try {
    const { data } = await ahoraloApi.get<AhoraloComcity>(`/comcity/${comcityId}`);

    return ComcityMapper.AhoraloComcityToEntity(data);
  } catch (error) {
    console.error(error);
    throw new Error(`Error obteniendo comcity con id: ${comcityId}`);
  }
};
