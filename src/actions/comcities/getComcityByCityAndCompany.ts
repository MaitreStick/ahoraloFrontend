import { pricetrackerApi } from "../../config/api/pricetrackerApi";
import { Comcity } from "../../domain/entities/comcity";
import { PricetrackerComcity } from "../../infrastructure/interfaces/pricetracker-products.response";

export const getComcityByCityAndCompany = async (companyId: string, cityId: string): Promise<Comcity> => {
  try {
    const { data } = await pricetrackerApi.get<PricetrackerComcity>(`/comcity/by-company-and-city`, {
      params: {
        companyId,
        cityId,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error obteniendo comcity por ciudad y empresa');
  }
};