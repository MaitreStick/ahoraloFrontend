import { StyleSheet, View, Image, useWindowDimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
import { MainLayout } from '../../layouts/MainLayout';

export const ComingSoonScreen = () => {

  const {width, height} = useWindowDimensions();

  return (
    <MainLayout title="En Construcción">
      <View style={[stylesComingSoon.container]}>
        <Image
          source={require('../../../assets/workTime.png')}
          style={{ width: width * 0.8, height: height * 0.35, backgroundColor: 'white', marginBottom: height * 0.04, marginTop: height * 0.06 }}
        />
        <Text category="h4" style={{textAlign: 'center', marginBottom: height * 0.02 }}>
          ¡Estamos trabajando en ello!
        </Text>
        <Text style={{textAlign: 'center', marginBottom: height * 0.02, color: '#6e6e6e' }}>
          Esta sección estará disponible muy pronto. ¡Gracias por tu paciencia!
        </Text>
      </View>
    </MainLayout>
  );
};

const stylesComingSoon = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'white'
  }
});
