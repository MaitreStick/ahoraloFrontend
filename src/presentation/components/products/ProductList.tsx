import { Layout, Text } from "@ui-kitten/components";
import React, { useCallback, useState } from 'react';
import { InfiniteData, QueryFunctionContext, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Prodcomcity } from "../../../domain/entities/prodcomcity";
import { ActivityIndicator, Animated, StyleSheet, useWindowDimensions, View } from "react-native";
import { City } from "../../../domain/entities/city";
import debounce from "lodash.debounce";
import { fetchAllCompanies } from "../../../actions/companies/fetch-all-companies";
import { Company } from "../../../domain/entities/company";
import { fetchAllCities } from "../../../actions/cities/fetch-all-cities";
import { CameraAdapter } from "../../../config/adapters/camera-adapter";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../../navigation/StackNavigator";
import { useCityStore } from "../../store/location/useCityStore";
import { requestCameraPermission } from "../../../actions/permissions/camera";
import { CustomAlert } from "../ui/CustomAlert";
import { FilterButtons } from "./FilterButtons";
import { SelectionModal } from "./SelectionModal";
import { ProductsListComponent } from "./ProductListComponent";
import { SearchBar } from "./SearchBar";


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
  showCityHighlight: boolean;
  highlightAnim: Animated.Value;
}

export const ProductList = ({
  prodcomcities,
  fetchNextPage,
  selectedCompanyId,
  selectedCompanyName,
  onCitySelect,
  onCompanySelect,
  onProductSearch,
  isFetching,
  isLoading,
  showCityHighlight,
  highlightAnim,
}: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [citySearch, setCitySearch] = useState<string>('');
  const [companySearch, setCompanySearch] = useState<string>('');
  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const [isCompanyModalVisible, setCompanyModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { selectedCityId, selectedCityName } = useCityStore();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const queryClient = useQueryClient();

  const { width } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

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
      setAlertTitle('Selecciona una ciudad');
      setAlertMessage('Por favor selecciona una ciudad antes de escanear la factura');
      setAlertVisible(true);
      return;
    }
    const permissionStatus = await requestCameraPermission();
  
    if (permissionStatus !== 'granted') {
      setAlertTitle('Permiso denegado');
      setAlertMessage('No se pudo obtener el permiso para acceder a la cámara del dispositivo.');
      setAlertVisible(true);
      return;
    }
  
    navigation.navigate('CameraWithOverlay', { selectedCityId, selectedCityName });
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
        <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'white' }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
            onSearchClick={handleSearchClick}
          />
        </View>
        <FilterButtons
          selectedCityName={selectedCityName}
          selectedCompanyName={selectedCompanyName}
          showCityHighlight={showCityHighlight}
          toggleCityModal={toggleCityModal}
          toggleCompanyModal={toggleCompanyModal}
          handleOcrClick={handleOcrClick}
        />
        <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />
      </>
    );
  }

  if (prodcomcities.length === 0) {
    return (
      <>
        <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'white' }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
            onSearchClick={handleSearchClick}
          />
        </View>
        <FilterButtons
          selectedCityName={selectedCityName}
          selectedCompanyName={selectedCompanyName}
          showCityHighlight={showCityHighlight}
          toggleCityModal={toggleCityModal}
          toggleCompanyModal={toggleCompanyModal}
          handleOcrClick={handleOcrClick}
        />
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No se encontraron productos.</Text>
        </Layout>
      </>
    );
  }

  return (
    <>
      <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'white' }}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onSearchClick={handleSearchClick}
        />
      </View>
      <FilterButtons
        selectedCityName={selectedCityName}
        selectedCompanyName={selectedCompanyName}
        showCityHighlight={showCityHighlight}
        toggleCityModal={toggleCityModal}
        toggleCompanyModal={toggleCompanyModal}
        handleOcrClick={handleOcrClick}
      />

      {/* Company Selection Modal */}
      <SelectionModal
        visible={isCompanyModalVisible}
        toggleModal={toggleCompanyModal}
        searchPlaceholder="Buscar Empresa"
        onSearchChange={debouncedSetCompanySearch}
        data={companyNames}
        onSelect={handleCompanySelect}
        fetchNextPage={fetchNextCompaniesPage}
        hasNextPage={hasNextCompaniesPage}
        isLoading={isFetchingCompanies}
      />

      {/* City Selection Modal */}
      <SelectionModal
        visible={isCityModalVisible}
        toggleModal={toggleCityModal}
        searchPlaceholder="Buscar Ciudad"
        onSearchChange={debouncedSetCitySearch}
        data={cityNames}
        onSelect={handleCitySelect}
        fetchNextPage={fetchNextCitiesPage}
        hasNextPage={hasNextCitiesPage}
        isLoading={isFetchingCities}
      />

      {/* Products List */}
      <ProductsListComponent
        data={prodcomcities}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        isRefreshing={isRefreshing}
        onPullToRefresh={onPullToRefresh}
      />

      {/* Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        confirmText="Aceptar"
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