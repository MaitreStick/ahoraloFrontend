import { pricetrackerApi } from "../../config/api/pricetrackerApi";


export const deleteCompanyById = async (id: string) => {

    try {
        return await pricetrackerApi.delete(`/companies/${id}`); 
    } catch (error) {
        console.error(error);
        throw new Error(`Error al eliminar la empresa con id: ${id}`);
    }

}