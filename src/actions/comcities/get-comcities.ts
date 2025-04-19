import { ahoraloApi } from '../../config/api/ahoraloApi';
export const getComcities = async () => {
  const { data } = await ahoraloApi.get('/comcities');
  return data;   // [{ id, cityName, companyName }, ...]
};