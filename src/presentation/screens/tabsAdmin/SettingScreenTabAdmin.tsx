import { MainLayout } from '../../layouts/MainLayout';
import { useAuthStore } from '../../store/auth/useAuthStore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { SettingsSectionCard } from '../../components/settings/SettingsSectionCard';

export const SettingScreenTabAdmin = () => {
  const { user } = useAuthStore(); // Obtener el usuario autenticado
  const logout = useAuthStore((state) => state.logout);
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const handleLogout = async () => {
    await logout();
  };

  const generateReport = () => {
    navigation.navigate('AuditLogsScreen');
  };

  const handleLegalDocuments = () => {
    navigation.navigate('LegalScreen');
  };

  const handleDevelopers = () => {
    navigation.navigate('DevelopersScreen');
  };

  const settingsOptions = [
    ...(user?.roles.includes('super-user') ? [
      {
        title: 'Reporte Auditoría',
        description: 'Generar un reporte de auditoría',
        iconName: 'file-text-outline',
        onPress: generateReport,
      },
    ] : []),
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
    <MainLayout title="Más" subTitle="Panel Administrativo" showBackAction={false}>
        <SettingsSectionCard title="Configuración" options={settingsOptions} />
        <SettingsSectionCard title="Acerca de" options={aboutOptions} />
    </MainLayout>
  );
};
