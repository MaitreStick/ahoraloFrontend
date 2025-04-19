import React, { useState } from 'react';
import { RefreshControl } from 'react-native';
import { Warehouse } from '../../../domain/entities/warehouse';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Layout, List, ListItem } from '@ui-kitten/components';
import { useQueryClient } from '@tanstack/react-query';
import { FullScreenLoader } from '../ui/FullScreenLoader';
import { colors } from '../../../config/theme/ColorsTheme';

interface Props {
  warehouses: Warehouse[];
  fetchNextPage: () => void;
  isFetching: boolean;
  isLoading: boolean;
}

export const WarehouseList: React.FC<Props> = ({
  warehouses,
  fetchNextPage,
  isFetching,
  isLoading,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const queryClient = useQueryClient();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    queryClient.invalidateQueries({ queryKey: ['warehouses', 'infinite'] });
    setIsRefreshing(false);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <List
      data={warehouses}
      style={{ backgroundColor: colors.background, borderRadius: 20 }}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item }: { item: Warehouse }) => (
        <ListItem
          title={`${item.name}`}
          description={`Lat: ${item.latitude}  Lon: ${item.longitude}`}
          style={{ padding: 10 }}
          onPress={() =>
            navigation.navigate('WarehouseScreenAdmin', {
              warehouseId: item.id,
            })
          }
        />
      )}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.8}
      ListFooterComponent={() => (
        <Layout style={{ height: 150, borderEndEndRadius: 20, borderEndStartRadius: 20 }} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isFetching || isRefreshing}
          onRefresh={onPullToRefresh}
        />
      }
    />
  );
};