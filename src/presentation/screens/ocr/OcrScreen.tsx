import React, { useState, useCallback } from 'react';
import { View, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Layout, Text, Button, Input, List, ListItem } from '@ui-kitten/components';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useNavigation } from '@react-navigation/native';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { Company } from '../../../domain/entities/company';
import { fetchAllCompanies } from '../../../actions/companies/fetch-all-companies';
import debounce from 'lodash.debounce';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { MyIcon } from '../../components/ui/MyIcon';
import { MainLayout } from '../../layouts/MainLayout';
import { processImageWithOCR } from '../../../actions/ocr/processImageWithOCR';
import { getComcityByCityAndCompany } from '../../../actions/comcities/getComcityByCityAndCompany';

type Props = StackScreenProps<RootStackParams, 'OcrScreen'>;

export const OcrScreen = ({ route }: Props) => {
    const { picture: pictureArray, selectedCityId, selectedCityName } = route.params;
    const picture = Array.isArray(pictureArray) ? pictureArray[0] : pictureArray;
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [selectedCompanyName, setSelectedCompanyName] = useState('');
    const [companySearch, setCompanySearch] = useState<string>('');
    const [isCompanyModalVisible, setCompanyModalVisible] = useState(false);

    const navigation = useNavigation();

    const toggleCompanyModal = useCallback(() => {
        setCompanyModalVisible((prev) => !prev);
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
        queryFn: async ({ pageParam = 0 }) => {
            return await fetchAllCompanies(pageParam, 10, companySearch);
        },
        getNextPageParam: (lastPage: Company[], allPages) => {
            return lastPage.length === 0 ? undefined : allPages.length;
        },
        initialPageParam: 0,
        staleTime: 1000 * 60 * 60,
    });

    const companyNames = companiesData?.pages.flat().map((company) => ({
        id: company.id,
        name: company.name,
    })) ?? [];

    const handleCompanySelect = (company: { id: string; name: string }) => {
        setSelectedCompanyId(company.id);
        setSelectedCompanyName(company.name);
        toggleCompanyModal();
        setCompanySearch('');
    };

    const handleProcessImage = async () => {
        if (!selectedCompanyId) {
            Alert.alert('Empresa no seleccionada', 'Por favor, seleccione una empresa antes de continuar.');
            return;
        }
    
        try {
            // Obtener comcityId
            const comcityData = await getComcityByCityAndCompany(selectedCompanyId, selectedCityId);
            const comcityId = comcityData.id;
    
            if (!comcityId) {
                throw new Error('No se encontró comcity para la ciudad y empresa seleccionadas.');
            }
    
            const ocrResult = await processImageWithOCR(picture, comcityId);
    
            console.log('Resultado del OCR:', ocrResult);
    
            navigation.goBack();
    
        } catch (error) {
            console.error('Error al procesar la imagen:', error);
            Alert.alert('Error', 'Ocurrió un error al procesar la imagen. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <MainLayout title='Escanear Factura'>
            <Image source={{ uri: picture }} style={styles.image} />
            <Text category='label' style={styles.label}>Ciudad</Text>
            <Input value={selectedCityName} disabled style={styles.input} />

            <Text category='label' style={styles.label}>Empresa</Text>
            <Input 
            style={styles.input} 
            placeholder='Seleccionar Empresa'
            disabled 
            accessoryRight={() => (
                <TouchableOpacity onPress={toggleCompanyModal}>
                  <MyIcon name="chevron-down-outline" />
                </TouchableOpacity>
              )}
            >
                {selectedCompanyName}
            </Input>

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
                            style={{ backgroundColor: 'white' }}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <ListItem
                                    title={item.name}
                                    onPress={() => handleCompanySelect(item)}
                                />
                            )}
                            onEndReached={hasNextCompaniesPage ? () => fetchNextCompaniesPage() : null}
                            onEndReachedThreshold={0.5}
                        />
                    )}
                </View>
            </Modal>

            <Button onPress={handleProcessImage} style={styles.button}>Enviar mi aporte</Button>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { textAlign: 'center', marginBottom: 16 },
    image: { width: '100%', height: 350, marginBottom: 16 },
    label: {  marginHorizontal: 10 },
    input: { marginVertical: 5, marginHorizontal: 10 },
    button: { marginTop: 16 },
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
});