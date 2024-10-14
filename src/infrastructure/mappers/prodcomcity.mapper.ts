import { Prodcomcity } from "../../domain/entities/prodcomcity"
import type { PricetrackerProdcomcity} from "../interfaces/pricetracker-products.response"



export class ProdComcityMapper {

    static PricetrackerProdcomcityToEntity( pricetrackerProdcomcity: PricetrackerProdcomcity): Prodcomcity {
        return {
            id: pricetrackerProdcomcity.id,
            comcity: {
                id: pricetrackerProdcomcity.comcity.id,
                city: {
                    id: pricetrackerProdcomcity.comcity.city.id,
                    name: pricetrackerProdcomcity.comcity.city.name,
                    nameDep: pricetrackerProdcomcity.comcity.city.nameDep,
                },
                company: {
                    id: pricetrackerProdcomcity.comcity.company.id,
                    name: pricetrackerProdcomcity.comcity.company.name
                },
                user: pricetrackerProdcomcity.comcity.user,
            },
            product: {
                id: pricetrackerProdcomcity.product.id,
                title: pricetrackerProdcomcity.product.title,
                slug: pricetrackerProdcomcity.product.slug,
                tags: pricetrackerProdcomcity.product.tags,
                code: pricetrackerProdcomcity.product.code,
                images: pricetrackerProdcomcity.product.images.map(
                    image => `${ image.url }`
                )
            },
            price: pricetrackerProdcomcity.price,
            date: pricetrackerProdcomcity.date,
        }
    }

}