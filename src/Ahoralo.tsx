import 'react-native-gesture-handler';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './presentation/navigation/StackNavigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from './presentation/store/auth/useAuthStore';
import { checkOnboardingStatus } from './presentation/helpers/checkOnboardingStatus';
import { ActivityIndicator, View } from 'react-native';
import { useOnboardingStore } from './presentation/store/onboarding/useOnboardingStore';
import { PermissionsChecker } from './providers/PermissionChecker';

import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
});

const queryClient = new QueryClient();

export const Ahoralo = () => {
  const { status, checkStatus } = useAuthStore();
  const { hasCompletedOnboarding, setHasCompletedOnboarding } = useOnboardingStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await checkStatus();
      const completed = await checkOnboardingStatus();
      setHasCompletedOnboarding(completed);
      setLoading(false);
    };
    initializeApp();
  }, []);

  if (loading || status === 'checking' || hasCompletedOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <PermissionsChecker>
            <StackNavigator />
          </PermissionsChecker>
        </NavigationContainer>
      </ApplicationProvider>
    </QueryClientProvider>
  );
};