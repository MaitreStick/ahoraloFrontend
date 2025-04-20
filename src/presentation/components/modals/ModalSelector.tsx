import { Modal, View, TouchableWithoutFeedback, ActivityIndicator, StyleSheet } from 'react-native';
import { List, ListItem, Input, Layout, Text } from '@ui-kitten/components';
import { MyIcon } from '../ui/MyIcon';

interface Option { id: string | null; displayName: string; }

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (opt: Option) => void;
  options: Option[];
  placeholder: string;
  onSearch: (txt: string) => void;
  isFetching: boolean;
  fetchNext?: () => void;
  hasNext?: boolean;
}

export const ModalSelector = ({
  visible, onClose, onSelect,
  options, placeholder,
  onSearch, isFetching,
  fetchNext, hasNext
}: Props) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    {/* overlay */}
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={local.modalOverlay}/>
    </TouchableWithoutFeedback>

    <View style={local.modalContentContainer}>
      <View style={local.modalHeader}><View style={local.dragIndicator}/></View>

      <Input
        placeholder={placeholder}
        onChangeText={onSearch}
        style={local.searchBar}
        accessoryRight={<MyIcon name="search-outline" />}
      />

      {isFetching && options.length === 0
        ? <ActivityIndicator style={{marginTop:20}}/>
        : options.length === 0
          ? <Layout style={local.noResultsContainer}><Text>Sin resultados</Text></Layout>
          : (
            <List
              data={options}
              keyExtractor={(i) => i.id ?? 'all'}
              renderItem={({item}) => (
                <ListItem title={item.displayName} onPress={() => {onSelect(item); onClose();}}/>
              )}
              onEndReached={hasNext ? fetchNext : undefined}
              onEndReachedThreshold={0.5}
            />
          )
      }
    </View>
  </Modal>
);

const local = StyleSheet.create({
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.5)'},
  modalContentContainer:{position:'absolute',bottom:0,width:'100%',maxHeight:'50%',backgroundColor:'white',
    borderTopLeftRadius:25,borderTopRightRadius:25,overflow:'hidden'},
  modalHeader:{alignItems:'center',paddingVertical:8},
  dragIndicator:{width:40,height:5,borderRadius:2.5,backgroundColor:'#ccc'},
  searchBar:{marginHorizontal:16,marginBottom:8},
  noResultsContainer:{alignItems:'center',justifyContent:'center',padding:20},
});