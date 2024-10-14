import { pricetrackerApi } from "../../config/api/pricetrackerApi";


export const deleteCityById = async (id: string) => {

    try {
        return await pricetrackerApi.delete(`/cities/${id}`); 
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar la ciudad con id: ${id}`);
    }

}