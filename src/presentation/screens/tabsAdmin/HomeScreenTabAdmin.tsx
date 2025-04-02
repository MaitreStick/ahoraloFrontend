/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-shadow */
import {
  InfiniteData,
  QueryFunctionContext,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {MainLayout} from '../../layouts/MainLayout';
import {getProdcomcityByPage} from '../../../actions/products/get-prodcomcity-by-page';
import {useState} from 'react';
import {getProductsByCity} from '../../../actions/products/get-products-by-city';
import {Prodcomcity} from '../../../domain/entities/prodcomcity';
import {FAB} from '../../components/ui/FAB';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {getProductsByCityAndCompany} from '../../../actions/products/get-products-by-city-and-company';
import {getProductsByCompany} from '../../../actions/products/get-products-by-company';
import {StyleSheet} from 'react-native';
import {searchProductsByTerm} from '../../../actions/products/search-products-by-term';
import {ProductListAdmin} from '../../components/products/ProductListAdmin';

export const HomeScreenTabAdmin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCityName, setSelectedCityName] = useState('Ciudad');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const [selectedCompanyName, setSelectedCompanyName] = useState('Empresa');
  const [searchProduct, setSearchProduct] = useState<string | null>(null);

  const navigateToCreateProduct = () => {
    navigation.navigate('ProductScreenAdmin', {
      productId: 'new',
      comcityId: 'new',
    });
  };

  const queryClient = useQueryClient();

  const onCitySelect = (cityId: string | null, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedCityName(cityName);
    queryClient.removeQueries({queryKey: ['prodcomcities', 'infinite']});
  };

  const onCompanySelect = (companyId: string | null, companyName: string) => {
    setSelectedCompanyId(companyId);
    setSelectedCompanyName(companyName);
    queryClient.removeQueries({queryKey: ['prodcomcities', 'infinite']});
  };

  const onProductSearch = (searchProduct: string | null) => {
    setSearchProduct(searchProduct);
    queryClient.removeQueries({queryKey: ['prodcomcities', 'infinite']});
  };

  const {isLoading, data, fetchNextPage, isFetching} = useInfiniteQuery<
    Prodcomcity[],
    Error,
    InfiniteData<Prodcomcity[]>,
    [string, string, string | null, string | null, string | null],
    number
  >({
    queryKey: [
      'prodcomcities',
      'infinite',
      selectedCityId,
      selectedCompanyId,
      searchProduct,
    ],
    queryFn: async ({
      pageParam = 0,
    }: QueryFunctionContext<
      [string, string, string | null, string | null, string | null],
      number
    >): Promise<Prodcomcity[]> => {
      if (searchProduct) {
        return await searchProductsByTerm(
          searchProduct,
          selectedCityId,
          selectedCompanyId,
          pageParam,
        );
      } else if (selectedCityId && selectedCompanyId) {
        return await getProductsByCityAndCompany(
          selectedCityId,
          selectedCompanyId,
          pageParam,
        );
      } else if (selectedCityId) {
        return await getProductsByCity(selectedCityId, pageParam);
      } else if (selectedCompanyId) {
        return await getProductsByCompany(selectedCompanyId, pageParam);
      } else {
        return await getProdcomcityByPage(pageParam);
      }
    },
    getNextPageParam: (
      lastPage: Prodcomcity[],
      allPages: InfiniteData<Prodcomcity[]>['pages'],
    ) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <>
      <MainLayout
        title="Ahoralo - Productos"
        subTitle="Panel Administrativo"
        showBackAction={false}
      >
        <ProductListAdmin
          prodcomcities={data?.pages.flat() ?? []}
          fetchNextPage={fetchNextPage}
          selectedCityId={selectedCityId}
          selectedCityName={selectedCityName}
          selectedCompanyId={selectedCompanyId}
          selectedCompanyName={selectedCompanyName}
          onCitySelect={onCitySelect}
          onCompanySelect={onCompanySelect}
          onProductSearch={onProductSearch}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      </MainLayout>

      <FAB
        iconName={'cube-outline'}
        onPress={navigateToCreateProduct}
        style={[
          styles.fabMain,
          {backgroundColor: '#3F51B5', borderColor: '#3F51B5'},
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fabMain: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    borderColor: '#3B82F6',
    backgroundColor: '#3B82F6',
  },
});
