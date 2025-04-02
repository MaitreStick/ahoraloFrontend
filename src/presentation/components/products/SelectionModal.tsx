/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Input, Layout, List, ListItem, Text} from '@ui-kitten/components';
import {MyIcon} from '../ui/MyIcon';

interface SelectionModalProps {
  visible: boolean;
  toggleModal: () => void;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  data: Array<{id: string | null; name: string; displayName: string}>;
  onSelect: (item: {
    id: string | null;
    name: string;
    displayName: string;
  }) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isLoading: boolean;
}

export const SelectionModal = ({
  visible,
  toggleModal,
  searchPlaceholder,
  onSearchChange,
  data,
  onSelect,
  fetchNextPage,
  hasNextPage,
  isLoading,
}: SelectionModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={toggleModal}
    >
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContentContainer}>
        <View style={styles.modalHeader}>
          <View style={styles.dragIndicator} />
        </View>

        <Input
          placeholder={searchPlaceholder}
          onChangeText={onSearchChange}
          style={styles.searchBar}
          accessoryRight={<MyIcon name="search-outline" />}
        />

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingIndicator}
          />
        ) : data.length === 0 ? (
          <Layout style={styles.noResultsContainer}>
            <Text>No se encontraron resultados</Text>
          </Layout>
        ) : (
          <List
            data={data}
            style={{backgroundColor: 'white'}}
            keyExtractor={item => item.id ?? 'all'}
            renderItem={({item}) => (
              <ListItem
                title={item.displayName}
                onPress={() => onSelect(item)}
              />
            )}
            onEndReached={hasNextPage ? fetchNextPage : null}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
    </Modal>
  );
};

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
  loadingIndicator: {
    marginTop: 20,
  },
});
