import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import type { Prodcomcity } from "../../domain/entities/prodcomcity";
import type { PricetrackerProdcomcity } from "../../infrastructure/interfaces/pricetracker-products.response";
import { ProdComcityMapper } from "../../infrastructure/mappers/prodcomcity.mapper";




export const getProdcomcityByPage = async (page: number, limit: number = 20): Promise<Prodcomcity[]> => {

    try {
        
        const { data } = await pricetrackerApi.get<PricetrackerProdcomcity[]>(`/prodcomcity?offset=${ page * 10 }&limit=${limit}`);

        const prodcomcities = data.map( ProdComcityMapper.PricetrackerProdcomcityToEntity );
        return prodcomcities;

    } catch (error) {
        console.log(error);
        throw new Error('Error getting prodcomcities');
    }
}