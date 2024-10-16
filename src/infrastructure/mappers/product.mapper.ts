import type { Product } from "../../domain/entities/product"
import type { AhoraloProduct } from "../interfaces/ahoralo-products.response"



export class ProductMapper {

    static AhoraloProductToEntity( ahoraloProduct: AhoraloProduct): Product {
        return {
            id: ahoraloProduct.id,
            title: ahoraloProduct.title,
            slug: ahoraloProduct.slug,
            tags: ahoraloProduct.tags,
            images: ahoraloProduct.images.map( 
                image => `${ image }`
            )
        }
    }

}