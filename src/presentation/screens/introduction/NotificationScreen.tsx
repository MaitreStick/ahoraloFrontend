/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Button, Layout, Text} from '@ui-kitten/components';
import {Image, useWindowDimensions} from 'react-native';
import {MyIcon} from '../../components/ui/MyIcon';
import {RootStackParams} from '../../navigation/StackNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import {colors, styles} from '../../../config/theme/ColorsTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useOnboardingStore} from '../../store/onboarding/useOnboardingStore';

interface Props
  extends StackScreenProps<RootStackParams, 'NotificationScreen'> {}

export const NotificationScreen = ({navigation}: Props) => {
  const {width, height} = useWindowDimensions();
  const setHasCompletedOnboarding = useOnboardingStore(
    (state: any) => state.setHasCompletedOnboarding,
  );

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      setHasCompletedOnboarding(true);

      navigation.replace('LoginScreen');
    } catch (e) {
      console.error('Error al establecer el estado de onboarding:', e);
    }
  };

  return (
    <Layout style={[styles.generalContainer]}>
      <Image
        source={require('../../../assets/discount.png')}
        style={[
          styles.Image,
          {width: width * 0.8, height: height * 0.48, padding: height * 0.2},
        ]}
      />

      <Text
        category="h4"
        style={{
          marginTop: height * 0.01,
          padding: width * 0.03,
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        Te enviaremos descuentos y noticias sobre Ahoralo
      </Text>

      <Text
        category="p1"
        style={{marginTop: height * 0.07, textAlign: 'center'}}
      >
        Permitenos enviarte notificaciones
      </Text>

      <Button
        accessoryRight={<MyIcon name="bell-outline" white />}
        style={[
          styles.welcomeButton,
          {
            borderRadius: 15,
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            marginTop: height * 0.05,
          },
        ]}
        onPress={completeOnboarding}
      >
        Permitir notificaciones
      </Button>
      <Text
        status="primary"
        category="s1"
        style={{textAlign: 'center', marginTop: height * 0.02}}
        onPress={completeOnboarding}
      >
        {' '}
        No, gracias{' '}
      </Text>
    </Layout>
  );
};
