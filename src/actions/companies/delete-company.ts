import {ahoraloApi} from '../../config/api/ahoraloApi';

export const deleteCompanyById = async (id: string) => {
  try {
    return await ahoraloApi.delete(`/companies/${id}`);
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar la empresa con id: ${id}`);
  }
};
