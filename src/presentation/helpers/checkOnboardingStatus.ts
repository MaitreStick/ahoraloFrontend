import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkOnboardingStatus = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem('@onboarding_completed');
    return value === 'true';
  } catch (e) {
    console.error('Error al obtener el estado de onboarding:', e);
    return false;
  }
};