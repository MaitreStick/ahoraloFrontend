import { InfiniteData, QueryFunctionContext, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../../layouts/MainLayout';
import { ProductList } from '../../components/products/ProductList';
import { getProdcomcityByPage } from '../../../actions/products/get-prodcomcity-by-page';
import { useEffect, useRef, useState } from 'react';
import { getProductsByCity } from '../../../actions/products/get-products-by-city';
import { Prodcomcity } from '../../../domain/entities/prodcomcity';
import { getProductsByCityAndCompany } from '../../../actions/products/get-products-by-city-and-company';
import { getProductsByCompany } from '../../../actions/products/get-products-by-company';
import { searchProductsByTerm } from '../../../actions/products/search-products-by-term';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../config/theme/ColorsTheme';
import { usePermissionStore } from '../../store/permissions/usePermissionStore';


export const HomeScreenTab = () => {

  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCityName, setSelectedCityName] = useState('Ciudad');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState('Empresa');
  const [searchProduct, setSearchProduct] = useState<string | null>(null);;

  const queryClient = useQueryClient();
  const { requestLocationPermission } = usePermissionStore();

  const [showCitySelectionModal, setShowCitySelectionModal] = useState(false);
  const [showCityHighlight, setShowCityHighlight] = useState(false);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setShowCitySelectionModal(true);
  }, []);

  const handleManualSelection = () => {
    setShowCitySelectionModal(false);
    setShowCityHighlight(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(highlightAnim, {
          toValue: 1,
          duration: 125,
          useNativeDriver: false,
        }),
        Animated.timing(highlightAnim, {
          toValue: 0,
          duration: 125,
          useNativeDriver: false,
        }),
      ]),
      { iterations: 3 }
    ).start(() => setShowCityHighlight(false));
  };

  const handleAutomaticSelection = async () => {
    setShowCitySelectionModal(false);
    requestLocationPermission();
  };

  const onCitySelect = (cityId: string | null, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedCityName(cityName);
    queryClient.removeQueries({ queryKey: ['prodcomcities', 'infinite'] });
  };

  const onCompanySelect = (companyId: string | null, companyName: string) => {
    setSelectedCompanyId(companyId);
    setSelectedCompanyName(companyName);
    queryClient.removeQueries({ queryKey: ['prodcomcities', 'infinite'] });
  };

  const onProductSearch = (searchProduct: string | null) => {
    setSearchProduct(searchProduct);
    queryClient.removeQueries({ queryKey: ['prodcomcities', 'infinite'] });
  };

  const {
    isLoading,
    data,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery<
    Prodcomcity[],
    Error,
    InfiniteData<Prodcomcity[]>,
    [string, string, string | null, string | null, string | null],
    number
  >({
    queryKey: ['prodcomcities', 'infinite', selectedCityId, selectedCompanyId, searchProduct],
    queryFn: async ({ pageParam = 0 }: QueryFunctionContext<[string, string, string | null, string | null, string | null], number>): Promise<Prodcomcity[]> => {
      if (searchProduct) {
        return await searchProductsByTerm(searchProduct, selectedCityId, selectedCompanyId, pageParam);
      } else if (selectedCityId && selectedCompanyId) {
        return await getProductsByCityAndCompany(selectedCityId, selectedCompanyId, pageParam);
      } else if (selectedCityId) {
        return await getProductsByCity(selectedCityId, pageParam);
      } else if (selectedCompanyId) {
        return await getProductsByCompany(selectedCompanyId, pageParam);
      } else {
        return await getProdcomcityByPage(pageParam);
      }
    },
    getNextPageParam: (lastPage: Prodcomcity[], allPages: InfiniteData<Prodcomcity[]>['pages']) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <>
      <MainLayout title="Ahoralo - Productos" showBackAction={false}>

        <Modal
          transparent
          visible={showCitySelectionModal}
          animationType="fade"
          onRequestClose={() => setShowCitySelectionModal(false)}
        >
          <View style={homeScreenStyles.modalOverlay}>
            <View style={homeScreenStyles.citySelectionModal}>
              <Text style={homeScreenStyles.modalTitle}>¿Cómo te gustaría seleccionar tu ciudad?</Text>
              <Text style={homeScreenStyles.modalDescription}>
                Puedes seleccionar tu ciudad manualmente o permitir que la detectemos automáticamente.
              </Text>
              <View style={homeScreenStyles.modalButtonsContainer}>
                <TouchableOpacity
                  style={homeScreenStyles.modalButton}
                  onPress={handleManualSelection}
                >
                  <Text style={homeScreenStyles.modalButtonText}>Manual</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={homeScreenStyles.modalButton}
                  onPress={handleAutomaticSelection}
                >
                  <Text style={homeScreenStyles.modalButtonText}>Automático</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <ProductList
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
          showCityHighlight={showCityHighlight}
          highlightAnim={highlightAnim}
        />
      </MainLayout>
    </>
  );
};

const homeScreenStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  citySelectionModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});