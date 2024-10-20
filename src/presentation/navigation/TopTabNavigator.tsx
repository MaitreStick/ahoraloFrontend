import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ProductInformationTab } from '../screens/tabs/ProductInformationTab';
import { LowestPriceTab } from '../screens/tabs/LowestPriceTab';
import { NearLocationTab } from '../screens/tabs/NearLocationTab';
import { colors } from '../../config/theme/ColorsTheme';
import { Prodcomcity } from '../../domain/entities/prodcomcity';

export type RootTopTabParams = {
    ProductInformationTab: { prodcomcity: Prodcomcity };
    LowestPriceTab: undefined;
    NearLocationTab: undefined;
};
interface TopTabNavigatorProps {
    prodcomcity: Prodcomcity;
}



const Tab = createMaterialTopTabNavigator<RootTopTabParams>();



export const TopTabNavigator = ({ prodcomcity }: TopTabNavigatorProps) => {
    return (
        <Tab.Navigator
            sceneContainerStyle={{ backgroundColor: colors.background }}
            screenOptions={{
                tabBarLabelStyle: {
                    marginBottom: 5,
                    fontSize: 12,
                },
            }}
        >
            <Tab.Screen
                name="ProductInformationTab"
                options={{
                    title: 'Información',
                }}
                children={() => <ProductInformationTab prodcomcity={prodcomcity} />}
            />
            <Tab.Screen
                name="LowestPriceTab"
                options={{
                    title: 'Precio más bajo',
                }}
                children={() => <LowestPriceTab prodcomcity={prodcomcity} />}
            />
            <Tab.Screen
                name="NearLocationTab"
                options={{
                    title: 'Lugar más cercano',
                }}
            children={() => <NearLocationTab/>}
            />
        </Tab.Navigator>
    );
}