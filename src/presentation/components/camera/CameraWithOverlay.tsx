import React, {useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Platform} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {RootStackParams} from '../../navigation/StackNavigator';

type CameraWithOverlayRouteProp = RouteProp<
  RootStackParams,
  'CameraWithOverlay'
>;

interface CameraWithOverlayProps {
  route: CameraWithOverlayRouteProp;
  navigation: NavigationProp<RootStackParams>;
}

export const CameraWithOverlay = ({
  route,
  navigation,
}: CameraWithOverlayProps) => {
  const cameraRef = useRef<RNCamera | null>(null);
  const {selectedCityId, selectedCityName} = route.params;

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 1,
          pictureType: 'jpg', // Aseguramos que sea JPEG
          orientation: RNCamera.Constants.Orientation.portrait, // Puedes ajustar según necesites
          fixOrientation: true, // Para asegurar que la orientación sea correcta
          forceUpOrientation: true, // Fuerza la orientación hacia arriba
          base64: false,
          skipProcessing: true,
        };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log('Foto tomada:', data.uri);

        const imageUri =
          Platform.OS === 'android'
            ? data.uri
            : data.uri.replace('file://', '');

        navigation.navigate('OcrScreen', {
          picture: [imageUri],
          selectedCityId,
          selectedCityName,
        });
      } catch (error) {
        console.error('Error al tomar la foto:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}>
        {/* Superposición de bounding boxes */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.boundingBox}>
              <Text style={styles.instructionsText}>
                Alinea la factura aquí
              </Text>
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay} />
        </View>
        {/* Botón de captura */}
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity
            onPress={takePicture}
            style={styles.captureButton}
          />
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  boundingBox: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: 'red',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  instructionsText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
