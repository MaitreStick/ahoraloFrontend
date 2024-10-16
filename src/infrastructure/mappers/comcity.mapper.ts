import { Comcity } from "../../domain/entities/comcity"
import type { AhoraloComcity } from "../interfaces/ahoralo-products.response"



export class ComcityMapper {

    static AhoraloComcityToEntity( ahoraloComcity: AhoraloComcity): Comcity {
        return {
            id: ahoraloComcity.id,
            city: {
                id: ahoraloComcity.city.id,
                name: ahoraloComcity.city.name,
                nameDep: ahoraloComcity.city.nameDep
            },
            company: {
                id: ahoraloComcity.company.id,
                name: ahoraloComcity.company.name,
            }
        }
    }

}