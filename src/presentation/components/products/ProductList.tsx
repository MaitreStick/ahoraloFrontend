import { Button, Input, Layout, List, ListItem, Text } from "@ui-kitten/components";
import { ProductCard } from "./ProductCard";
import { useCallback, useState } from 'react';
import { RefreshControl } from "react-native-gesture-handler";
import { InfiniteData, QueryFunctionContext, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Prodcomcity } from "../../../domain/entities/prodcomcity";
import { Alert, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import { MyIcon } from "../ui/MyIcon";
import { City } from "../../../domain/entities/city";
import debounce from "lodash.debounce";
import { FullScreenLoader } from "../ui/FullScreenLoader";
import { fetchAllCompanies } from "../../../actions/companies/fetch-all-companies";
import { Company } from "../../../domain/entities/company";
import { fetchAllCities } from "../../../actions/cities/fetch-all-cities";
import { colors } from "../../../config/theme/ColorsTheme";
import { CameraAdapter } from "../../../config/adapters/camera-adapter";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/StackNavigator";


interface Props {
  prodcomcities: Prodcomcity[];
  fetchNextPage?: () => void;
  selectedCityId: string | null;
  selectedCityName: string;
  selectedCompanyId: string | null;
  selectedCompanyName: string;
  onCitySelect: (cityId: string | null, cityName: string) => void;
  onCompanySelect: (companyId: string | null, companyName: string) => void;
  onProductSearch: (searchProduct: string | null) => void;
  isFetching: boolean;
  isLoading: boolean;
}

export const ProductList = ({
  prodcomcities,
  fetchNextPage,
  selectedCityId,
  selectedCityName,
  selectedCompanyId,
  selectedCompanyName,
  onCitySelect,
  onCompanySelect,
  onProductSearch,
  isFetching,
  isLoading,
}: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [citySearch, setCitySearch] = useState<string>('');
  const [companySearch, setCompanySearch] = useState<string>('');
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [isCompanyModalVisible, setCompanyModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const queryClient = useQueryClient();

  const { width } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const toggleCityModal = useCallback(() => {
    setCityModalVisible((prev) => !prev);
  }, []);

  const toggleCompanyModal = useCallback(() => {
    setCompanyModalVisible((prev) => !prev);
  }, []);

  const {
    data: companiesData,
    fetchNextPage: fetchNextCompaniesPage,
    hasNextPage: hasNextCompaniesPage,
    isFetching: isFetchingCompanies,
  } = useInfiniteQuery<
    Company[],
    Error,
    InfiniteData<Company[]>,
    [string, string],
    number
  >({
    queryKey: ['companies', companySearch],
    queryFn: async ({ pageParam = 0 }) => {
      return await fetchAllCompanies(pageParam, 10, companySearch);
    },
    getNextPageParam: (lastPage: Company[], allPages) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
  });

  const {
    data: citiesData,
    fetchNextPage: fetchNextCitiesPage,
    hasNextPage: hasNextCitiesPage,
    isFetching: isFetchingCities,
  } = useInfiniteQuery<
    City[],
    Error,
    InfiniteData<City[]>,
    [string, string],
    number
  >({
    queryKey: ['cities', citySearch],
    queryFn: async ({ pageParam = 0 }: QueryFunctionContext<[string, string], number>) => {
      return await fetchAllCities(pageParam, 10, citySearch);
    },
    getNextPageParam: (lastPage: City[], allPages: City[][]) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
  });

  const debouncedSetCompanySearch = debounce((value: string) => {
    setCompanySearch(value);
  }, 500);

  const debouncedSetCitySearch = debounce((value: string) => {
    setCitySearch(value);
  }, 500);

  const handleCompanySelect = (company: { id: string | null; name: string; displayName: string }) => {
    onCompanySelect(company.id, company.name);
    toggleCompanyModal();
    setCompanySearch('');
  };

  const handleCitySelect = (city: { id: string | null; name: string; displayName: string }) => {
    onCitySelect(city.id, city.name);
    toggleCityModal();
    setCitySearch('');
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      onProductSearch(null);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() === '') {
      onProductSearch(null);
    } else {
      onProductSearch(searchTerm);
    }
  };

  const handleOcrClick = async () => {

    if (!selectedCityId) {
      Alert.alert('Selecciona una ciudad', 'Por favor selecciona una ciudad antes de escanear la factura');
      return;
    }
    const picture = await CameraAdapter.takePicture();
    navigation.navigate('OcrScreen', { picture, selectedCityId, selectedCityName });
  };  

  const allCompaniesOption = {
    id: null,
    name: 'Todas',
    displayName: 'Todas',
  };

  const companyNames = [
    allCompaniesOption,
    ...(companiesData?.pages.flat().map((company) => ({
      id: company.id,
      name: company.name,
      displayName: company.name,
    })) ?? []),
  ];

  const cityNames = citiesData?.pages.flat().map((city) => ({
    id: city.id,
    name: city.name,
    displayName: `${city.name} - ${city.nameDep}`,
  })) ?? [];

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    queryClient.invalidateQueries({ queryKey: ['prodcomcities', 'infinite', selectedCityId, selectedCompanyId] });
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <>
      <View style={localStyles.searchContainer}>
        <Input
          placeholder="Buscar Producto"
          value={searchTerm}
          onChangeText={handleSearchTermChange}
          style={localStyles.searchInput}
          accessoryRight={() => (
            <TouchableOpacity onPress={handleSearchClick}>
              <MyIcon name="search-outline" />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={localStyles.buttonContainer}>
        <Button
          onPress={toggleCityModal}
          appearance="filled"
          status="basic"
          size="small"
          accessoryRight={<MyIcon name="chevron-down-outline" />}
          style={[localStyles.button,{width: width * 0.25}]}
        >
          {selectedCityName}
        </Button>
        <Button
          onPress={toggleCompanyModal}
          appearance="filled"
          status="basic"
          size="small"
          accessoryRight={<MyIcon name="chevron-down-outline" />}
          style={[localStyles.button,{width: width * 0.25}]}
        >
          {selectedCompanyName}
        </Button>
        <Button
          onPress={handleOcrClick}
          appearance="filled"
          status="primary"
          size="small"
          accessoryRight={<MyIcon name="camera-outline" white />}
          style={[localStyles.buttonOCR, { backgroundColor: colors.primary, borderColor: colors.primary }]}
        >
          Escanear Factura
        </Button>
      </View>

      <Modal
        visible={isCompanyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCompanyModal}
      >
        <TouchableWithoutFeedback onPress={toggleCompanyModal}>
          <View style={localStyles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={localStyles.modalContentContainer}>
          <View style={localStyles.modalHeader}>
            <View style={localStyles.dragIndicator} />
          </View>

          <Input
            placeholder="Buscar Empresa"
            onChangeText={debouncedSetCompanySearch}
            style={localStyles.searchBar}
            accessoryRight={<MyIcon name="search-outline" />}
          />
          {companyNames.length === 0 ? (
            <Layout style={localStyles.noResultsContainer}>
              <Text>No se encontraron empresas</Text>
            </Layout>
          ) : (
            <List
              data={companyNames}
              style={{ backgroundColor: 'white' }}
              keyExtractor={(item) => item.id ?? 'all-companies'}
              renderItem={({ item }) => (
                <ListItem
                  title={item.displayName}
                  onPress={() => handleCompanySelect(item)}
                />
              )}
              onEndReached={hasNextCompaniesPage ? () => fetchNextCompaniesPage() : null}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={isCityModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCityModal}
      >
        <TouchableWithoutFeedback onPress={toggleCityModal}>
          <View style={localStyles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={localStyles.modalContentContainer}>
          <View style={localStyles.modalHeader}>
            <View style={localStyles.dragIndicator} />
          </View>

          <Input
            placeholder="Buscar Ciudad"
            onChangeText={debouncedSetCitySearch}
            style={localStyles.searchBar}
            accessoryRight={<MyIcon name="search-outline" />}
          />
          {cityNames.length === 0 ? (
            <Layout style={localStyles.noResultsContainer}>
              <Text>No cities found</Text>
            </Layout>
          ) : (
            <List
              data={cityNames}
              style={{ backgroundColor: 'white' }}
              keyExtractor={(item) => item.id ?? 'all-cities'}
              renderItem={({ item }) => (
                <ListItem
                  title={item.displayName}
                  onPress={() => handleCitySelect(item)}
                />
              )}
              onEndReached={hasNextCitiesPage ? () => fetchNextCitiesPage() : null}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </Modal>

      <FullScreenLoader />
    </>
    );
  }

  if (prodcomcities.length === 0) {
    return (
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No se encontraron productos.</Text>
      </Layout>
    );
  }

  return (
    <>
      <View style={localStyles.searchContainer}>
        <Input
          placeholder="Buscar Producto"
          value={searchTerm}
          onChangeText={handleSearchTermChange}
          style={localStyles.searchInput}
          accessoryRight={() => (
            <TouchableOpacity onPress={handleSearchClick}>
              <MyIcon name="search-outline" />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={localStyles.buttonContainer}>
        <Button
          onPress={toggleCityModal}
          appearance="filled"
          status="basic"
          size="small"
          accessoryRight={<MyIcon name="chevron-down-outline" />}
          style={[localStyles.button,{width: width * 0.25}]}
        >
          {selectedCityName}
        </Button>
        <Button
          onPress={toggleCompanyModal}
          appearance="filled"
          status="basic"
          size="small"
          accessoryRight={<MyIcon name="chevron-down-outline" />}
          style={[localStyles.button,{width: width * 0.25}]}
        >
          {selectedCompanyName}
        </Button>
        <Button
          onPress={handleOcrClick}
          appearance="filled"
          status="primary"
          size="small"
          accessoryRight={<MyIcon name="camera-outline" white />}
          style={[localStyles.buttonOCR, { backgroundColor: colors.primary, borderColor: colors.primary }]}
        >
          Escanear Factura
        </Button>
      </View>

      <Modal
        visible={isCompanyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCompanyModal}
      >
        <TouchableWithoutFeedback onPress={toggleCompanyModal}>
          <View style={localStyles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={localStyles.modalContentContainer}>
          <View style={localStyles.modalHeader}>
            <View style={localStyles.dragIndicator} />
          </View>

          <Input
            placeholder="Buscar Empresa"
            onChangeText={debouncedSetCompanySearch}
            style={localStyles.searchBar}
            accessoryRight={<MyIcon name="search-outline" />}
          />
          {companyNames.length === 0 ? (
            <Layout style={localStyles.noResultsContainer}>
              <Text>No se encontraron empresas</Text>
            </Layout>
          ) : (
            <List
              data={companyNames}
              style={{ backgroundColor: 'white' }}
              keyExtractor={(item) => item.id ?? 'all-companies'}
              renderItem={({ item }) => (
                <ListItem
                  title={item.displayName}
                  onPress={() => handleCompanySelect(item)}
                />
              )}
              onEndReached={hasNextCompaniesPage ? () => fetchNextCompaniesPage() : null}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={isCityModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCityModal}
      >
        <TouchableWithoutFeedback onPress={toggleCityModal}>
          <View style={localStyles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={localStyles.modalContentContainer}>
          <View style={localStyles.modalHeader}>
            <View style={localStyles.dragIndicator} />
          </View>

          <Input
            placeholder="Buscar Ciudad"
            onChangeText={debouncedSetCitySearch}
            style={localStyles.searchBar}
            accessoryRight={<MyIcon name="search-outline" />}
          />
          {cityNames.length === 0 ? (
            <Layout style={localStyles.noResultsContainer}>
              <Text>No cities found</Text>
            </Layout>
          ) : (
            <List
              data={cityNames}
              style={{ backgroundColor: 'white' }}
              keyExtractor={(item) => item.id ?? 'all-cities'}
              renderItem={({ item }) => (
                <ListItem
                  title={item.displayName}
                  onPress={() => handleCitySelect(item)}
                />
              )}
              onEndReached={hasNextCitiesPage ? () => fetchNextCitiesPage() : null}
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </Modal>

      <List
        data={prodcomcities}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <ProductCard prodcomcity={item} />}
        ListFooterComponent={() => <Layout style={{ height: 150 }} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        refreshControl={
          <RefreshControl refreshing={isFetching || isRefreshing} onRefresh={onPullToRefresh} />
        }
      />
    </>
  );
};

const localStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    paddingRight: 8,
    paddingLeft: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  button: {
    alignSelf: 'flex-start',
    borderColor: 'white',
    marginRight: 10,
    borderRadius: 15,
  },
  buttonOCR: {
    flex: 1,
    alignSelf: 'flex-start',
    marginRight: 10,
    borderRadius: 15,
    color: 'white',
  },
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
  modalContent: {
    maxHeight: '50%',
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  searchInput: {
    borderRadius: 15,
  },
});