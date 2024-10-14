import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { City } from "../../domain/entities/city";



export const fetchAllCities = async (
  page: number = 0,
  limit: number = 10,
  search: string = '',
): Promise<City[]> => {
  try {
    const offset = page * limit;
    const { data } = await pricetrackerApi.get<City[]>('/cities/search', {
      params: {
        name: search,
        offset,
        limit,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};