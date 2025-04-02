import {ahoraloApi} from '../../config/api/ahoraloApi';
import {Company} from '../../domain/entities/company';
import {AhoraloCompany} from '../../infrastructure/interfaces/ahoralo-products.response';
import {CompanyMapper} from '../../infrastructure/mappers/company.mapper';

const emptyCompany: Company = {
  id: '',
  name: '',
};

export const getCompanyById = async (companyId: string): Promise<Company> => {
  if (companyId === 'new') {
    return emptyCompany;
  }

  try {
    const {data} = await ahoraloApi.get<AhoraloCompany>(
      `/companies/${companyId}`,
    );
    return CompanyMapper.AhoraloCompanyToEntity(data);
  } catch (error) {
    console.error(error);
    throw new Error(`Error al obtener la empresa con id: ${companyId}`);
  }
};
