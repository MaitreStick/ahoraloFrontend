import {isAxiosError} from 'axios';
import {ahoraloApi} from '../../config/api/ahoraloApi';
import {City} from '../../domain/entities/city';

export const updateCreateCity = async (city: Partial<City>) => {
  try {
    if (city.id && city.id !== 'new') {
      return await updateCity(city);
    }
    return await createCity(city);
  } catch (error) {
    console.error('Error en updateCreateCity:', error);
    throw error;
  }
};

const updateCity = async (city: Partial<City>) => {
  const {id, ...rest} = city;

  try {
    const {data} = await ahoraloApi.patch(`/cities/${id}`, {
      ...rest,
    });
    return data.city;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
    }
    throw new Error('Error al actualizar la ciudad');
  }
};

const createCity = async (city: Partial<City>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {id, ...rest} = city;

  try {
    const {data} = await ahoraloApi.post('/cities', {
      ...rest,
    });

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
    }
    throw new Error('Error al crear la ciudad');
  }
};
