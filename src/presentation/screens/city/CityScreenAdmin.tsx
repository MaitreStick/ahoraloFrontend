import { Input, Layout, Text } from '@ui-kitten/components';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MainLayout } from '../../layouts/MainLayout';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import {
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { getCityById } from '../../../actions/cities/get-city-by-id';
import { useRef, useState } from 'react';
import { Formik } from 'formik';
import { City } from '../../../domain/entities/city';
import { updateCreateCity } from '../../../actions/cities/update-create-city';
import { FAB } from '../../components/ui/FAB';
import { useNavigation } from '@react-navigation/native';
import { deleteCityById } from '../../../actions/cities/delete-city';
import { CustomAlert } from '../../components/ui/CustomAlert';
import { Toast } from '../../components/ui/Toast';

interface Props extends StackScreenProps<RootStackParams, 'CityScreenAdmin'> {}

export const CityScreenAdmin = ({ route }: Props) => {
  const cityIdRef = useRef(route.params.cityId);
  const queryClient = useQueryClient();
  const { height } = Dimensions.get('window');
  const [toastVisible, setToastVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();

  const [isFabOpen, setIsFabOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const isNewCity = cityIdRef.current === 'new';

  const allCitiesData = queryClient.getQueryData([
    'cities',
    'infinite',
  ]) as InfiniteData<City[]> | undefined;

  const allCities = allCitiesData?.pages.flat() ?? [];

  const showToast = () => {
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const { data: city } = useQuery({
    queryKey: ['city', cityIdRef.current],
    queryFn: () => getCityById(cityIdRef.current),
  });

  const mutation = useMutation({
    mutationFn: (data: City) =>
      updateCreateCity({
        ...data,
        id: cityIdRef.current,
      }),
    onSuccess: (data: City) => {
      try {
        showToast();

        queryClient.invalidateQueries({
          queryKey: ['cities', 'infinite'],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ['city', data.id],
        });
      } catch (error) {
        console.error('Error in onSuccess handler:', error);
      }
    },
    onError: () => {
      setAlertTitle('Error');
      setAlertMessage('No se pudo guardar la ciudad. Inténtalo de nuevo.');
      setAlertVisible(true);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCityById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cities', 'infinite'],
        exact: false,
      });
      navigation.goBack();
    },
    onError: (error: any) => {
      console.error('Error al eliminar la ciudad:', error);
      setAlertTitle('Error');
      setAlertMessage('No se pudo eliminar la ciudad. Inténtalo de nuevo.');
      setAlertVisible(true);
    },
  });

  if (!city) {
    return (
      <MainLayout title="Ciudad">
        <Text>Parece que no se encontró ninguna ciudad...</Text>
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

  const saveButtonOutputRange = isNewCity
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
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(city.id),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Formik
      initialValues={city}
      onSubmit={(values) => {
        // Validación para evitar duplicados.
        // Comparamos nombre en minúsculas y excluimos la ciudad actual si estamos editando.
        const isDuplicate = allCities.some(
          (c) =>
            c.name.toLowerCase() === values.name.toLowerCase() &&
            c.id !== cityIdRef.current
        );

        if (isDuplicate) {
          setAlertTitle('Ciudad duplicada');
          setAlertMessage('Ya existe una ciudad con ese nombre. Inténtalo de nuevo.');
          setAlertVisible(true);
          return;
        }

        // Si no hay duplicado, procedemos a guardar
        mutation.mutate(values);
      }}
    >
      {({ handleChange, handleSubmit, values }) => (
        <MainLayout
          title={`${values.name} - ${values.nameDep}`}
          subTitle="Ciudad - Departamento"
        >
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <Layout style={{ marginVertical: 5, marginHorizontal: 10 }}>
              <Input
                label="Ciudad"
                value={values.name}
                onChangeText={handleChange('name')}
                style={{ marginVertical: 5 }}
              />
              <Input
                label="Departamento"
                value={values.nameDep}
                onChangeText={handleChange('nameDep')}
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

          {!isNewCity && (
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