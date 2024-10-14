import { Input, Layout, Text } from '@ui-kitten/components';
import { Alert, Animated, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { MainLayout } from '../../layouts/MainLayout';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCityById } from '../../../actions/cities/get-city-by-id';
import { useRef, useState } from 'react';
import { Formik } from 'formik';
import { City } from '../../../domain/entities/city';
import { updateCreateCity } from '../../../actions/cities/update-create-city';
import { FAB } from '../../components/ui/FAB';
import { useNavigation } from '@react-navigation/native';
import { deleteCityById } from '../../../actions/cities/delete-city';

interface Props extends StackScreenProps<RootStackParams, 'CityScreenAdmin'> { }

export const CityScreenAdmin = ({ route }: Props) => {
  const cityIdRef = useRef(route.params.cityId);
  const queryClient = useQueryClient();
  const { height } = Dimensions.get('window');
  const navigation = useNavigation();

  const [isFabOpen, setIsFabOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const isNewCity = cityIdRef.current === 'new';

  const { data: city } = useQuery({
    queryKey: ['city', cityIdRef.current],
    queryFn: () => getCityById(cityIdRef.current)
  });

  const mutation = useMutation({
    mutationFn: (data: City) => updateCreateCity({
      ...data,
      id: cityIdRef.current,
    }),
    onSuccess: (data: City) => {

      try {
        queryClient.invalidateQueries({
          queryKey: ['cities', 'infinite'],
          exact: false,
        });
        queryClient.invalidateQueries({ 
          queryKey: ['city', data.id] 
        });
      } catch (error) {
        console.error('Error in onSuccess handler:', error);
      }

    },
    onError: () => {
      Alert.alert('Error', 'No se pudo guardar la ciudad. Inténtalo de nuevo.');
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
      Alert.alert('Error', 'No se pudo eliminar la ciudad. Inténtalo de nuevo.');
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
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteMutation.mutate(city.id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <Formik
      initialValues={city}
      onSubmit={mutation.mutate}
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

          {/* Botón flotante principal */}
          <FAB
            iconName={isFabOpen ? 'close-outline' : 'plus-outline'}
            onPress={toggleFab}
            style={[styles.fabMain, { bottom: height * 0.05 }]}
          />

          {/* Botón para guardar */}
          <Animated.View style={[fabSaveStyle]}>
            <FAB
              iconName="save-outline"
              style={[styles.fabSave]}
              onPress={() => handleSubmit()}
              disabled={mutation.isPending}
            />
          </Animated.View>

          {/* Botón para eliminar (solo si no es una nueva ciudad) */}
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
