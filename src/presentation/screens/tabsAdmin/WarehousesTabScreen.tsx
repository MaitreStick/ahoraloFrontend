import React from 'react';
import { StyleSheet } from 'react-native';
import {
  useInfiniteQuery,
  QueryFunctionContext,
  InfiniteData,
} from '@tanstack/react-query';
import { Warehouse } from '../../../domain/entities/warehouse';
import { getWarehousesByPage } from '../../../actions/warehouses/get-warehouses-by-page';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { WarehouseList } from '../../components/warehouses/WarehouseList';
import { FAB } from '../../components/ui/FAB';

export const WarehousesTabScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const { isLoading, data, fetchNextPage, isFetching } =
    useInfiniteQuery<
      Warehouse[],
      Error,
      InfiniteData<Warehouse[]>,
      [string, string],
      number
    >({
      queryKey: ['warehouses', 'infinite'],
      queryFn: async ({
        pageParam = 0,
      }: QueryFunctionContext<[string, string], number>) =>
        getWarehousesByPage(pageParam),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === 0 ? undefined : allPages.length,
      initialPageParam: 0,
      staleTime: 1000 * 60 * 60,
    });

  const warehouses = Array.from(
    new Map((data?.pages.flat() ?? []).map((w) => [w.id, w])).values(),
  );

  return (
    <>
      <WarehouseList
        warehouses={warehouses}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        isLoading={isLoading}
      />

      <FAB
        iconName="home-outline"
        onPress={() =>
          navigation.navigate('WarehouseScreenAdmin', { warehouseId: 'new' })
        }
        style={[styles.fab, { backgroundColor: '#3B82F6', borderColor: '#3B82F6' }]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
  },
});