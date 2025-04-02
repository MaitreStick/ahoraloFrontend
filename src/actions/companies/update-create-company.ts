import {isAxiosError} from 'axios';
import {ahoraloApi} from '../../config/api/ahoraloApi';
import {Company} from '../../domain/entities/company';

export const updateCreateCompany = (company: Partial<Company>) => {
  if (company.id && company.id !== 'new') {
    return updateCompany(company);
  }
  return createCompany(company);
};

const updateCompany = async (company: Partial<Company>) => {
  const {id, ...rest} = company;

  try {
    const {data} = await ahoraloApi.patch(`/companies/${id}`, rest);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log('Error status:', error.response?.status);
      console.log('Error data:', error.response?.data);
    }
    throw new Error('Error al actualizar la empresa');
  }
};

const createCompany = async (company: Partial<Company>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {id, ...rest} = company;

  try {
    const {data} = await ahoraloApi.post('/companies', rest);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log('Error status:', error.response?.status);
      console.log('Error data:', error.response?.data);
    }
    throw new Error('Error al crear la empresa');
  }
};
