import { ahoraloApi } from "../../config/api/ahoraloApi";
import { Prodcomcity } from "../../domain/entities/prodcomcity";
import { AhoraloProdcomcity } from "../../infrastructure/interfaces/ahoralo-products.response";
import { ProdComcityMapper } from "../../infrastructure/mappers/prodcomcity.mapper";


export const getProductsByCompany = async (companyId: string, page: number = 0, limit: number = 10): Promise<Prodcomcity[]> => {
    try {
        const offset = page * limit;
        const { data } = await ahoraloApi.get<AhoraloProdcomcity[]>(`/prodcomcity/by-company/${companyId}`, {
            params: {
                limit,
                offset,
            },
        });
        const prodcomcities = data.map(ProdComcityMapper.AhoraloProdcomcityToEntity);
        return prodcomcities;
    } catch (error) {
        console.log(error);
        throw new Error('Error getting products by company');
    }
}