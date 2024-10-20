import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout, Text, Spinner, ListItem, List } from '@ui-kitten/components';
import { fetchLowestPricesByTags } from '../../../actions/products/fetch-lowest-prices-by-tags';
import { Prodcomcity } from '../../../domain/entities/prodcomcity';
import { LowestPriceByTag } from '../../../infrastructure/interfaces/ahoralo-products.response';
import { StyleSheet, Dimensions } from 'react-native';
import { MyIcon } from '../../components/ui/MyIcon';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface Props {
  prodcomcity: Prodcomcity;
}

export const LowestPriceTab = ({ prodcomcity }: Props) => {
  const tags = prodcomcity.product.tags;
  const cityId = prodcomcity.comcity.city.id;

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<LowestPriceByTag[], Error>({
    queryKey: ['lowestPricesByTags', tags],
    queryFn: () => fetchLowestPricesByTags(tags, cityId),
    enabled: !!tags && tags.length > 0,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['lowestPricesByTags', tags] });
  }, [tags, queryClient]);

  if (isLoading) {
    return (
      <Layout style={styles.centered}>
        <Spinner size="large" />
      </Layout>
    );
  }

  if (error) {
    console.error('Error al obtener los datos:', error);
    return (
      <Layout style={styles.centered}>
        <Text category="s1">Error al obtener los datos</Text>
      </Layout>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Layout style={styles.centered}>
        <Text category="s1">No hay datos disponibles</Text>
      </Layout>
    );
  }

  // Ordenar y preparar los datos
  const sortedData = [...data].sort((a, b) => a.lowestPrice - b.lowestPrice);
  const lowestPrice = sortedData[0].lowestPrice;

  const renderItem = ({ item }: { item: LowestPriceByTag }) => {
    const isLowestPrice = item.lowestPrice === lowestPrice;
    const priceDifference = item.lowestPrice - lowestPrice;
    const priceDifferenceText = isLowestPrice
      ? 'Mejor precio'
      : `+ $${priceDifference.toFixed(2)}`;

    return (
      <ListItem
        style={styles.listItem}
        title={() => (
          <Text style={[styles.listItemTitle, isLowestPrice && styles.highlightedText]}>
            {item.companyName}
          </Text>
        )}
        description={() => (
          <Text style={[styles.listItemDescription, isLowestPrice && styles.highlightedText]}>
            Precio: ${item.lowestPrice.toFixed(2)} ({priceDifferenceText})
          </Text>
        )}
        accessoryLeft={() => (
          <MyIcon name="briefcase-outline" fill={isLowestPrice ? '#4CAF50' : undefined} />
        )}
      />
    );
  };

  const chartData = {
    labels: sortedData.map((item) => item.companyName),
    datasets: [
      {
        data: sortedData.map((item) => item.lowestPrice),
      },
    ],
  };

  return (
    <List
      data={sortedData}
      renderItem={renderItem}
      ListHeaderComponent={
          <Text style={styles.label}>Empresas y sus precios:</Text>
      }
      ListFooterComponent={
        <>
          <Text category="h6" style={styles.chartTitle}>
            Gráfica de precios
          </Text>
          <BarChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            fromZero
            yAxisLabel="$"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            verticalLabelRotation={30}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </>
      }
      contentContainerStyle={styles.listContentContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  divider: {
    marginVertical: 8,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  listItem: {
    marginVertical: 4,
  },
  listItemTitle: {
    fontSize: 16,
    marginLeft: 8,
  },
  listItemDescription: {
    fontSize: 14,
    marginLeft: 8,
  },
  highlightedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  chartTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
});
