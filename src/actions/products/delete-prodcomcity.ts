import { pricetrackerApi } from "../../config/api/pricetrackerApi";


export const deleteProdcomcityById = async (id: string) => {

    try {
        return await pricetrackerApi.delete(`/prodcomcity/${id}`); 
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar el producto con id: ${id}`);
    }

}