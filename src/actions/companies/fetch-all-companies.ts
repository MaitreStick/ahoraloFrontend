import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { Company } from "../../domain/entities/company";



export const fetchAllCompanies = async (
  page: number = 0,
  limit: number = 10,
  search: string = '',
): Promise<Company[]> => {
  try {
    const offset = page * limit;
    const { data } = await pricetrackerApi.get<Company[]>('/companies/search', {
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