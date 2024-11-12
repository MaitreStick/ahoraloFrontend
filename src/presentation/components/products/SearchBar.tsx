import { Input } from '@ui-kitten/components';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MyIcon } from '../ui/MyIcon';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearchClick: () => void;
}

export const SearchBar = ({ searchTerm, onSearchTermChange, onSearchClick }: SearchBarProps) => {
  return (
    <Input
      placeholder="Buscar Producto"
      value={searchTerm}
      onChangeText={onSearchTermChange}
      style={styles.searchInput}
      accessoryRight={() => (
        <TouchableOpacity onPress={onSearchClick}>
          <MyIcon name="search-outline" />
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    borderRadius: 15,
  },
});
