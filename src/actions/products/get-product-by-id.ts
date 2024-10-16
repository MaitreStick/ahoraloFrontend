import { ahoraloApi } from "../../config/api/ahoraloApi";
import { Product } from "../../domain/entities/product";
import { AhoraloProduct } from "../../infrastructure/interfaces/ahoralo-products.response";
import { ProductMapper } from "../../infrastructure/mappers/product.mapper";




export const getProductById = async (id: string):Promise<Product> => {

    try {
        const { data } = await ahoraloApi.get<AhoraloProduct>(`/products/${id}`);

        return ProductMapper.AhoraloProductToEntity(data);
    } catch (error) {
        console.error(error);
        throw new Error(`Error al obtener el producto con id: ${id}`);
    }

}