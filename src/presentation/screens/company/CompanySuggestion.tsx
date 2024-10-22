import { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { openComposer } from 'react-native-email-link';
import { MainLayout } from '../../layouts/MainLayout';

export const SuggestCompanyScreen = () => {
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = () => {
    if (!companyName || !city || !department) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
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
      .then(() => Alert.alert('Éxito', 'Sugerencia enviada correctamente.'))
      .catch((error) => Alert.alert('Error', 'No se pudo enviar el correo.'));
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
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Departamento"
          value={department}
          onChangeText={setDepartment}
        />
        <Button title="Enviar Sugerencia" onPress={handleSubmit} />
      </View>
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
