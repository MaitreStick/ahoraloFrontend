/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { Text } from '@ui-kitten/components';
import { Modal, View, StyleSheet, TouchableOpacity, Appearance } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onConfirm,
  confirmText = 'Aceptar',
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onConfirm} style={styles.button}>
            <Text style={styles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const colorScheme = Appearance.getColorScheme();

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colorScheme === 'dark' ? '#242222' : '#242222',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: colorScheme === 'dark' ? '#242222' : '#242222',
  },
  button: {
    alignSelf: 'flex-end',
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
