import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { Product } from "../../domain/entities/product";
import { PricetrackerProduct } from "../../infrastructure/interfaces/pricetracker-products.response";
import { ProductMapper } from "../../infrastructure/mappers/product.mapper";




export const getProductById = async (id: string):Promise<Product> => {

    try {
        const { data } = await pricetrackerApi.get<PricetrackerProduct>(`/products/${id}`);

        return ProductMapper.PricetrackerProductToEntity(data);
    } catch (error) {
        console.error(error);
        throw new Error(`Error al obtener el producto con id: ${id}`);
    }

}