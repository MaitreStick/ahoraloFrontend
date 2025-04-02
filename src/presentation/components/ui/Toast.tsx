/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, ViewStyle} from 'react-native';

interface ToastProps {
  visible: boolean;
  message: string;
  duration?: number;
  onHide: () => void;
  style?: ViewStyle;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  duration = 3000,
  onHide,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      hideTimeout = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);
    }

    return () => {
      clearTimeout(hideTimeout);
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, {opacity}, style]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  message: {
    color: 'white',
    fontSize: 14,
  },
});
