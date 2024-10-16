import { ahoraloApi } from "../../config/api/ahoraloApi";


export const deleteCityById = async (id: string) => {

    try {
        return await ahoraloApi.delete(`/cities/${id}`); 
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar la ciudad con id: ${id}`);
    }

}