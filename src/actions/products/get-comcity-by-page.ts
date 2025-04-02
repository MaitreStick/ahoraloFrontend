import {ahoraloApi} from '../../config/api/ahoraloApi';
import {Comcity} from '../../domain/entities/comcity';
import {ComcityMapper} from '../../infrastructure/mappers/comcity.mapper';

export const getComcitiesByPage = async (
  page: number,
  limit: number = 20,
): Promise<Comcity[]> => {
  try {
    const {data} = await ahoraloApi.get<Comcity[]>(
      `/comcity?offset=${page * 10}&limit=${limit}`,
    );
    const comcities = data.map(ComcityMapper.AhoraloComcityToEntity);
    return comcities;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting comcities');
  }
};
