import { isAxiosError } from 'axios';
import { ahoraloApi } from '../../config/api/ahoraloApi';
import { Comcity } from '../../domain/entities/comcity';

const NEW_ID = 'new';

export const updateCreateComcity = (comcity: Partial<Comcity>) => {
  const isUpdate = comcity.id && comcity.id !== NEW_ID;
  return isUpdate ? updateComcity(comcity) : createComcity(comcity);
};

const updateComcity = async (comcity: Partial<Comcity>) => {
  const { id } = comcity;
  try {
    const dto = buildDto(comcity);
    const { data } = await ahoraloApi.patch(`/comcity/${id}`, dto);
    return data;                       // ← vuelve el Comcity actualizado
  } catch (error) {
    handleAxiosError(error, 'Error al actualizar la relación ciudad‑empresa');
  }
};

const createComcity = async (comcity: Partial<Comcity>) => {
  try {
    const dto = buildDto(comcity);
    const { data } = await ahoraloApi.post('/comcity', dto);
    return data;                       // ← vuelve el Comcity recién creado
  } catch (error) {
    handleAxiosError(error, 'Error al crear la relación ciudad‑empresa');
  }
};

const buildDto = (c: Partial<Comcity>) => ({
  city:    typeof c.city    === 'string' ? c.city    : c.city?.id,
  company: typeof c.company === 'string' ? c.company : c.company?.id,
});

const handleAxiosError = (error: unknown, defaultMsg: string): never => {
  if (isAxiosError(error)) {
    console.log('Status:', error.response?.status);
    console.log('Response:', error.response?.data);
  }
  throw new Error(defaultMsg);
};