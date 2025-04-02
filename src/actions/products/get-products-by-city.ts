import {ahoraloApi} from '../../config/api/ahoraloApi';
import {Prodcomcity} from '../../domain/entities/prodcomcity';
import {AhoraloProdcomcity} from '../../infrastructure/interfaces/ahoralo-products.response';
import {ProdComcityMapper} from '../../infrastructure/mappers/prodcomcity.mapper';

export const getProductsByCity = async (
  cityId: string,
  page: number = 0,
  limit: number = 10,
): Promise<Prodcomcity[]> => {
  try {
    const offset = page * limit;
    const {data} = await ahoraloApi.get<AhoraloProdcomcity[]>(
      `/prodcomcity/by-city/${cityId}`,
      {
        params: {
          limit,
          offset,
        },
      },
    );
    const prodcomcities = data.map(
      ProdComcityMapper.AhoraloProdcomcityToEntity,
    );
    return prodcomcities;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn('No se encontraron productos para la ciudad seleccionada.');
      return [];
    } else {
      console.error('Error en getProductsByCity:', error);
      throw error;
    }
  }
};
