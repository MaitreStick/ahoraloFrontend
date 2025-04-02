/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
/* eslint-disable react/react-in-jsx-scope */
import { Input, Layout, Text } from '@ui-kitten/components';
import { Alert, Animated, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { MainLayout } from '../../layouts/MainLayout';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Formik } from 'formik';
import { FAB } from '../../components/ui/FAB';
import { useNavigation } from '@react-navigation/native';
import { getCompanyById } from '../../../actions/companies/get-company-by-id';
import { Company } from '../../../domain/entities/company';
import { updateCreateCompany } from '../../../actions/companies/update-create-company';
import { deleteCompanyById } from '../../../actions/companies/delete-company';
import { CustomAlert } from '../../components/ui/CustomAlert';
import { Toast } from '../../components/ui/Toast';

interface Props extends StackScreenProps<RootStackParams, 'CompanyScreenAdmin'> { }

export const CompanyScreenAdmin = ({ route }: Props) => {
  const companyIdRef = useRef(route.params.companyId);
  const queryClient = useQueryClient();
  const { height } = Dimensions.get('window');
  const [toastVisible, setToastVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();

  const [isFabOpen, setIsFabOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const isNewCompany = companyIdRef.current === 'new';

  const showToast = () => {
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const { data: company } = useQuery({
    queryKey: ['company', companyIdRef.current],
    queryFn: () => getCompanyById(companyIdRef.current)
  });

  const mutation = useMutation({
    mutationFn: (data: Company) => updateCreateCompany({
      ...data,
      id: companyIdRef.current,
    }),
    onSuccess: (data: Company) => {

      try {
        showToast();

        queryClient.invalidateQueries({
          queryKey: ['companies', 'infinite'],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ['company', data.id]
        });

      } catch (error) {
        console.error('Error in onSuccess handler:', error);
      }

    },
    onError: () => {
      setAlertTitle('Error');
      setAlertMessage('No se pudo guardar la empresa. Inténtalo de nuevo.');
      setAlertVisible(true);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCompanyById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['companies', 'infinite'],
        exact: false,
      });
      navigation.goBack();
    },
    onError: (error: any) => {
      console.error('Error al eliminar el producto:', error);
      setAlertTitle('Error');
      setAlertMessage('No se pudo eliminar la empresa. Inténtalo de nuevo.');
      setAlertVisible(true);
    },
  });

  if (!company) {
    return (
      <MainLayout title="Empresa">
        <Text>Parece que no se encontró ninguna empresa...</Text>
      </MainLayout>
    );
  }

  const toggleFab = () => {
    Animated.timing(animatedValue, {
      toValue: isFabOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsFabOpen(!isFabOpen);
  };

  const fabDeleteStyle = {
    bottom: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [height * 0.18, height * 0.2],
    }),
    opacity: animatedValue,
  };

  const saveButtonOutputRange = isNewCompany
    ? [height * 0.18, height * 0.2]
    : [height * 0.18, height * 0.28];

  const fabSaveStyle = {
    bottom: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: saveButtonOutputRange,
    }),
    opacity: animatedValue,
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta ciudad?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteMutation.mutate(company.id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <Formik
      initialValues={company}
      onSubmit={mutation.mutate}
    >
      {({ handleChange, handleSubmit, values }) => (
        <MainLayout
          title={`${values.name}`}
          subTitle="Empresa"
        >
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <Layout style={{ marginVertical: 5, marginHorizontal: 10 }}>
              <Input
                label="Empresa"
                value={values.name}
                onChangeText={handleChange('name')}
                style={{ marginVertical: 5 }}
              />
            </Layout>
            <Layout style={{ height: 200 }} />
          </ScrollView>

          <FAB
            iconName={isFabOpen ? 'close-outline' : 'plus-outline'}
            onPress={toggleFab}
            style={[styles.fabMain, { bottom: height * 0.05 }]}
          />

          <Animated.View style={[fabSaveStyle]}>
            <FAB
              iconName="save-outline"
              style={[styles.fabSave]}
              onPress={() => handleSubmit()}
              disabled={mutation.isPending}
            />
          </Animated.View>

          {!isNewCompany && (
            <Animated.View style={[fabDeleteStyle]}>
              <FAB
                iconName="trash-outline"
                style={[styles.fabDelete]}
                onPress={handleDelete}
                disabled={deleteMutation.isPending}
              />
            </Animated.View>
          )}
          <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onConfirm={handleAlertConfirm}
            confirmText="Aceptar"
          />
          <Toast
            visible={toastVisible}
            message="Proceso Exitoso"
            onHide={hideToast}
          />
        </MainLayout>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  fabMain: {
    position: 'absolute',
    right: 20,
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
  fabSave: {
    position: 'absolute',
    right: 20,
    borderColor: '#6dab6d',
    backgroundColor: '#6dab6d',
  },
  fabDelete: {
    position: 'absolute',
    right: 20,
    borderColor: '#de3737',
    backgroundColor: '#de3737',
  },
});
