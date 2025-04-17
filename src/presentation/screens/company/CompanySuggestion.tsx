import { useState } from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import { openComposer } from 'react-native-email-link';
import { MainLayout } from '../../layouts/MainLayout';
import { CustomAlert } from '../../components/ui/CustomAlert';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAllCities } from '../../../actions/cities/fetch-all-cities';

import { SelectionProductModal } from '../../components/products/SelectionProductModal';

export const SuggestCompanyScreen = () => {
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const {
    data: citiesData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['cities', citySearch],
    queryFn: ({ pageParam = 0 }) => fetchAllCities(pageParam, 10, citySearch),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
  });

  const citiesList = citiesData?.pages.flat() || [];

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const handleSubmit = () => {
    if (!companyName || !city || !department) {
      setAlertTitle('Error');
      setAlertMessage('Por favor, completa todos los campos.');
      setAlertVisible(true);
      return;
    }

    const emailContent = `
      Nombre del Comercio: ${companyName}
      Ciudad: ${city}
      Departamento: ${department}
    `;

    openComposer({
      to: 'test@gmail.com',
      subject: 'Sugerencia de Comercio',
      body: emailContent,
    })
      .then(() => {
        setAlertTitle('Éxito');
        setAlertMessage('Sugerencia enviada correctamente.');
        setAlertVisible(true);
      })
      .catch((error) => {
        setAlertTitle('Error');
        setAlertMessage('No se pudo enviar el correo.');
        setAlertVisible(true);
      });
  };

  return (
    <MainLayout title="Sugerir Comercio">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Comercio"
          value={companyName}
          onChangeText={setCompanyName}
        />

        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={city}
          onFocus={() => setCityModalVisible(true)}
        />

        <TextInput
          style={styles.input}
          placeholder="Departamento"
          value={department}
          editable={false}
        />

        <Button title="Enviar Sugerencia" onPress={handleSubmit} />
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        confirmText="Aceptar"
      />

      <SelectionProductModal
        visible={isCityModalVisible}
        onClose={() => setCityModalVisible(false)}
        data={citiesList.map(cityItem => ({
          id: cityItem.id,
          name: `${cityItem.name} - ${cityItem.nameDep}`,
        }))}
        onSelect={item => {
          const selectedCity = citiesList.find(c => c.id === item.id);
          if (selectedCity) {
            setCity(selectedCity.name);
            setDepartment(selectedCity.nameDep);
          }
          setCityModalVisible(false);
        }}
        searchPlaceholder="Buscar Ciudad"
        searchValue={citySearch}
        onSearchChange={setCitySearch}
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});