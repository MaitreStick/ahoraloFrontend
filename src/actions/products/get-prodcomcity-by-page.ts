import {ahoraloApi} from '../../config/api/ahoraloApi';
import type {Prodcomcity} from '../../domain/entities/prodcomcity';
import type {AhoraloProdcomcity} from '../../infrastructure/interfaces/ahoralo-products.response';
import {ProdComcityMapper} from '../../infrastructure/mappers/prodcomcity.mapper';

export const getProdcomcityByPage = async (
  page: number,
  limit: number = 20,
): Promise<Prodcomcity[]> => {
  try {
    const {data} = await ahoraloApi.get<AhoraloProdcomcity[]>(
      `/prodcomcity?offset=${page * 10}&limit=${limit}`,
    );

    const prodcomcities = data.map(
      ProdComcityMapper.AhoraloProdcomcityToEntity,
    );
    return prodcomcities;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting prodcomcities');
  }
};
