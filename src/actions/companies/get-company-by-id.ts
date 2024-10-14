import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { Company } from "../../domain/entities/company";
import { PricetrackerCompany } from "../../infrastructure/interfaces/pricetracker-products.response";
import { CompanyMapper } from "../../infrastructure/mappers/company.mapper";

const emptyCompany: Company = {
    id: '',
    name: ''
};


export const getCompanyById = async (companyId: string):Promise<Company> => {

    if( companyId === 'new' ) return emptyCompany;

    try {
        const { data } = await pricetrackerApi.get<PricetrackerCompany>(`/companies/${companyId}`);
        return CompanyMapper.PricetrackerCompanyToEntity(data);
    } catch (error) {
        console.error(error);
        throw new Error(`Error al obtener la empresa con id: ${companyId}`);
    }

}