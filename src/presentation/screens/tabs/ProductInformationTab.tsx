import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { Prodcomcity } from '../../../domain/entities/prodcomcity';

export const ProductInformationTab = ({ prodcomcity }: { prodcomcity: Prodcomcity }) => {
    const { product, comcity } = prodcomcity;
  
    return (
      <Layout style={localStyles.container}>
        <Text category="h5">
          {product.title}
        </Text>
        <Layout style={localStyles.row}>
          <Text>Ciudad:</Text>
          <Text appearance="hint" style={{ marginLeft: 8 }}>{comcity.city.name}</Text>
        </Layout>
        <Layout style={localStyles.row}>
          <Text appearance="hint">Empresa:</Text>
          <Text>{comcity.company.name}</Text>
        </Layout>
      </Layout>
    );
  };
  

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 8,
  },
});
