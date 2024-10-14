import { Comcity } from "../../domain/entities/comcity"
import type { PricetrackerComcity } from "../interfaces/pricetracker-products.response"



export class ComcityMapper {

    static PricetrackerComcityToEntity( pricetrackerComcity: PricetrackerComcity): Comcity {
        return {
            id: pricetrackerComcity.id,
            city: {
                id: pricetrackerComcity.city.id,
                name: pricetrackerComcity.city.name,
                nameDep: pricetrackerComcity.city.nameDep
            },
            company: {
                id: pricetrackerComcity.company.id,
                name: pricetrackerComcity.company.name,
            }
        }
    }

}