import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { Prodcomcity } from "../../domain/entities/prodcomcity";
import { PricetrackerProdcomcity } from "../../infrastructure/interfaces/pricetracker-products.response";
import { ProdComcityMapper } from "../../infrastructure/mappers/prodcomcity.mapper";


export const getProductsByCityAndCompany = async (cityId: string, companyId: string, page: number = 0, limit: number = 10): Promise<Prodcomcity[]> => {
    try {
        const offset = page * limit;
        const { data } = await pricetrackerApi.get<PricetrackerProdcomcity[]>(`/prodcomcity/by-city-and-company/${cityId}/${companyId}`, {
            params: {
                cityId,
                companyId,
                limit,
                offset,
            },
        });
        const prodcomcities = data.map(ProdComcityMapper.PricetrackerProdcomcityToEntity);
        return prodcomcities;
    } catch (error) {
        console.log(error);
        throw new Error('Error getting products by city and company');
    }
}