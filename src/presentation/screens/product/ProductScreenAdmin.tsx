import { Input, Layout, Text } from "@ui-kitten/components"
import { Alert, Animated, Dimensions } from 'react-native';
import { MainLayout } from "../../layouts/MainLayout"
import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../../navigation/StackNavigator"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProdComCityByIds } from "../../../actions/products/get-prodcomcity-by-id"
import { useRef, useState } from 'react';
import { truncateText } from "../../helpers/TruncateText"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { FadeInImage } from "../../components/ui/FadeInImage"
import { Formik } from "formik"
import { Prodcomcity } from "../../../domain/entities/prodcomcity"
import { updateCreateProdcomcity } from '../../../actions/products/update-create-prodcomcity';
import { Image, StyleSheet } from "react-native"
import { CameraAdapter } from "../../../config/adapters/camera-adapter"
import { FAB } from "../../components/ui/FAB"
import { deleteProdcomcityById } from "../../../actions/products/delete-prodcomcity";
import { useNavigation } from "@react-navigation/native";
import { CustomAlert } from "../../components/ui/CustomAlert";
import { requestStoragePermission } from "../../../actions/permissions/storage";
import { Toast } from "../../components/ui/Toast";

interface Props extends StackScreenProps<RootStackParams, 'ProductScreenAdmin'> { }

export const ProductScreenAdmin = ({ route }: Props) => {
    const productIdRef = useRef(route.params.productId);
    const comcityIdRef = useRef(route.params.comcityId);
    const queryClient = useQueryClient();
    const { height } = Dimensions.get('window');
    const [toastVisible, setToastVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const navigation = useNavigation();

    const [isFabOpen, setIsFabOpen] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;

    const isNewProduct = productIdRef.current === 'new' && comcityIdRef.current === 'new';

    const showToast = () => {
        setToastVisible(true);
    };

    const hideToast = () => {
        setToastVisible(false);
    };

    const handleAlertConfirm = () => {
        setAlertVisible(false);
    };

    const { data: prodcomcity } = useQuery({
        queryKey: ['prodcomcity', comcityIdRef.current, productIdRef.current],
        queryFn: () => getProdComCityByIds(comcityIdRef.current, productIdRef.current),
    });

    const mutation = useMutation({
        mutationFn: (data: Prodcomcity) => updateCreateProdcomcity({
            ...data,
            product: {
                ...data.product,
                id: productIdRef.current
            },
            comcity: {
                ...data.comcity,
                id: comcityIdRef.current
            }
        }),
        onSuccess(data: Prodcomcity) {

            try {
                showToast();

                queryClient.invalidateQueries({
                    queryKey: ['prodcomcities', 'infinite'],
                    exact: false,
                });

                queryClient.invalidateQueries({
                    queryKey: ['prodcomcity', data.comcity.id, data.product.id],
                });

            } catch (error) {
                console.error('Error in onSuccess handler:', error);
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteProdcomcityById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['prodcomcities', 'infinite'],
                exact: false,
            });

            navigation.goBack();
        },
        onError: (error: any) => {
            console.error('Error al eliminar el producto:', error);
            setAlertTitle('Error');
            setAlertMessage('No se pudo eliminar el producto. Inténtalo de nuevo.');
            setAlertVisible(true);
        },
    });


    if (!prodcomcity) {
        return (
            <MainLayout
                title='Productos'
            >
                <Text>Parece que no se encontró ningún producto...</Text>
            </MainLayout>
        )
    }

    const toggleFab = () => {
        Animated.timing(animatedValue, {
            toValue: isFabOpen ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setIsFabOpen(!isFabOpen);
    };

    const fabDeleteStyle = {
        bottom: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [height * 0.18, height * 0.2],
        }),
        opacity: animatedValue,
    };

    const saveButtonOutputRange = isNewProduct
        ? [height * 0.18, height * 0.2]
        : [height * 0.18, height * 0.28];

    const fabSaveStyle = {
        bottom: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: saveButtonOutputRange,
        }),
        opacity: animatedValue,
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar este producto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => deleteMutation.mutate(prodcomcity.id) },
            ],
            { cancelable: true }
        );
    };


    return (
        <Formik
            initialValues={prodcomcity}
            onSubmit={mutation.mutate}
        >
            {({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
                <MainLayout
                    title={truncateText(values.product.title, 25)}
                    subTitle={`Precio: ${values.price}`}
                    rightAction={async () => {
                        const permissionStatus = await requestStoragePermission();

                        if (permissionStatus !== 'granted') {
                            setAlertTitle('Permiso denegado');
                            setAlertMessage('No se pudo obtener el permiso para acceder al almacenamiento del dispositivo.');
                            setAlertVisible(true);
                            return;
                        }
                        const photos = await CameraAdapter.getPicturesFromLibrary();
                        setFieldValue('product.images', [...values.product.images, ...photos]);
                    }}
                    rightActionIcon="image-outline"
                >
                    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                        <Layout style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
                            {
                                (values.product.images.length === 0)
                                    ? <Image source={require('../../../assets/no-product-image.png')} style={{ width: 300, height: 300 }} />
                                    : (

                                        <FlatList
                                            data={values.product.images}
                                            keyExtractor={item => item}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            renderItem={({ item }) => (
                                                <FadeInImage
                                                    uri={item}
                                                    style={{ width: 300, height: 300, marginHorizontal: 50 }}
                                                />
                                            )}
                                        />
                                    )
                            }
                        </Layout>

                        <Layout style={{ marginVertical: 5, marginHorizontal: 10 }}>
                            <Input
                                label='Título'
                                value={values.product.title}
                                onChangeText={handleChange('product.title')}
                                style={{ marginVertical: 5 }}
                            />
                            <Input
                                label='Código'
                                value={values.product.code.toString()}
                                onChangeText={handleChange('product.code')}
                                keyboardType="numeric"
                                style={{ marginVertical: 5 }}
                            />
                            <Input
                                label='Precio'
                                value={values.price.toString()}
                                onChangeText={handleChange('price')}
                                keyboardType="numeric"
                                style={{ marginVertical: 5 }}
                            />
                            <Input
                                label='Ciudad'
                                value={values.comcity.city.name}
                                onChangeText={handleChange('comcity.city.name')}
                                style={{ marginVertical: 5 }}
                            />
                            <Input
                                label='Departamento'
                                value={values.comcity.city.nameDep}
                                onChangeText={handleChange('comcity.city.nameDep')}
                                style={{ marginVertical: 5 }}
                            />
                            <Input
                                label='Empresa'
                                value={values.comcity.company.name}
                                onChangeText={handleChange('comcity.company.name')}
                                style={{ marginVertical: 5 }}
                            />
                        </Layout>

                        <Layout style={{ height: 200 }} />

                    </ScrollView>
                    <FAB
                        iconName={isFabOpen ? "close-outline" : "plus-outline"}
                        onPress={toggleFab}
                        style={[styles.fabMain, { bottom: height * 0.05 }]}
                    />

                    <Animated.View style={[fabSaveStyle]}>
                        <FAB
                            iconName="save-outline"
                            style={[styles.fabSave]}
                            onPress={() => handleSubmit()}
                            disabled={mutation.isPending}
                        />
                    </Animated.View>

                    {!isNewProduct && (
                        <Animated.View style={[fabDeleteStyle]}>
                            <FAB
                                iconName="trash-outline"
                                style={[styles.fabDelete]}
                                onPress={handleDelete}
                                disabled={deleteMutation.isPending}
                            />
                        </Animated.View>
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
                        message="Proceso Exitoso"
                        onHide={hideToast}
                    />

                </MainLayout>
            )
            }

        </Formik>
    )
}

const styles = StyleSheet.create({
    fabMain: {
        position: 'absolute',
        right: 20,
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
    },
    fabSave: {
        position: 'absolute',
        right: 20,
        borderColor: '#6dab6d',
        backgroundColor: '#6dab6d',
    },
    fabDelete: {
        position: 'absolute',
        right: 20,
        borderColor: '#de3737',
        backgroundColor: '#de3737',
    }
});
