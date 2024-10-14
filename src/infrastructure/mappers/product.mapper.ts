import { Prodcomcity } from "../../domain/entities/prodcomcity"
import type { Product } from "../../domain/entities/product"
import type { PricetrackerProdcomcity, PricetrackerProduct } from "../interfaces/pricetracker-products.response"



export class ProductMapper {

    static PricetrackerProductToEntity( pricetrackerProduct: PricetrackerProduct): Product {
        return {
            id: pricetrackerProduct.id,
            title: pricetrackerProduct.title,
            slug: pricetrackerProduct.slug,
            tags: pricetrackerProduct.tags,
            images: pricetrackerProduct.images.map( 
                image => `${ image }`
            )
        }
    }

}