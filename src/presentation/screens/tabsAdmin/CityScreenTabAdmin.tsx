import React, {useRef, useState} from 'react';
import {Animated, StyleSheet, TextInput, View} from 'react-native';
import {
  useInfiniteQuery,
  QueryFunctionContext,
  InfiniteData,
  useQueryClient,
} from '@tanstack/react-query';
import {MainLayout} from '../../layouts/MainLayout';
import {City} from '../../../domain/entities/city';
import {FAB} from '../../components/ui/FAB';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {getCitiesByPage} from '../../../actions/cities/get-cities-by-page';
import {CityList} from '../../components/cities/CitiesList';

export const CityScreenTabAdmin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const [searchQuery, setSearchQuery] = useState('');

  const navigateToCreateCity = () => {
    navigation.navigate('CityScreenAdmin', {cityId: 'new'});
  };

  const {isLoading, data, fetchNextPage, isFetching} = useInfiniteQuery<
    City[],
    Error,
    InfiniteData<City[]>,
    [string, string],
    number
  >({
    queryKey: ['cities', 'infinite'],
    queryFn: async ({
      pageParam = 0,
    }: QueryFunctionContext<[string, string], number>): Promise<City[]> => {
      return await getCitiesByPage(pageParam);
    },
    getNextPageParam: (
      lastPage: City[],
      allPages: InfiniteData<City[]>['pages'],
    ) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
  });

  const allCities = data?.pages.flat() ?? [];

  const filteredCities = allCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <MainLayout
        title="Ahoralo - Ciudades"
        subTitle="Panel Administrativo"
        showBackAction={false}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ciudad..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <CityList
          cities={filteredCities}
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      </MainLayout>

      <FAB
        iconName="map-outline"
        onPress={navigateToCreateCity}
        style={[
          styles.fabMain,
          {backgroundColor: '#4CAF50', borderColor: '#4CAF50'},
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  fabMain: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
});