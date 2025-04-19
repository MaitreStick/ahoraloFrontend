import {
  IndexPath,
    Input,
    Layout,
    Select,
    SelectItem,
    Text,
  } from '@ui-kitten/components';
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
  import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
  import { useRef, useState } from 'react';
  import { Formik } from 'formik';
  import { FAB } from '../../components/ui/FAB';
  import { useNavigation } from '@react-navigation/native';
  
  import { getWarehouseById } from '../../../actions/warehouses/get-warehouse-by-id';
  import { Warehouse } from '../../../domain/entities/warehouse';
  import { updateCreateWarehouse } from '../../../actions/warehouses/update-create-warehouse';
  import { deleteWarehouseById } from '../../../actions/warehouses/delete-warehouse';
  import { CustomAlert } from '../../components/ui/CustomAlert';
  import { Toast } from '../../components/ui/Toast';
  import { getComcities } from '../../../actions/comcities/get-comcities';
  import * as Yup from 'yup';
  
  interface Props
    extends StackScreenProps<RootStackParams, 'WarehouseScreenAdmin'> {}
  
  export const WarehouseScreenAdmin = ({ route }: Props) => {
    const warehouseIdRef = useRef(route.params?.warehouseId || 'new');
    const queryClient = useQueryClient();
    const { height } = Dimensions.get('window');
    const navigation = useNavigation();
    const [toastVisible, setToastVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [isFabOpen, setIsFabOpen] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
  
    const isNewWarehouse = warehouseIdRef.current === 'new';

    const { data: warehouse } = useQuery({
      enabled: !isNewWarehouse,
      queryKey: ['warehouse', warehouseIdRef.current],
      queryFn: () => getWarehouseById(warehouseIdRef.current),
      initialData: isNewWarehouse
        ? {
            id: 'new',
            name: '',
            latitude: '',
            longitude: '',
            comcityId: '',
          } as unknown as Warehouse
        : undefined,
    });
  
    const { data: comcities = [] } = useQuery({
      queryKey: ['comcities'],
      queryFn: getComcities,
    });

    const mutation = useMutation({
      mutationFn: (data: Warehouse) => updateCreateWarehouse(data),
      onSuccess: (data) => {
        setToastVisible(true);
  
        queryClient.invalidateQueries({ queryKey: ['warehouses', 'infinite'] });
        queryClient.invalidateQueries({ queryKey: ['warehouse', (data as Warehouse).id] });
        queryClient.invalidateQueries({ queryKey: ['comcity', (data as Warehouse).comcityId] });
      },
      onError: () => {
        setAlertTitle('Error');
        setAlertMessage('No se pudo guardar el almacén. Inténtalo de nuevo.');
        setAlertVisible(true);
      },
    });
  
    const deleteMutation = useMutation({
      mutationFn: (id: string) => deleteWarehouseById(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['warehouses', 'infinite'] });
        navigation.goBack();
      },
      onError: () => {
        setAlertTitle('Error');
        setAlertMessage('No se pudo eliminar el almacén. Inténtalo de nuevo.');
        setAlertVisible(true);
      },
    });
  

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
  
    const saveButtonOutputRange = isNewWarehouse
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
        '¿Estás seguro de que deseas eliminar este almacén?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => deleteMutation.mutate(warehouse!.id),
          },
        ],
      );
    };
  
    if (!warehouse) {
      return (
        <MainLayout title="Almacén">
          <Text>Parece que no se encontró ningún almacén...</Text>
        </MainLayout>
      );
    }
  

    return (
      <Formik
        initialValues={{
          ...warehouse,
          latitude: warehouse.latitude?.toString() ?? '',
          longitude: warehouse.longitude?.toString() ?? '',
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Nombre requerido'),
          latitude: Yup.number()
            .required('Latitud requerida')
            .min(-90)
            .max(90),
          longitude: Yup.number()
            .required('Longitud requerida')
            .min(-180)
            .max(180),
          comcityId: Yup.string().uuid('UUID inválido').required('Comcity requerido'),
        })}
        onSubmit={(values) =>
          mutation.mutate({
            ...values,
            id: warehouseIdRef.current,
            latitude: Number(values.latitude),
            longitude: Number(values.longitude),
          } as unknown as Warehouse)
        }
      >
        {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
          <MainLayout
            title={isNewWarehouse ? 'Nuevo Almacén' : values.name}
            subTitle="Almacén"
          >
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
              <Layout style={{ marginVertical: 5, marginHorizontal: 10 }}>
                <Input
                  label="Nombre"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  style={{ marginVertical: 5 }}
                  status={errors.name ? 'danger' : 'basic'}
                />
  
                <Input
                  label="Latitud"
                  value={values.latitude.toString()}
                  onChangeText={handleChange('latitude')}
                  style={{ marginVertical: 5 }}
                  keyboardType="numeric"
                  status={errors.latitude ? 'danger' : 'basic'}
                />
  
                <Input
                  label="Longitud"
                  value={values.longitude.toString()}
                  onChangeText={handleChange('longitude')}
                  style={{ marginVertical: 5 }}
                  keyboardType="numeric"
                  status={errors.longitude ? 'danger' : 'basic'}
                />
  
                <Select
                  label="Comcity"
                  selectedIndex={
                    values.comcityId
                      ? new IndexPath(
                          comcities.findIndex((c: any) => c.id === values.comcityId),
                        )
                      : undefined
                  }
                  onSelect={(index) =>
                    setFieldValue('comcityId', comcities[(index as IndexPath).row].id)
                  }
                  value={
                    values.comcityId
                      ? comcities.find((c: any) => c.id === values.comcityId)?.cityName ??
                        ''
                      : 'Selecciona'
                  }
                  style={{ marginVertical: 5 }}
                >
                  {comcities.map((c: any) => (
                    <SelectItem
                      key={c.id}
                      title={`${c.cityName} (${c.companyName})`}
                    />
                  ))}
                </Select>
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
                style={styles.fabSave}
                onPress={() => handleSubmit()}
                disabled={mutation.isPending}
              />
            </Animated.View>
  
            {!isNewWarehouse && (
              <Animated.View style={[fabDeleteStyle]}>
                <FAB
                  iconName="trash-outline"
                  style={styles.fabDelete}
                  onPress={handleDelete}
                  disabled={deleteMutation.isPending}
                />
              </Animated.View>
            )}
  
            <CustomAlert
              visible={alertVisible}
              title={alertTitle}
              message={alertMessage}
              onConfirm={() => setAlertVisible(false)}
              confirmText="Aceptar"
            />
            <Toast
              visible={toastVisible}
              message="Proceso Exitoso"
              onHide={() => setToastVisible(false)}
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