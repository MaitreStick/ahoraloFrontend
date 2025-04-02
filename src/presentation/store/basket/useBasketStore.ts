/* eslint-disable prettier/prettier */
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
      items: [...state.items, item],
    })),
  removeItem: itemId =>
    set(state => ({
      items: state.items.filter(item => item.product.id !== itemId),
    })),
  clearBasket: () => set({items: []}),
}));
