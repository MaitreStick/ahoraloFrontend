import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParams } from '../../navigation/StackNavigator';

export const NearLocationTab = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate('MapScreen')}>
                <Text>MapScreen</Text>
            </TouchableOpacity>
        </View>
    )
}