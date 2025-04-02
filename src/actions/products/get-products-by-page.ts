import {ahoraloApi} from '../../config/api/ahoraloApi';
import type {Product} from '../../domain/entities/product';
import type {AhoraloProduct} from '../../infrastructure/interfaces/ahoralo-products.response';
import {ProductMapper} from '../../infrastructure/mappers/product.mapper';

export const getProductsByPage = async (
  page: number,
  limit: number = 20,
): Promise<Product[]> => {
  try {
    const {data} = await ahoraloApi.get<AhoraloProduct[]>(
      `/products?offset=${page * 10}&limit=${limit}`,
    );

    const products = data.map(ProductMapper.AhoraloProductToEntity);
    return products;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');
  }
};
