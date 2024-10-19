import { Card, Layout, Text } from '@ui-kitten/components';
import { Image, StyleSheet } from 'react-native';
import { FadeInImage } from '../ui/FadeInImage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/StackNavigator';
import { Prodcomcity } from '../../../domain/entities/prodcomcity';

interface Props {
    prodcomcity: Prodcomcity;
}

export const ProductCard = ({ prodcomcity }:Props) => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    return (
        <Card
            style={[stylesCard.cardComponent]}
            onPress={() => navigation.navigate('ProductScreen', {
                prodcomcity: prodcomcity
            })}
        >
            <Layout style={[stylesCard.cardInternalWrapper]}>
                <Layout style={[{borderRadius: 20}]}>
                {
                    (prodcomcity.product.images.length === 0)
                    ? (<Image
                        source={require('../../../assets/no-product-image.png')}
                        style={{ width: 100, height: 120}}
                    />)
                    : (<FadeInImage
                        uri={prodcomcity.product.images[0]}
                        style={{ width: 100, height: 120 }}
                    />)
                }
                </Layout>
                
                <Layout style={[stylesCard.cardTextWrapper]}>
                    <Layout style={[stylesCard.LayoutText]}>        
                        <Text
                            numberOfLines={2}
                            style={{ textAlign: 'left' }}
                        >{ prodcomcity.product.title }</Text>
                    </Layout>
                    <Layout style={[stylesCard.LayoutText]}>
                        <Text
                        style={{ textAlign: 'center' }}
                        >
                           { prodcomcity.price }
                        </Text>
                    </Layout>
                    <Layout style={[stylesCard.LayoutText]}>
                        <Text
                        style={{ textAlign: 'center' }}
                        >
                             { prodcomcity.comcity.city.name }
                        </Text>
                    </Layout>
                </Layout>
            </Layout>

        </Card>
    )
}

const stylesCard = StyleSheet.create({
    cardComponent: {
        flex: 1, 
        borderRadius: 20, 
        margin: 1,
    },
    cardInternalWrapper: {
        flex: 1, 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        alignItems: 'center',
    },
    cardTextWrapper: {
        flex:1, 
        flexDirection:'column', 
        marginTop: 1.5
    },
    LayoutText: {
        flex: 1, 
        alignItems: "flex-start", 
        justifyContent: "center",
        paddingLeft: 20
    }
});