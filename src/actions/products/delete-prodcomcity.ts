import {ahoraloApi} from '../../config/api/ahoraloApi';

export const deleteProdcomcityById = async (id: string) => {
  try {
    return await ahoraloApi.delete(`/prodcomcity/${id}`);
  } catch (error) {
    console.error(error);
    throw new Error(`Error al eliminar el producto con id: ${id}`);
  }
};
