import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View, Share, ActivityIndicator } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Layout, Text, Button, Icon } from '@ui-kitten/components';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useQuery } from '@tanstack/react-query';
import { getProdComCityByIds } from '../../../actions/products/get-prodcomcity-by-id';
import { FadeInImage } from '../../components/ui/FadeInImage';
import { MyIcon } from '../../components/ui/MyIcon';
import { Prodcomcity } from '../../../domain/entities/prodcomcity';
import { MainLayout } from '../../layouts/MainLayout';
import { truncateText } from '../../helpers/TruncateText';

interface Props {
    route: RouteProp<RootStackParams, 'ProductScreen'>;
}

export const ProductScreen = ({ route }: Props) => {
    const { prodcomcity: initialProdcomcity } = route.params;
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

    const { data: prodcomcity, isLoading, error } = useQuery<Prodcomcity>({
        queryKey: ['prodcomcity', initialProdcomcity.comcity.id, initialProdcomcity.product.id],
        queryFn: () => getProdComCityByIds(initialProdcomcity.comcity.id, initialProdcomcity.product.id),
    });

    const [isFavorite, setIsFavorite] = useState(false);

    const handleAddToFavorites = () => {
        // Lógica para agregar a favoritos
        setIsFavorite(!isFavorite);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `¡Mira este producto en Ahoralo!\n\n${prodcomcity?.product.title} - ${prodcomcity?.price}\n\nDescárgalo ahora: [enlace a la app]`,
            });
        } catch (error) {
            console.log('Error al compartir:', error);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error || !prodcomcity) {
        return (
            <Layout style={styles.centered}>
                <Text>Error al cargar el producto.</Text>
            </Layout>
        );
    }

    const { product, price, comcity } = prodcomcity;
    const { width } = Dimensions.get('window');

    return (
        <Layout style={{ flex: 1 }}>
            <ScrollView>
                <MainLayout
                    title={truncateText(product.title, 20)}
                    subTitle={`${price}`}
                />
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                >
                    {product.images.length > 0 ? (
                        product.images.map((imageUri, index) => (
                            <FadeInImage
                                key={index}
                                uri={imageUri}
                                style={{ width, height: 300 }}
                            />
                        ))
                    ) : (
                        <Image
                            source={require('../../../assets/no-product-image.png')}
                            style={{ width, height: 300 }}
                        />
                    )}

                </ScrollView>

                {/* Información del producto */}
                <Layout style={styles.contentContainer}>
                    <Text category="h5" style={styles.title}>
                        {product.title}
                    </Text>

                    {/* Precio y ciudad */}
                    <Layout style={styles.row}>
                        <Text>
                            Ciudad
                        </Text>
                        <Text appearance="hint" style={{ marginLeft: 8 }}>{comcity.city.name}</Text>
                    </Layout>

                    {/* Empresa */}
                    <Layout style={styles.row}>
                        <Text appearance="hint">Empresa:</Text>
                        <Text>{comcity.company.name}</Text>
                    </Layout>
                </Layout>
            </ScrollView>
        </Layout >
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 4,
    },
});
