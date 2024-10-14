import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { City } from "../../domain/entities/city";
import { PricetrackerCity } from "../../infrastructure/interfaces/pricetracker-products.response";
import { CityMapper } from "../../infrastructure/mappers/city.mapper";

const emptyCity: City = {
    id: '',
    name: '',
    nameDep: '',
};


export const getCityById = async (cityId: string):Promise<City> => {

    if( cityId === 'new' ) return emptyCity;

    try {
        const { data } = await pricetrackerApi.get<PricetrackerCity>(`/cities/${cityId}`);

        return CityMapper.PricetrackerCityToEntity(data);
    } catch (error) {
        console.error(error);
        throw new Error(`Error al obtener la ciudad con id: ${cityId}`);
    }

}