import {Modal, TouchableWithoutFeedback, View, StyleSheet} from 'react-native';
import {Input, List, ListItem} from '@ui-kitten/components';
import {MyIcon} from '../ui/MyIcon';

interface SelectionProductModalProps {
  visible: boolean;
  onClose: () => void;
  data: Array<{id: string; name: string}>;
  onSelect: (item: {id: string; name: string}) => void;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const SelectionProductModal = ({
  visible,
  onClose,
  data,
  onSelect,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: SelectionProductModalProps) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay} />
    </TouchableWithoutFeedback>

    <View style={styles.modalContentContainer}>
      <View style={styles.modalHeader}>
        <View style={styles.dragIndicator} />
      </View>

      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onChangeText={onSearchChange}
        style={styles.searchBar}
        accessoryRight={<MyIcon name="search-outline" />}
      />

      <List
        data={data}
        renderItem={({item}) => (
          <ListItem title={item.name} onPress={() => onSelect(item)} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContentContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '50%',
    minHeight: '25%',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
