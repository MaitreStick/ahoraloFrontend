import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import type { Product } from "../../domain/entities/product";
import type { PricetrackerProduct } from "../../infrastructure/interfaces/pricetracker-products.response";
import { ProductMapper } from "../../infrastructure/mappers/product.mapper";




export const getProductsByPage = async (page: number, limit: number = 20): Promise<Product[]> => {

    try {
        
        const { data } = await pricetrackerApi.get<PricetrackerProduct[]>(`/products?offset=${ page * 10 }&limit=${limit}`);

        const products = data.map( ProductMapper.PricetrackerProductToEntity );
        return products;

    } catch (error) {
        console.log(error);
        throw new Error('Error getting products');
    }
}