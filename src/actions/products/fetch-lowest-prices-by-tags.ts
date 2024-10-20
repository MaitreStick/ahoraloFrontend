import { ahoraloApi } from '../../config/api/ahoraloApi';
import { LowestPriceByTag } from '../../infrastructure/interfaces/ahoralo-products.response';

export const fetchLowestPricesByTags = async (tags: string[]): Promise<LowestPriceByTag[]> => {
  if (!tags || tags.length === 0) {
    return [];
  }

  try {
    const tagsParam = tags.join(',');
    const { data } = await ahoraloApi.get<LowestPriceByTag[]>(`/prodcomcity/lowest-prices-by-tags?tags=${tagsParam}`);
    return data;
  } catch (error) {
    console.error('Error en fetchLowestPricesByTags:', error);
    throw error;
  }
};