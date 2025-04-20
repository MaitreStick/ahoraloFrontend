import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { MainLayout } from '../../layouts/MainLayout';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { Formik } from 'formik';
import { FAB } from '../../components/ui/FAB';
import { useNavigation } from '@react-navigation/native';
import debounce from 'lodash.debounce';

import { getWarehouseById } from '../../../actions/warehouses/get-warehouse-by-id';
import { updateCreateWarehouse } from '../../../actions/warehouses/update-create-warehouse';
import { deleteWarehouseById } from '../../../actions/warehouses/delete-warehouse';
import { Warehouse } from '../../../domain/entities/warehouse';
import { CustomAlert } from '../../components/ui/CustomAlert';
import { Toast } from '../../components/ui/Toast';

import * as Yup from 'yup';
import { updateCreateComcity } from '../../../actions/comcities/updateCreateComcity';
import { fetchAllCompanies } from '../../../actions/companies/fetch-all-companies';
import { fetchAllCities } from '../../../actions/cities/fetch-all-cities';
import { Company } from '../../../domain/entities/company';
import { City } from '../../../domain/entities/city';
import { ModalSelector } from '../../components/modals/ModalSelector';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { getComcityById } from '../../../actions/comcities/get-comcity-by-id';

interface Props
  extends StackScreenProps<RootStackParams, 'WarehouseScreenAdmin'> {}

export const WarehouseScreenAdmin = ({ route }: Props) => {
  /* ───────── refs y states ───────── */
  const warehouseIdRef = useRef(route.params?.warehouseId ?? 'new');
  const isNewWarehouse = warehouseIdRef.current === 'new';

  const queryClient = useQueryClient();
  const { height } = Dimensions.get('window');
  const navigation = useNavigation();

  const [toastVisible, setToastVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  /* ───────── Modales de ciudad / empresa ───────── */
  const [isCompanyModalVisible, setCompanyModalVisible] = useState(false);
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const toggleCompanyModal = () => setCompanyModalVisible(p => !p);
  const toggleCityModal = () => setCityModalVisible(p => !p);

  const debouncedSetCompanySearch = useCallback(
    debounce((txt: string) => setCompanySearch(txt), 500),
    [],
  );
  const debouncedSetCitySearch = useCallback(
    debounce((txt: string) => setCitySearch(txt), 500),
    [],
  );

  /* ───────── Catálogos paginados ───────── */
  const {
    data: companiesData,
    fetchNextPage: fetchNextCompaniesPage,
    hasNextPage: hasNextCompaniesPage,
    isFetching: isFetchingCompanies,
  } = useInfiniteQuery<
    Company[],
    Error,
    InfiniteData<Company[]>,
    [string, string],
    number
  >({
    queryKey: ['companies', companySearch],
    queryFn: ({ pageParam = 0 }) =>
      fetchAllCompanies(pageParam, 10, companySearch),
    getNextPageParam: last => (last.length ? last.length : undefined),
    initialPageParam: 0,
  });

  const {
    data: citiesData,
    fetchNextPage: fetchNextCitiesPage,
    hasNextPage: hasNextCitiesPage,
    isFetching: isFetchingCities,
  } = useInfiniteQuery<
    City[],
    Error,
    InfiniteData<City[]>,
    [string, string],
    number
  >({
    queryKey: ['cities', citySearch],
    queryFn: ({ pageParam = 0 }) => fetchAllCities(pageParam, 10, citySearch),
    getNextPageParam: last => (last.length ? last.length : undefined),
    initialPageParam: 0,
  });

  const companyOptions = (companiesData?.pages.flat() ?? []).map(c => ({
    id: c.id,
    displayName: c.name,
  }));
  const cityOptions = (citiesData?.pages.flat() ?? []).map(ct => ({
    id: ct.id,
    displayName: `${ct.name} (${ct.nameDep})`,
    dep: ct.nameDep,
  }));

  /* ───────── 1) query del almacén ───────── */
  const {
    data: warehouseRaw,
    isLoading: whLoading,
    isError: whError,
  } = useQuery({
    enabled: !isNewWarehouse,
    queryKey: ['warehouse', warehouseIdRef.current],
    queryFn: () => getWarehouseById(warehouseIdRef.current),
  });

  /* ───────── 2) query del comcity dependiente ───────── */
  const {
    data: comcity,
    isLoading: ccLoading,
    isError: ccError,
  } = useQuery({
    enabled: !!warehouseRaw?.comcityId,
    queryKey: ['comcity', warehouseRaw?.comcityId],
    queryFn: () => getComcityById(warehouseRaw!.comcityId),
  });

  /* ───────── combinamos los datos (memo) ───────── */
  const warehouse = useMemo(() => {
    if (isNewWarehouse) {
      return {
        id: 'new',
        name: '',
        latitude: '' as any,
        longitude: '' as any,
        companyId: '',
        cityId: '',
        departmentName: '',
      };
    }
    if (!warehouseRaw) return undefined;

    return {
      ...warehouseRaw,
      companyId: comcity?.company.id ?? '',
      cityId: comcity?.city.id ?? '',
      departmentName: comcity?.city.nameDep ?? '',
    };
  }, [isNewWarehouse, warehouseRaw, comcity]);

  /* ───────── mutations ───────── */
  const comcityMutation = useMutation({ mutationFn: updateCreateComcity });

  const warehouseMutation = useMutation({
    mutationFn: (data: Warehouse) => updateCreateWarehouse(data),
    onSuccess: data => {
      setToastVisible(true);
      queryClient.invalidateQueries({ queryKey: ['warehouses', 'infinite'] });
      queryClient.invalidateQueries({
        queryKey: ['warehouse', (data as Warehouse).id],
      });
      navigation.goBack();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWarehouseById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses', 'infinite'] });
      navigation.goBack();
    },
  });

  /* ───────── FAB animation ───────── */
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

  /* ───────── loaders / errores ───────── */
  if (whLoading || ccLoading) return <FullScreenLoader />;

  if (whError || ccError || !warehouse) {
    return (
      <MainLayout title="Almacén">
        <Text>Error al cargar el almacén.</Text>
      </MainLayout>
    );
  }

  /* ───────── form validation ───────── */
  const validationSchema = Yup.object({
    name: Yup.string().required('Nombre requerido'),
    latitude: Yup.number().required('Latitud requerida').min(-90).max(90),
    longitude: Yup.number().required('Longitud requerida').min(-180).max(180),
    companyId: Yup.string().uuid('UUID inválido').required('Empresa requerida'),
    cityId: Yup.string().uuid('UUID inválido').required('Ciudad requerida'),
  });

  /* ───────── UI ───────── */
  return (
    <Formik
      enableReinitialize
      initialValues={{
        name: warehouse.name,
        latitude: warehouse.latitude?.toString() ?? '',
        longitude: warehouse.longitude?.toString() ?? '',
        companyId: warehouse.companyId,
        cityId: warehouse.cityId,
        departmentName: warehouse.departmentName,
      }}
      validationSchema={validationSchema}
      onSubmit={async values => {
        try {
          // Si cambia empresa o ciudad (o es nuevo) obtenemos/creamos el comcity
          let comcityId = warehouseRaw?.comcityId ?? '';
          const cambiaEmpresa = values.companyId !== warehouse.companyId;
          const cambiaCiudad = values.cityId !== warehouse.cityId;

          if (isNewWarehouse || cambiaEmpresa || cambiaCiudad) {
            const newComcity = await comcityMutation.mutateAsync({
              company: {
                id: values.companyId,
                name: companyOptions.find(o => o.id === values.companyId)?.displayName || '',
              },
              city: {
                id: values.cityId,
                name: cityOptions.find(o => o.id === values.cityId)?.displayName.split(' (')[0] || '',
                nameDep: cityOptions.find(o => o.id === values.cityId)?.dep || '',
              },
            });
            comcityId = newComcity.id;
          }

          await warehouseMutation.mutateAsync({
            id: isNewWarehouse ? 'new' : warehouse.id,
            name: values.name,
            latitude: Number(values.latitude),
            longitude: Number(values.longitude),
            comcityId,
          } as Warehouse);
        } catch {
          setAlertTitle('Error');
          setAlertMessage('No se pudo guardar el almacén. Inténtalo de nuevo.');
          setAlertVisible(true);
        }
      }}
    >
      {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
        <MainLayout
          title={isNewWarehouse ? 'Nuevo Almacén' : values.name}
          subTitle="Almacén"
        >
          <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <Layout style={{ marginVertical: 5, marginHorizontal: 10 }}>
              {/* Nombre */}
              <Input
                label="Nombre"
                value={values.name}
                onChangeText={handleChange('name')}
                style={{ marginVertical: 5 }}
                status={errors.name ? 'danger' : 'basic'}
              />

              {/* Latitud */}
              <Input
                label="Latitud"
                value={values.latitude}
                onChangeText={handleChange('latitude')}
                style={{ marginVertical: 5 }}
                keyboardType="numeric"
                status={errors.latitude ? 'danger' : 'basic'}
              />

              {/* Longitud */}
              <Input
                label="Longitud"
                value={values.longitude}
                onChangeText={handleChange('longitude')}
                style={{ marginVertical: 5 }}
                keyboardType="numeric"
                status={errors.longitude ? 'danger' : 'basic'}
              />

              {/* Empresa */}
              <Button
                onPress={toggleCompanyModal}
                appearance="outline"
                status={errors.companyId ? 'danger' : 'basic'}
                style={{ marginVertical: 5 }}
              >
                {values.companyId
                  ? companyOptions.find(o => o.id === values.companyId)
                      ?.displayName
                  : 'Selecciona Empresa'}
              </Button>

              {/* Ciudad */}
              <Button
                onPress={toggleCityModal}
                appearance="outline"
                status={errors.cityId ? 'danger' : 'basic'}
                style={{ marginVertical: 5 }}
              >
                {values.cityId
                  ? cityOptions.find(o => o.id === values.cityId)?.displayName
                  : 'Selecciona Ciudad'}
              </Button>

              {/* Departamento */}
              <Input
                label="Departamento"
                value={values.departmentName}
                disabled
                style={{ marginVertical: 5 }}
              />
            </Layout>
            <Layout style={{ height: 200 }} />
          </ScrollView>

          {/* ───────── FAB principal ───────── */}
          <FAB
            iconName={isFabOpen ? 'close-outline' : 'plus-outline'}
            onPress={toggleFab}
            style={[styles.fabMain, { bottom: height * 0.05 }]}
          />

          {/* Guardar */}
          <Animated.View style={[fabSaveStyle]}>
            <FAB
              iconName="save-outline"
              style={styles.fabSave}
              onPress={() => handleSubmit()}
              disabled={
                warehouseMutation.isPending || comcityMutation.isPending
              }
            />
          </Animated.View>

          {/* Eliminar */}
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

          {/* ───────── Modales ───────── */}
          <ModalSelector
            visible={isCompanyModalVisible}
            onClose={toggleCompanyModal}
            placeholder="Buscar Empresa"
            onSearch={debouncedSetCompanySearch}
            isFetching={isFetchingCompanies}
            options={companyOptions}
            fetchNext={fetchNextCompaniesPage}
            hasNext={hasNextCompaniesPage}
            onSelect={({ id }) => setFieldValue('companyId', id)}
          />

          <ModalSelector
            visible={isCityModalVisible}
            onClose={toggleCityModal}
            placeholder="Buscar Ciudad"
            onSearch={debouncedSetCitySearch}
            isFetching={isFetchingCities}
            options={cityOptions}
            fetchNext={fetchNextCitiesPage}
            hasNext={hasNextCitiesPage}
            onSelect={({ id, displayName }) => {
              setFieldValue('cityId', id);
              const dep = displayName.split('(')[1]?.replace(')', '') ?? '';
              setFieldValue('departmentName', dep);
            }}
          />

          {/* Alert & Toast */}
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
