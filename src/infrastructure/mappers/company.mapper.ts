import { Company } from "../../domain/entities/company"
import type { AhoraloCompany } from "../interfaces/ahoralo-products.response"



export class CompanyMapper {

    static AhoraloCompanyToEntity( ahoraloCompany: AhoraloCompany): Company {
        return {
            id: ahoraloCompany.id,
            name: ahoraloCompany.name
        }
    }

}