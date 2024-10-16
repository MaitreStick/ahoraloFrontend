import { ahoraloApi } from "../../config/api/ahoraloApi";
import { City } from "../../domain/entities/city";
import { AhoraloCity } from "../../infrastructure/interfaces/ahoralo-products.response";
import { CityMapper } from "../../infrastructure/mappers/city.mapper";

const emptyCity: City = {
    id: '',
    name: '',
    nameDep: '',
};


export const getCityById = async (cityId: string):Promise<City> => {

    if( cityId === 'new' ) return emptyCity;

    try {
        const { data } = await ahoraloApi.get<AhoraloCity>(`/cities/${cityId}`);

        return CityMapper.AhoraloCityToEntity(data);
    } catch (error) {
        console.error(error);
        throw new Error(`Error al obtener la ciudad con id: ${cityId}`);
    }

}