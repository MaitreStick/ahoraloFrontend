import {ahoraloApi} from '../../config/api/ahoraloApi';
import type {Company} from '../../domain/entities/company';
import type {AhoraloCompany} from '../../infrastructure/interfaces/ahoralo-products.response';
import {CompanyMapper} from '../../infrastructure/mappers/company.mapper';

export const getCompaniesByPage = async (
  page: number,
  limit: number = 20,
): Promise<Company[]> => {
  try {
    const {data} = await ahoraloApi.get<AhoraloCompany[]>(
      `/companies?offset=${page * 10}&limit=${limit}`,
    );

    const companies = data.map(CompanyMapper.AhoraloCompanyToEntity);
    return companies;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting companies');
  }
};
