import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { City } from "../../domain/entities/city";
import type { PricetrackerCity } from "../../infrastructure/interfaces/pricetracker-products.response";
import { CityMapper } from "../../infrastructure/mappers/city.mapper";




export const getCitiesByPage = async (page: number, limit: number = 20): Promise<City[]> => {

    try {
        
        const { data } = await pricetrackerApi.get<PricetrackerCity[]>(`/cities?offset=${ page * 10 }&limit=${limit}`);

        const cities = data.map( CityMapper.PricetrackerCityToEntity );
        return cities;

    } catch (error) {
        console.log(error);
        throw new Error('Error getting cities');
    }
}