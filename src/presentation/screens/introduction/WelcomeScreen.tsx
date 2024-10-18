import {Button, Layout, Text} from '@ui-kitten/components';
import {Image, useWindowDimensions} from 'react-native';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { colors, styles } from '../../../config/theme/ColorsTheme';


interface Props extends StackScreenProps<RootStackParams, 'WelcomeScreen'> {}

export const WelcomeScreen = ({ navigation }:Props) => {

    const { width, height } = useWindowDimensions();

    return (
        <Layout style={[styles.generalContainer]}>
            <Image
                source={ require('../../../assets/shoppingCart.png') }
                style={[styles.Image, {width: width * 0.8, height: height * 0.5}]}
            />

            <Text category="h3" style={{marginTop: height * 0.05, justifyContent: 'center', textAlign: 'center',}}>
                Nunca pagues de más otra vez!
            </Text>

            <Text category="p1" style={{marginTop: height * 0.06, textAlign: 'center'}}>
                Compra inteligente, ahorra hoy!
            </Text>

            <Button 
                accessoryRight={ <MyIcon name="arrow-forward-outline" white /> }
                style={[ styles.welcomeButton, {borderRadius: 15, backgroundColor: colors.primary, borderColor: colors.primary, marginTop: height * 0.05}]}
                onPress={() => navigation.navigate('NotificationScreen')}>
                Listo, configura, ahorra!
            </Button>
            
        </Layout>
  );
};