import {ahoraloApi} from '../../config/api/ahoraloApi';
import {Comcity} from '../../domain/entities/comcity';
import {AhoraloComcity} from '../../infrastructure/interfaces/ahoralo-products.response';

export const getComcityByCityAndCompany = async (
  companyId: string,
  cityId: string,
): Promise<Comcity> => {
  try {
    const {data} = await ahoraloApi.get<AhoraloComcity>(
      '/comcity/by-company-and-city',
      {
        params: {
          companyId,
          cityId,
        },
      },
    );
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error obteniendo comcity por ciudad y empresa');
  }
};
