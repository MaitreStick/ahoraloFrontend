import { useQuery } from '@tanstack/react-query';
import { Layout, Text, List, ListItem, Spinner } from '@ui-kitten/components';
import { fetchLowestPricesByTags } from '../../../actions/products/fetch-lowest-prices-by-tags';
import { Prodcomcity } from '../../../domain/entities/prodcomcity';
import { LowestPriceByTag } from '../../../infrastructure/interfaces/ahoralo-products.response';

interface Props {
    prodcomcity: Prodcomcity;
}

export const LowestPriceTab = ({ prodcomcity }: Props) => {
    const tags = prodcomcity.product.tags;
    console.log(tags);

    const { data, isLoading, error } = useQuery<LowestPriceByTag[], Error>({
        queryKey: ['lowestPricesByTags', tags],
        queryFn: () => fetchLowestPricesByTags(tags),
        enabled: !!tags && tags.length > 0,
    });
    

    if (isLoading) {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="large" />
            </Layout>
        );
    }

    if (error) {
        console.error('Error al obtener los datos:', error);
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category="s1">Error al obtener los datos</Text>
            </Layout>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category="s1">No hay datos disponibles</Text>
            </Layout>
        );
    }

    const renderItem = ({ item }: { item: LowestPriceByTag }) => (
        <ListItem
          title={`${item.companyName}`}
          description={`Producto: ${item.productTitle}`}
          accessoryRight={() => (
            <Text category="s1" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
              ${item.lowestPrice.toFixed(2)}
            </Text>
          )}
          onPress={() => {
          }}
        />
      );

    return (
        <Layout style={{ flex: 1 }}>
            <List
                data={data}
                renderItem={renderItem}
            />
        </Layout>
    );
};
