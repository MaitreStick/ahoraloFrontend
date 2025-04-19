import {
  InfiniteData,
  QueryFunctionContext,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {MainLayout} from "../../layouts/MainLayout";
import {ProductList} from "../../components/products/ProductList";
import {getProdcomcityByPage} from "../../../actions/products/get-prodcomcity-by-page";
import {useEffect, useRef, useState} from "react";
import {getProductsByCity} from "../../../actions/products/get-products-by-city";
import {Prodcomcity} from "../../../domain/entities/prodcomcity";
import {getProductsByCityAndCompany} from "../../../actions/products/get-products-by-city-and-company";
import {getProductsByCompany} from "../../../actions/products/get-products-by-company";
import {searchProductsByTerm} from "../../../actions/products/search-products-by-term";
import {
  Alert,
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {colors} from "../../../config/theme/ColorsTheme";
import {usePermissionStore} from "../../store/permissions/usePermissionStore";
import {useCityStore} from "../../store/location/useCityStore";
import {
  getCurrentLocation,
  reverseGeocodeLocation,
} from "../../../actions/location/location";
import {fetchAllCities} from "../../../actions/cities/fetch-all-cities";
import {City} from "../../../domain/entities/city";
import {CustomAlert} from "../../components/ui/CustomAlert";

export const HomeScreenTab = () => {
  const {selectedCityId, selectedCityName, setSelectedCity, loadSelectedCity} =
    useCityStore();

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const [selectedCompanyName, setSelectedCompanyName] = useState("Empresa");
  const [searchProduct, setSearchProduct] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const queryClient = useQueryClient();
  const {requestLocationPermission} = usePermissionStore();

  const [showCitySelectionModal, setShowCitySelectionModal] = useState(false);
  const [showCityHighlight, setShowCityHighlight] = useState(false);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  const [isCityLoaded, setIsCityLoaded] = useState(false);
  const PAGE_SIZE = 20;

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  useEffect(() => {
    const loadCity = async () => {
      await loadSelectedCity();
      setIsCityLoaded(true);
    };
    loadCity();
  }, []);

  useEffect(() => {
    if (isCityLoaded && !selectedCityId) {
      setShowCitySelectionModal(true);
    }
  }, [isCityLoaded, selectedCityId]);

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
      {iterations: 3},
    ).start(() => setShowCityHighlight(false));
  };

  const handleAutomaticSelection = async () => {
    setShowCitySelectionModal(false);
    try {
      console.log("Inicio de la selección automática");

      const permissionStatus = await requestLocationPermission();

      if (permissionStatus !== "granted") {
        setAlertTitle("Permiso denegado");
        setAlertMessage(
          "No se pudo obtener el permiso para acceder a la ubicación. Por favor, selecciona tu ciudad manualmente.",
        );
        setAlertVisible(true);
        return;
      }

      const location = await getCurrentLocation();

      const cityName = await reverseGeocodeLocation(location);

      if (!cityName) {
        setAlertTitle("No se pudo determinar la ciudad");
        setAlertMessage(
          "No se pudo obtener la ciudad a partir de tu ubicación. Por favor, selecciona tu ciudad manualmente.",
        );
        setAlertVisible(true);
        return;
      }

      const matchingCity = await findCityByName(cityName);

      if (matchingCity) {
        setSelectedCity(matchingCity.id, matchingCity.name);
        queryClient.invalidateQueries({
          queryKey: ["prodcomcities", "infinite"],
          exact: false,
        });
      } else {
        setAlertTitle("Ciudad no encontrada");
        setAlertMessage(
          'No pudimos encontrar la ciudad "${cityName}" en nuestra base de datos. Por favor, selecciona tu ciudad manualmente.',
        );
        setAlertVisible(true);
      }
    } catch (error) {
      console.error("Error en la selección automática de ciudad:", error);
      setAlertTitle("Error");
      setAlertMessage(
        "Ocurrió un error al obtener tu ubicación. Por favor, selecciona tu ciudad manualmente.",
      );
      setAlertVisible(true);
    }
  };

  const findCityByName = async (cityName: string): Promise<City | null> => {
    try {
      const normalizedCityName = normalizeString(cityName);

      const citiesData = await fetchAllCities(0, 1000, "");

      const cities = citiesData.flat();

      const normalizedCities = cities.map(city => ({
        ...city,
        normalizedName: normalizeString(city.name),
      }));

      const cityNameWords = normalizedCityName.split(" ");

      for (const word of cityNameWords) {
        const matchingCity = normalizedCities.find(
          city => city.normalizedName === word,
        );

        if (matchingCity) {
          console.log(matchingCity);
          return matchingCity;
        }
      }

      const matchingCity = normalizedCities.find(city =>
        normalizedCityName.includes(city.normalizedName),
      );

      if (matchingCity) {
        return matchingCity;
      }

      const matchingCityReverse = normalizedCities.find(city =>
        city.normalizedName.includes(normalizedCityName),
      );

      if (matchingCityReverse) {
        return matchingCityReverse;
      }

      return null;
    } catch (error) {
      console.error("Error al buscar la ciudad por nombre:", error);
      return null;
    }
  };

  const normalizeString = (str: string): string => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const onCitySelect = (cityId: string | null, cityName: string) => {
    setSelectedCity(cityId, cityName);
    queryClient.removeQueries({queryKey: ["prodcomcities", "infinite"]});
  };

  const onCompanySelect = (companyId: string | null, companyName: string) => {
    setSelectedCompanyId(companyId);
    setSelectedCompanyName(companyName);
    queryClient.removeQueries({queryKey: ["prodcomcities", "infinite"]});
  };

  const onProductSearch = (searchProduct: string | null) => {
    setSearchProduct(searchProduct);
    queryClient.removeQueries({queryKey: ["prodcomcities", "infinite"]});
  };

  const {isLoading, data, fetchNextPage, isFetching} = useInfiniteQuery<
    Prodcomcity[],
    Error,
    InfiniteData<Prodcomcity[]>,
    [string, string, string | null, string | null, string | null],
    number
  >({
    queryKey: [
      "prodcomcities",
      "infinite",
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
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length,
    initialPageParam: 0,
  });

  if (!isCityLoaded) {
    return null;
  }

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
              <Text style={homeScreenStyles.modalTitle}>
                ¿Cómo te gustaría seleccionar tu ciudad?
              </Text>
              <Text style={homeScreenStyles.modalDescription}>
                Puedes seleccionar tu ciudad manualmente o permitir que la
                detectemos automáticamente.
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
                  <Text style={homeScreenStyles.modalButtonText}>
                    Automático
                  </Text>
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
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onConfirm={handleAlertConfirm}
          confirmText="Aceptar"
        />
      </MainLayout>
    </>
  );
};

const homeScreenStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  citySelectionModal: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});
