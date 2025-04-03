/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Button, Input, Layout, Text} from '@ui-kitten/components';
import {Image, useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {MyIcon} from '../../components/ui/MyIcon';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';

import {useState} from 'react';
import {useAuthStore} from '../../store/auth/useAuthStore';
import {colors, styles} from '../../../config/theme/ColorsTheme';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}

import {GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID} from '@env';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {CustomAlert} from '../../components/ui/CustomAlert';
import {Toast} from '../../components/ui/Toast';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
});

const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

export const LoginScreen = ({navigation}: Props) => {
  const {login, loginWithGoogle} = useAuthStore();
  const [isPosting, setIsPosting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const {width, height} = useWindowDimensions();

  const showToast = () => {
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const onLogin = async () => {
    if (form.email.length === 0 || form.password.length === 0) {
      setAlertTitle('Inicio de sesión fallido');
      setAlertMessage('Por favor, completa todos los campos.');
      setAlertVisible(true);
      return;
    }
    setIsPosting(true);
    const wasSuccessful = await login(form.email, form.password);
    setIsPosting(false);

    if (wasSuccessful) {
      showToast();
    } else {
      setAlertTitle('Inicio de sesión fallido');
      setAlertMessage('Usuario o contraseña incorrectos');
      setAlertVisible(true);
      return;
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsPosting(true);
    setLoading(true);
    try {
      const response = await GoogleLogin();
      if (response.idToken) {
        const {idToken, user} = response;
        const success = await loginWithGoogle(idToken, user.email, user.name);
        if (success) {
          showToast();
          return;
        }
      }
    } catch (error) {
      console.log(error);
      setAlertTitle('Inicio de sesión fallido');
      setAlertMessage('No fue posible iniciar sesión con Google');
      setAlertVisible(true);
    } finally {
      setLoading(false);
      setIsPosting(false);
    }
  };

  return (
    <Layout style={[styles.generalContainer]}>
      <ScrollView style={[styles.scrollView]}>
        <Layout style={[styles.background, {paddingTop: height * 0.06}]}>
          <Layout style={[styles.layoutTitle]}>
            <Text category="h1">Ahoralo</Text>
          </Layout>
          <Image
            source={require('../../../assets/CartMan.png')}
            style={[styles.Image, {width: width * 0.6, height: height * 0.35}]}
          />
          <Text category="h1">Ingresar</Text>
          <Text category="p2">Por favor, ingrese para continuar</Text>
        </Layout>

        <Layout style={[styles.layoutForm]}>
          <Input
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={email => setForm({...form, email})}
            accessoryLeft={<MyIcon name="email-outline" />}
            style={[styles.input]}
          />

          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            secureTextEntry
            value={form.password}
            onChangeText={password => setForm({...form, password})}
            accessoryLeft={<MyIcon name="lock-outline" />}
            style={[styles.input]}
          />
        </Layout>

        <Layout style={[styles.layoutSpace]} />

        <Layout style={[styles.generalContainer]}>
          <Button
            disabled={isPosting}
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            style={{
              borderRadius: 15,
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
            onPress={onLogin}
          >
            Ingresar
          </Button>
          <Layout
            style={[
              styles.background,
              {
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingTop: 10,
              },
            ]}
          >
            <Button
              disabled={isPosting}
              accessoryRight={<MyIcon name="google" white />}
              style={{
                flex: 1,
                borderRadius: 15,
                backgroundColor: '#0F172A',
                borderColor: '#0F172A',
              }}
              onPress={handleGoogleLogin}
            >
              Ingresar con Google
            </Button>
          </Layout>
        </Layout>

        <Layout style={[styles.informationText, {height: height * 0.02}]} />

        <Layout style={[styles.layoutQuestion]}>
          <Text>¿No tienes cuenta?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => navigation.navigate('RegisterScreen')}
          >
            {' '}
            crea una{' '}
          </Text>
        </Layout>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        confirmText="Aceptar"
      />

      <Toast
        visible={toastVisible}
        message="Inicio de sesión exitoso"
        onHide={hideToast}
      />
    </Layout>
  );
};
