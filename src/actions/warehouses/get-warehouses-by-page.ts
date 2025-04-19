// src/actions/warehouses/get-warehouses-by-page.ts
import { ahoraloApi } from '../../config/api/ahoraloApi';
import { Warehouse } from '../../domain/entities/warehouse';

export const getWarehousesByPage = async (page: number): Promise<Warehouse[]> => {
  const { data } = await ahoraloApi.get(`/warehouses?page=${page}`);
  return data; // Ajusta a tu esquema (skip/limit) si es necesario.
};