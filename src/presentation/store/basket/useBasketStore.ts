import {create} from 'zustand';
import {Prodcomcity} from '../../../domain/entities/prodcomcity';

interface BasketState {
  items: Prodcomcity[];
  addItem: (item: Prodcomcity) => void;
  removeItem: (itemId: string) => void;
  clearBasket: () => void;
}

export const useBasketStore = create<BasketState>()(set => ({
  items: [],
  addItem: item =>
    set(state => ({
      // Agregamos un nuevo item al arreglo
      items: [...state.items, item],
    })),
  removeItem: itemId =>
    set(state => {
      // Encontrar el índice de la primera ocurrencia
      const foundIndex = state.items.findIndex(
        item => item.product.id === itemId,
      );

      // Si no se encontró, no hacemos nada
      if (foundIndex === -1) {
        return state;
      }

      // Creamos una copia del array para no mutar el estado directamente
      const newItems = [...state.items];
      newItems.splice(foundIndex, 1); // eliminamos solo el item encontrado

      return {items: newItems};
    }),
  clearBasket: () => set({items: []}),
}));