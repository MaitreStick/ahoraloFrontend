/* eslint-disable quotes */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {Button} from "@ui-kitten/components";
import {MyIcon} from "./MyIcon";
import {StyleProp, ViewStyle} from "react-native";

interface Props {
  iconName: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const FAB = ({style, iconName, onPress, disabled}: Props) => {
  return (
    <Button
      style={[
        style,
        {
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.4,
          shadowRadius: 10,
          elevation: 3,
          borderRadius: 13,
        },
      ]}
      accessoryLeft={<MyIcon name={iconName} white />}
      disabled={disabled}
      onPress={onPress}
    />
  );
};
