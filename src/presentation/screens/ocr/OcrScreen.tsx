/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-native/no-inline-styles */
import {useState, useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Layout,
  Text,
  Button,
  Input,
  List,
  ListItem,
} from '@ui-kitten/components';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useNavigation} from '@react-navigation/native';
import {InfiniteData, useInfiniteQuery} from '@tanstack/react-query';
import {Company} from '../../../domain/entities/company';
import {fetchAllCompanies} from '../../../actions/companies/fetch-all-companies';
import debounce from 'lodash.debounce';
import {MyIcon} from '../../components/ui/MyIcon';
import {MainLayout} from '../../layouts/MainLayout';
import {processImageWithOCR} from '../../../actions/ocr/processImageWithOCR';
import {getComcityByCityAndCompany} from '../../../actions/comcities/getComcityByCityAndCompany';
import {CustomAlert} from '../../components/ui/CustomAlert';
import {Toast} from '../../components/ui/Toast';
import {Ocr} from '../../../domain/entities/ocr';
import {colors} from '../../../config/theme/ColorsTheme';

type Props = StackScreenProps<RootStackParams, 'OcrScreen'>;

export const OcrScreen = ({route}: Props) => {
  const {
    picture: pictureArray,
    selectedCityId,
    selectedCityName,
  } = route.params;
  const picture = Array.isArray(pictureArray) ? pictureArray[0] : pictureArray;
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [companySearch, setCompanySearch] = useState<string>('');
  const [isCompanyModalVisible, setCompanyModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [ocrResult, setOcrResult] = useState<Ocr | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();

  const {height} = useWindowDimensions();

  const handleAlertConfirm = () => {
    setAlertVisible(false);
  };

  const showToast = () => {
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const toggleCompanyModal = useCallback(() => {
    setCompanyModalVisible(prev => !prev);
  }, []);

  const debouncedSetCompanySearch = debounce((value: string) => {
    setCompanySearch(value);
  }, 500);

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
    queryFn: async ({pageParam = 0}) => {
      return await fetchAllCompanies(pageParam, 10, companySearch);
    },
    getNextPageParam: (lastPage: Company[], allPages) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
  });

  const companyNames =
    companiesData?.pages.flat().map(company => ({
      id: company.id,
      name: company.name,
    })) ?? [];

  const handleCompanySelect = (company: {id: string; name: string}) => {
    setSelectedCompanyId(company.id);
    setSelectedCompanyName(company.name);
    toggleCompanyModal();
    setCompanySearch('');
  };

  const handleProcessImage = async () => {
    if (!selectedCompanyId) {
      setAlertTitle('Empresa no seleccionada');
      setAlertMessage('Por favor, selecciona una empresa.');
      setAlertVisible(true);
      return;
    }

    setIsProcessing(true);

    try {
      const comcityData = await getComcityByCityAndCompany(
        selectedCompanyId,
        selectedCityId,
      );
      const comcityId = comcityData.id;

      if (!comcityId) {
        throw new Error(
          'No se encontró comcity para la ciudad y empresa seleccionadas.',
        );
      }
      console.log('comcityId:', comcityId);

      const ocrData = await processImageWithOCR(picture, comcityId);

      setOcrResult(ocrData);

      showToast();
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      setAlertTitle('Error');
      setAlertMessage(
        'Ocurrió un error al procesar la imagen. Por favor, inténtalo de nuevo.',
      );
      setAlertVisible(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Funciones para renderizar encabezado y pie de página
  const renderHeader = () => (
    <>
      <Image source={{uri: picture}} style={styles.image} />
      <Text category="label" style={styles.label}>
        Ciudad
      </Text>
      <Input value={selectedCityName} disabled style={styles.input} />

      <Text category="label" style={styles.label}>
        Empresa
      </Text>
      <Input
        style={styles.input}
        placeholder="Seleccionar Empresa"
        disabled
        accessoryRight={() => (
          <TouchableOpacity onPress={toggleCompanyModal}>
            <MyIcon name="chevron-down-outline" />
          </TouchableOpacity>
        )}
      >
        {selectedCompanyName}
      </Input>

      <Button
        onPress={handleProcessImage}
        style={styles.button}
        disabled={isProcessing}
      >
        {isProcessing ? 'Procesando...' : 'Enviar mi aporte'}
      </Button>

      {isProcessing && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{marginTop: 20}}
        />
      )}
    </>
  );

  const renderFooter = () => (
    <>
      {ocrResult && (
        <View style={styles.resultsContainer}>
          {ocrResult.products.length > 0 ? (
            <></>
          ) : (
            <>
              <Text style={styles.noProductsText}>
                ocrResult: {ocrResult.text}
              </Text>
              <Text style={styles.noProductsText}>
                No se pudo actualizar la información.
              </Text>
            </>
          )}

          <Button onPress={() => navigation.goBack()} style={styles.backButton}>
            Volver
          </Button>

          <Layout
            style={{
              flex: 1,
              height: height * 0.15,
              backgroundColor: colors.background,
            }}
          />
        </View>
      )}

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        confirmText="Aceptar"
      />
      <Toast
        visible={toastVisible}
        message="Gracias por tu aporte"
        onHide={hideToast}
      />
    </>
  );

  const mainData =
    ocrResult && ocrResult.products.length > 0 ? ocrResult.products : [];

  return (
    <MainLayout title="Escanear Factura">
      <FlatList
        data={mainData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.productItem}>
            <Text style={styles.resultsTitle} />
            <Text style={styles.resultsTitle}>Productos actualizados:</Text>
            <Text style={styles.productCode}>Código: {item.code}</Text>
            <Text style={styles.productPrice}>Precio: ${item.price}</Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          ocrResult && (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>
                ocrResult: {ocrResult.text}
              </Text>
              <Text style={styles.noProductsText}>
                No se pudo actualizar la información.
              </Text>
            </View>
          )
        }
      />

      {/* Modal para seleccionar empresa */}
      <Modal
        visible={isCompanyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleCompanyModal}
      >
        <TouchableWithoutFeedback onPress={toggleCompanyModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContentContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.dragIndicator} />
          </View>

          <Input
            placeholder="Buscar Empresa"
            onChangeText={debouncedSetCompanySearch}
            style={styles.searchBar}
            accessoryRight={<MyIcon name="search-outline" />}
          />

          {companyNames.length === 0 ? (
            <Layout style={styles.noResultsContainer}>
              <Text>No se encontraron empresas</Text>
            </Layout>
          ) : (
            <List
              data={companyNames}
              style={{backgroundColor: 'white'}}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <ListItem
                  title={item.name}
                  onPress={() => handleCompanySelect(item)}
                />
              )}
              onEndReached={
                hasNextCompaniesPage ? () => fetchNextCompaniesPage() : null
              }
              onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </Modal>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  image: {width: '100%', height: 350, marginBottom: 16},
  label: {marginHorizontal: 10},
  input: {marginVertical: 5, marginHorizontal: 10},
  button: {marginTop: 16, marginHorizontal: 16},
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
  resultsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noProductsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noProductsText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  productItem: {
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  productCode: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    marginHorizontal: 16,
  },
});
