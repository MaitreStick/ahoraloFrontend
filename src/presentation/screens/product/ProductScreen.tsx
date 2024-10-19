import { Dimensions, Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Layout, Text } from '@ui-kitten/components';
import { RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { useQuery } from '@tanstack/react-query';
import { getProdComCityByIds } from '../../../actions/products/get-prodcomcity-by-id';
import { FadeInImage } from '../../components/ui/FadeInImage';
import { Prodcomcity } from '../../../domain/entities/prodcomcity';
import { MainLayout } from '../../layouts/MainLayout';
import { truncateText } from '../../helpers/TruncateText';
import { TopTabNavigator } from '../../navigation/TopTabNavigator';

interface Props {
    route: RouteProp<RootStackParams, 'ProductScreen'>;
}

export const ProductScreen = ({ route }: Props) => {
    const { prodcomcity: initialProdcomcity } = route.params;

    const { data: prodcomcity, isLoading, error } = useQuery<Prodcomcity>({
        queryKey: ['prodcomcity', initialProdcomcity.comcity.id, initialProdcomcity.product.id],
        queryFn: () => getProdComCityByIds(initialProdcomcity.comcity.id, initialProdcomcity.product.id),
    });

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

    const { product, price } = prodcomcity;
    const { width } = Dimensions.get('window');

    return (
        <MainLayout
            title={truncateText(product.title, 25)}
            subTitle={`${price}`}
        >
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1, backgroundColor: 'white' }}
            >
                <Layout style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
                    {product.images.length > 0 ? (
                        product.images.map((imageUri, index) => (
                            <FadeInImage
                                key={index}
                                uri={imageUri}
                                style={{ width, height: 300}}
                            />
                        ))
                    ) : (
                        <Image
                            source={require('../../../assets/no-product-image.png')}
                            style={{ width, height: 300 }} 
                        />
                    )}

                </Layout >
            </ScrollView>
            <Layout style={{ flex:1.5 }}>
            <TopTabNavigator prodcomcity={prodcomcity} />
            </Layout>
        </MainLayout>
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
