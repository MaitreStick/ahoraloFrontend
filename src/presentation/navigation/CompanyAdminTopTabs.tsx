import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors } from '../../config/theme/ColorsTheme';
import { CompaniesTabScreen } from '../screens/tabsAdmin/CompaniesTabScreen';
import { WarehousesTabScreen } from '../screens/tabsAdmin/WarehousesTabScreen';



export type CompanyAdminTopTabParams = {
  CompaniesTab: undefined;
  WarehousesTab: undefined;
};

const Tab = createMaterialTopTabNavigator<CompanyAdminTopTabParams>();

export const CompanyAdminTopTabs = () => (
  <Tab.Navigator
    sceneContainerStyle={{ backgroundColor: colors.background }}
    screenOptions={{
      tabBarLabelStyle: { marginBottom: 5, fontSize: 12 },
      tabBarIndicatorStyle: { backgroundColor: colors.primary },
    }}
  >
    <Tab.Screen
      name="CompaniesTab"
      component={CompaniesTabScreen}
      options={{ title: 'Empresas' }}
    />
    <Tab.Screen
      name="WarehousesTab"
      component={WarehousesTabScreen}
      options={{ title: 'Almacenes' }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
  },
});