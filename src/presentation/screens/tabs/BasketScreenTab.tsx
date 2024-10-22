import { Layout, Text, List, ListItem, Button, Divider } from '@ui-kitten/components';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useBasketStore } from '../../store/basket/useBasketStore';
import { Prodcomcity } from '../../../domain/entities/prodcomcity';
import { MainLayout } from '../../layouts/MainLayout';
import { useMemo } from 'react';
import { MyIcon } from '../../components/ui/MyIcon';


export const BasketScreenTab = () => {
    const items = useBasketStore((state) => state.items);
    const removeItem = useBasketStore((state) => state.removeItem);
    const clearBasket = useBasketStore((state) => state.clearBasket);

    const renderItem = ({ item }: { item: Prodcomcity }) => (
        <ListItem
            title={item.product.title}
            description={`Precio: $${item.price} - Empresa: ${item.comcity.company.name}`}
            accessoryLeft={() =>
                item.product.images.length > 0 ? (
                    <Image
                        source={{ uri: item.product.images[0] }}
                        style={{ width: 60, height: 60 }}
                    />
                ) : (
                    <Image
                        source={require('../../../assets/no-product-image.png')}
                        style={{ width: 60, height: 60 }}
                    />
                )
            }
            accessoryRight={() => (
                <TouchableOpacity onPress={() => removeItem(item.product.id)}>
                    <MyIcon name="trash-2-outline" color="color-danger-500" />
                </TouchableOpacity>
            )}
            style={styles.listItem}
        />
    );

    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price, 0);
    }, [items]);


    return (
        <MainLayout title='Canasta' showBackAction={false}>
            <Layout style={styles.container}>
                {items.length === 0 ? (
                    <Layout style={styles.emptyContainer}>
                        <Text category="h6">El carrito está vacío</Text>
                    </Layout>
                ) : (
                    <>
                        <List
                            data={items}
                            ItemSeparatorComponent={Divider}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContentContainer}
                        />
                        <Layout style={styles.footer}>
                            <Text category="h6">Total: ${total.toFixed(2)}</Text>
                            <Button style={styles.button} onPress={clearBasket}>
                                Vaciar Carrito
                            </Button>
                        </Layout>
                    </>
                )}
            </Layout>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    footer: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
    },
    button: {
        marginLeft: 16,
        borderRadius: 20,
    },
    listItem: { 
        borderRadius: 12,
        marginVertical: 4, 
      },
});
