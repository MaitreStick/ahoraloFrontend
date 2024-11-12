import { View, StyleSheet, Animated } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useWindowDimensions } from 'react-native';
import { MyIcon } from '../ui/MyIcon';
import { colors } from '../../../config/theme/ColorsTheme';

interface FilterButtonsProps {
  selectedCityName: string;
  selectedCompanyName: string;
  showCityHighlight: boolean;
  toggleCityModal: () => void;
  toggleCompanyModal: () => void;
  handleOcrClick: () => void;
}

export const FilterButtons = ({
  selectedCityName,
  selectedCompanyName,
  showCityHighlight,
  toggleCityModal,
  toggleCompanyModal,
  handleOcrClick,
}: FilterButtonsProps) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.buttonContainer}>
      <Button
        onPress={toggleCityModal}
        appearance="filled"
        status="basic"
        size="small"
        accessoryRight={<MyIcon name="chevron-down-outline" />}
        style={[
          styles.button,
          { width: width * 0.25 },
          showCityHighlight && { backgroundColor: colors.primary, borderColor: colors.primary },
        ]}
      >
        {selectedCityName}
      </Button>
      <Button
        onPress={toggleCompanyModal}
        appearance="filled"
        status="basic"
        size="small"
        accessoryRight={<MyIcon name="chevron-down-outline" />}
        style={[styles.button, { width: width * 0.25 }]}
      >
        {selectedCompanyName}
      </Button>
      <Button
        onPress={handleOcrClick}
        appearance="filled"
        status="primary"
        size="small"
        accessoryRight={<MyIcon name="camera-outline" white />}
        style={[styles.buttonOCR, { backgroundColor: colors.primary, borderColor: colors.primary }]}
      >
        Escanear Factura
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    paddingRight: 8,
    paddingLeft: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  button: {
    alignSelf: 'flex-start',
    borderColor: 'white',
    marginRight: 10,
    borderRadius: 15,
  },
  buttonOCR: {
    flex: 1,
    alignSelf: 'flex-start',
    marginRight: 10,
    borderRadius: 15,
    color: 'white',
  },
});
