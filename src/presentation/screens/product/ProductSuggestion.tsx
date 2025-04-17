import {useState} from 'react';
import {View, StyleSheet, TextInput, Button, Alert} from 'react-native';
import {openComposer} from 'react-native-email-link';
import {MainLayout} from '../../layouts/MainLayout';
import {CustomAlert} from '../../components/ui/CustomAlert';

export const SuggestProductScreen = () => {
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const handleSubmit = () => {
    if (!productName || !productCode || !company || !city || !department) {
      setAlertTitle('Error');
      setAlertMessage('Por favor, completa todos los campos.');
      setAlertVisible(true);
      return;
    }

    const emailContent = `
      Nombre del Producto: ${productName}
      Código del Producto: ${productCode}
      Empresa: ${company}
      Ciudad: ${city}
      Departamento: ${department}
    `;

    openComposer({
      to: 'test@gmail.com',
      subject: 'Sugerencia de Producto',
      body: emailContent,
    })
      .then(() => {
        setAlertTitle('Éxito');
        setAlertMessage('Sugerencia enviada correctamente.');
        setAlertVisible(true);
      })
      .catch(error => {
        setAlertTitle('Error');
        setAlertMessage('No se pudo enviar el correo.');
        setAlertVisible(true);
      });
  };

  return (
    <MainLayout title="Sugerir Producto">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Producto"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Código del Producto"
          value={productCode}
          onChangeText={setProductCode}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Empresa"
          value={company}
          onChangeText={setCompany}
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
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        confirmText="Aceptar"
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
