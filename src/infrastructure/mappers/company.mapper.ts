import { Company } from "../../domain/entities/company"
import type { PricetrackerCompany } from "../interfaces/pricetracker-products.response"



export class CompanyMapper {

    static PricetrackerCompanyToEntity( pricetrackerCompany: PricetrackerCompany): Company {
        return {
            id: pricetrackerCompany.id,
            name: pricetrackerCompany.name
        }
    }

}