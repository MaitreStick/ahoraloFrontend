import { MainLayout } from '../../layouts/MainLayout';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { SettingsSectionCard } from '../../components/settings/SettingsSectionCard';

export const SettingScreenTab = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const handleLogout = async () => {
    await logout();
  };

  const handleProfile = () => {
    navigation.navigate('ComingSoonScreen');
  };

  const handleSuggestProduct = () => {
    navigation.navigate('ComingSoonScreen');
  };

  const handleSuggestCity = () => {
    navigation.navigate('ComingSoonScreen');
  };

  const handleSuggestCompany = () => {
    navigation.navigate('ComingSoonScreen');
  };  

  const handleLegalDocuments = () => {
    navigation.navigate('ComingSoonScreen');
  };

  const handleDevelopers = () => {
    navigation.navigate('DevelopersScreen');
  };

  const settingsOptions = [
    {
      title: 'Perfil',
      description: 'Ver y editar tu perfil',
      iconName: 'person-outline',
      onPress: handleProfile,
    },
    {
      title: 'Sugerir Producto',
      description: 'Sugerir un producto para agregar',
      iconName: 'cube-outline',
      onPress: handleSuggestProduct,
    },
    {
      title: 'Sugerir Ciudad',
      description: 'Sugerir una ciudad para agregar',
      iconName: 'map-outline',
      onPress: handleSuggestCity,
    },
    {
      title: 'Sugerir Comercio',
      description: 'Sugerir un comercio para agregar',
      iconName: 'briefcase-outline',
      onPress: handleSuggestCompany,
    },
    {
      title: 'Cerrar Sesión',
      description: 'Salir de tu cuenta',
      iconName: 'log-out-outline',
      onPress: handleLogout,
    },
  ];

  const aboutOptions = [
    {
      title: 'Documentos Legales',
      description: 'Términos y condiciones',
      iconName: 'file-text-outline',
      onPress: handleLegalDocuments,
    },
    {
      title: 'Desarrolladores',
      description: 'Información sobre los desarrolladores',
      iconName: 'code-outline',
      onPress: handleDevelopers,
    },
  ];

  return (
    <MainLayout title="Más" showBackAction={false}>
        <SettingsSectionCard title="Configuración" options={settingsOptions} />
        <SettingsSectionCard title="Acerca de" options={aboutOptions} />
    </MainLayout>
  );
};
