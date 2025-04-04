import {ahoraloApi} from '../../config/api/ahoraloApi';
import {LowestPriceByTag} from '../../infrastructure/interfaces/ahoralo-products.response';

export const fetchLowestPricesByTags = async (
  tags: string[],
  cityId: string,
): Promise<LowestPriceByTag[]> => {
  if (!tags || tags.length === 0 || !cityId) {
    return [];
  }

  try {
    const {data} = await ahoraloApi.post<LowestPriceByTag[]>(
      '/prodcomcity/lowest-prices-by-tags',
      {tags, cityId},
    );
    return data;
  } catch (error) {
    console.error('Error en fetchLowestPricesByTags:', error);
    throw error;
  }
};
