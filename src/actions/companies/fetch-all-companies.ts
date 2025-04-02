import {ahoraloApi} from '../../config/api/ahoraloApi';
import {Company} from '../../domain/entities/company';

export const fetchAllCompanies = async (
  page: number = 0,
  limit: number = 10,
  search: string = '',
): Promise<Company[]> => {
  try {
    const offset = page * limit;
    const {data} = await ahoraloApi.get<Company[]>('/companies/search', {
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
