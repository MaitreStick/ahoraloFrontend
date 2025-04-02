import {ahoraloApi} from '../../config/api/ahoraloApi';
import {City} from '../../domain/entities/city';
import type {AhoraloCity} from '../../infrastructure/interfaces/ahoralo-products.response';
import {CityMapper} from '../../infrastructure/mappers/city.mapper';

export const getCitiesByPage = async (
  page: number,
  limit: number = 20,
): Promise<City[]> => {
  try {
    const {data} = await ahoraloApi.get<AhoraloCity[]>(
      `/cities?offset=${page * 10}&limit=${limit}`,
    );

    const cities = data.map(CityMapper.AhoraloCityToEntity);
    return cities;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting cities');
  }
};
