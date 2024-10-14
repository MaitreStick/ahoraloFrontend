import { City } from "../../domain/entities/city"
import type { PricetrackerCity } from "../interfaces/pricetracker-products.response"



export class CityMapper {

    static PricetrackerCityToEntity( pricetrackerCity: PricetrackerCity): City {
        return {
            id: pricetrackerCity.id,
            name: pricetrackerCity.name,
            nameDep: pricetrackerCity.nameDep
        }
    }

}