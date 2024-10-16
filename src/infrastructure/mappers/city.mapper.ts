import { City } from "../../domain/entities/city"
import type { AhoraloCity } from "../interfaces/ahoralo-products.response"



export class CityMapper {

    static AhoraloCityToEntity( ahoraloCity: AhoraloCity): City {
        return {
            id: ahoraloCity.id,
            name: ahoraloCity.name,
            nameDep: ahoraloCity.nameDep
        }
    }

}