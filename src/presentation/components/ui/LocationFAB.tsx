/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {MyIcon} from './MyIcon';

interface Props {
  iconName: string;
  onPress: () => void;

  style?: StyleProp<ViewStyle>;
}

export const LocationFAB = ({iconName, onPress, style}: Props) => {
  return (
    <View style={[styles.btn, style]}>
      <Pressable onPress={onPress}>
        <MyIcon name={iconName} white />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    zIndex: 1,
    position: 'absolute',
    height: 50,
    width: 50,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 0.27,
      width: 4.5,
    },
    elevation: 5,
  },
});
