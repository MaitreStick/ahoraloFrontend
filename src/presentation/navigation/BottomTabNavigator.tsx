import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CityScreenTabAdmin } from '../screens/tabsAdmin/CityScreenTabAdmin';
import { CompanyScreenTabAdmin } from '../screens/tabsAdmin/CompanyScreenTabAdmin';
import { HomeScreenTabAdmin } from '../screens/tabsAdmin/HomeScreenTabAdmin';
import { colors } from '../../config/theme/ColorsTheme';
import { MyIcon } from '../components/ui/MyIcon';
import { SettingScreenTabAdmin } from '../screens/tabsAdmin/SettingScreenTabAdmin';
import { useAuthStore } from '../store/auth/useAuthStore';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '../screens/loading/LoadingScreen';
import { HomeScreenTab } from '../screens/tabs/HomeScreenTab';
import { SettingScreenTab } from '../screens/tabs/SettingsScreenTab';
import { BasketScreenTab } from '../screens/tabs/BasketScreenTab';

export type RootTabParams = {
  HomeScreenTabAdmin: undefined;
  CityScreenTabAdmin: undefined;
  CompanyScreenTabAdmin: undefined;
  SettingsScreenTabAdmin: undefined;
  HomeScreenTab: undefined;
  SettingsScreenTab: undefined;
  BasketScreenTab: undefined;
};

const Tab = createBottomTabNavigator<RootTabParams>();

export const BottomTabNavigator = () => {

  const { checkStatus, status, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStatus();
    setIsLoading(false);
  }, []);

  if (isLoading || status === 'checking' || (status === 'authenticated' && !user)) {
    return <LoadingScreen/>; 
  }



  return (
    <Tab.Navigator
    sceneContainerStyle={{backgroundColor: colors.background}}
    screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
            marginBottom: 5,
            fontSize: 12,
        },
    }}
    >
     {user && user.roles && (user.roles.includes('admin') || user.roles.includes('super-user')) ? (
        // Tabs para administradores
        <>
          <Tab.Screen
            name="HomeScreenTabAdmin"
            options={{
              title: 'Productos',
              tabBarIcon: () => <MyIcon name="cube-outline" />,
            }}
            component={HomeScreenTabAdmin}
          />
          <Tab.Screen
            name="CityScreenTabAdmin"
            options={{
              title: 'Ciudades',
              tabBarIcon: () => <MyIcon name="map-outline" />,
            }}
            component={CityScreenTabAdmin}
          />
          <Tab.Screen
            name="CompanyScreenTabAdmin"
            options={{
              title: 'Empresas',
              tabBarIcon: () => <MyIcon name="briefcase-outline" />,
            }}
            component={CompanyScreenTabAdmin}
          />
          <Tab.Screen
            name="SettingsScreenTabAdmin"
            options={{
              title: 'Configuración',
              tabBarIcon: () => <MyIcon name="settings-outline" />,
            }}
            component={SettingScreenTabAdmin}
          />
        </>
      ) : (
        // Tabs para usuarios regulares
        <>
          <Tab.Screen
            name="HomeScreenTab"
            options={{
              title: 'Inicio',
              tabBarIcon: () => <MyIcon name="home-outline" />,
            }}
            component={HomeScreenTab}
          />
          <Tab.Screen
            name="BasketScreenTab"
            options={{
              title: 'Canasta',
              tabBarIcon: () => <MyIcon name="shopping-bag-outline" />,
            }}
            component={BasketScreenTab}
          />
          <Tab.Screen
            name="SettingsScreenTab"
            options={{
              title: 'Configuración',
              tabBarIcon: () => <MyIcon name="settings-outline" />,
            }}
            component={SettingScreenTab}
          />
        </>
      )}
    </Tab.Navigator>
  );
}