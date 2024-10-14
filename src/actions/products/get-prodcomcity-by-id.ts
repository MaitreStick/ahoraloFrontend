import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { Prodcomcity } from "../../domain/entities/prodcomcity";
import { PricetrackerProdcomcity } from "../../infrastructure/interfaces/pricetracker-products.response";
import { ProdComcityMapper } from "../../infrastructure/mappers/prodcomcity.mapper";

const emptyProdcomcity: Prodcomcity = {
    id: '',
    price: 0,
    product: {
        id: '',
        title: '',
        slug: '',
        code: 0,
        images: [],
        tags: [],
    },
    comcity: {
        id: '',
        city: {
            id: '',
            name: '',
            nameDep: '',
        },
        company: { 
            id: '', 
            name: '',
        }, 
        user: '' 
    },
    date: '',
};


export const getProdComCityByIds = async (comcityId: string, productId: string ):Promise<Prodcomcity> => {

    if( comcityId === 'new' && productId === 'new' ) return emptyProdcomcity;

    try {
        const { data } = await pricetrackerApi.get<PricetrackerProdcomcity>(`/prodcomcity/${comcityId}/${productId}`);

        return ProdComcityMapper.PricetrackerProdcomcityToEntity(data);
    } catch (error) {
        console.error(error);
        throw new Error(`Error al obtener el prodcomcity con comcityId ${comcityId} y productId ${productId}`);
    }

}