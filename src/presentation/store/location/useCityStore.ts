import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CityState {
  selectedCityId: string | null;
  selectedCityName: string;
  setSelectedCity: (cityId: string | null, cityName: string) => void;
  loadSelectedCity: () => Promise<void>;
}

export const useCityStore = create<CityState>()((set) => ({
  selectedCityId: null,
  selectedCityName: 'Ciudad',
  setSelectedCity: (cityId, cityName) => {
    set({ selectedCityId: cityId, selectedCityName: cityName });
    AsyncStorage.setItem('selectedCity', JSON.stringify({ cityId, cityName })).catch((error) => {
      console.error('Error al guardar la ciudad seleccionada:', error);
    });
  },
  loadSelectedCity: async () => {
    try {
      const savedCity = await AsyncStorage.getItem('selectedCity');
      if (savedCity !== null) {
        const { cityId, cityName } = JSON.parse(savedCity);
        set({ selectedCityId: cityId, selectedCityName: cityName });
      }
    } catch (error) {
      console.error('Error al cargar la ciudad seleccionada:', error);
    }
  },
}));