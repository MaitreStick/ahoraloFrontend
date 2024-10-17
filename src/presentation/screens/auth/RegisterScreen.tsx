import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Alert, Image, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MyIcon } from '../../components/ui/MyIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { useState } from 'react';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { colors, styles } from '../../../config/theme/ColorsTheme';
import { Toast } from '../../components/ui/Toast';
import { CustomAlert } from '../../components/ui/CustomAlert';


interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> { }

export const RegisterScreen = ({ navigation }: Props) => {

  const { register } = useAuthStore();
  const [isPosting, setIsPosting] = useState(false)
  const [toastVisible, setToastVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const { width, height } = useWindowDimensions();

  const showToast = () => {
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const onRegister = async () => {
    if (form.email.length === 0 || form.password.length === 0 || form.fullName.length === 0) {
      setAlertTitle('Error');
      setAlertMessage('Por favor, completa todos los campos.');
      setAlertVisible(true);
      return;
    }
    setIsPosting(true);
    const wasSuccessful = await register(form.email, form.password, form.fullName);
    setIsPosting(false);

    if (wasSuccessful) {
      showToast();
      setTimeout(() => {
        navigation.replace('LoginScreen');
      }, 2000);
      return;
    }

    setAlertTitle('Error');
    setAlertMessage('Por favor, verifica los campos ingresados.');
    setAlertVisible(true);
  }

  return (
    <Layout style={[styles.generalContainer]}>
      <ScrollView style={[styles.scrollView]}>
        {/* Image */}
        <Layout style={[styles.background, { paddingTop: height * 0.06 }]}>
          <Image
            source={require('../../../assets/Register.png')}
            style={[styles.Image, { width: width * 0.6, height: height * 0.35 }]}
          />
          <Text category="h1">Crear cuenta</Text>
          <Text category="p2">Por favor, crea una cuenta para continuar</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={[styles.layoutForm]}>
          <Input
            placeholder="Nombre completo"
            value={form.fullName}
            onChangeText={(fullName) => setForm({ ...form, fullName })}
            accessoryLeft={<MyIcon name="person-outline" />}
            style={[styles.input]}
          />
          <Input
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(email) => setForm({ ...form, email })}
            accessoryLeft={<MyIcon name="email-outline" />}
            style={[styles.input]}
          />

          <Input
            placeholder="Contraseña"
            autoCapitalize="none"
            secureTextEntry
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            accessoryLeft={<MyIcon name="lock-outline" />}
            style={[styles.input]}
          />
        </Layout>

        {/* Space */}
        <Layout style={[styles.layoutSpace]} />

        {/* Button */}
        <Layout style={[styles.generalContainer]}>
          <Button
            disabled={isPosting}
            accessoryRight={<MyIcon name="arrow-forward-outline" white />}
            style={{ borderRadius: 15, backgroundColor: colors.primary, borderColor: colors.primary }}
            onPress={onRegister}>Crear</Button>
        </Layout>

        {/* Information to log in */}
        <Layout style={[styles.informationText, {height: height * 0.02}]} />

        <Layout style={[styles.layoutQuestion]} >
          <Text>¿Ya tienes cuenta?</Text>
          <Text
            status="primary"
            category="s1"
            onPress={() => navigation.goBack()}
          >
            {' '}
            ingresar{' '}
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
        message="Registro exitoso"
        onHide={hideToast}
      />
    </Layout>
  );
};