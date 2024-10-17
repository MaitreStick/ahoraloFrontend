import { StackCardStyleInterpolator, createStackNavigator } from '@react-navigation/stack';
import { LoadingScreen } from '../screens/loading/LoadingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ProductScreenAdmin } from '../screens/product/ProductScreenAdmin';
import { WelcomeScreen } from '../screens/introduction/WelcomeScreen';
import { NotificationScreen } from '../screens/introduction/NotificationScreen';
import { CityScreenAdmin } from '../screens/city/CityScreenAdmin';
import { CompanyScreenAdmin } from '../screens/company/CompanyScreenAdmin';
import { BottomTabNavigator } from './BottomTabNavigator';
import { useAuthStore } from '../store/auth/useAuthStore';
import { useEffect, useState } from 'react';
import { checkOnboardingStatus } from '../helpers/checkOnboardingStatus';
import { useOnboardingStore } from '../store/onboarding/useOnboardingStore';
import { ProfileScreen } from '../screens/settings/ProfileScreen';
import { DevelopersScreen } from '../screens/developers/DevelopersScreen';
import { ComingSoonScreen } from '../components/ui/ComingSoonScreen';
import { ProductScreen } from '../screens/product/ProductScreen';
import { OcrScreen } from '../screens/ocr/OcrScreen';
import { ActivityIndicator, View } from 'react-native';

export type RootStackParams = {
  LoadingScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
  BottomTabNavigator: undefined;
  WelcomeScreen: undefined;
  NotificationScreen: undefined;
  ProductScreenAdmin: { productId: string, comcityId: string };
  ProductScreen: { productId: string, comcityId: string };
  CityScreenAdmin: { cityId: string };
  CompanyScreenAdmin: { companyId: string };
  ProfileScreen: undefined;
  DevelopersScreen: undefined;
  ComingSoonScreen: undefined;
  OcrScreen: { picture: string[], selectedCityId: string, selectedCityName: string };
};

const Stack = createStackNavigator<RootStackParams>();

const fadeAnimation: StackCardStyleInterpolator = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};

export const StackNavigator = () => {
  const { status, user } = useAuthStore();
  const { hasCompletedOnboarding } = useOnboardingStore();

  console.log('Status:', status);
  console.log('User:', user);

  if (hasCompletedOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: fadeAnimation,
      }}
    >
      {hasCompletedOnboarding === false ? (
        // Mostrar el flujo de onboarding
        <>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      ) : status === 'authenticated' ? (
        user &&
          user.roles &&
          (user.roles.includes('admin') || user.roles.includes('super-user')) ? (
          // Rutas para administradores
          <>
            <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
            <Stack.Screen name="ProductScreenAdmin" component={ProductScreenAdmin} />
            <Stack.Screen name="CityScreenAdmin" component={CityScreenAdmin} />
            <Stack.Screen name="CompanyScreenAdmin" component={CompanyScreenAdmin} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="DevelopersScreen" component={DevelopersScreen} />
            <Stack.Screen name="ComingSoonScreen" component={ComingSoonScreen} />
          </>
        ) : (
          // Rutas para usuarios regulares
          <>
            <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
            <Stack.Screen name="ProductScreen" component={ProductScreen} />
            <Stack.Screen name="DevelopersScreen" component={DevelopersScreen} />
            <Stack.Screen name="ComingSoonScreen" component={ComingSoonScreen} />
            <Stack.Screen name="OcrScreen" component={OcrScreen} />
          </>
        )
      ) : (
        // Usuario no autenticado
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};