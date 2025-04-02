/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Layout, Text, List, Card, Spinner} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {useLocationStore} from '../../store/location/useLocationStore';
import {LowestPriceByTag} from '../../../infrastructure/interfaces/ahoralo-products.response';
import {WarehouseWithDistance} from '../../../infrastructure/interfaces/WarehouseWithDistance';
import {getDistance} from 'geolib';
import {fetchWarehousesByCompanyIds} from '../../../actions/warehouses/fetchWarehousesByCompanyIds';
import {Linking} from 'react-native';
import {MyIcon} from '../../components/ui/MyIcon';
import {colors} from '../../../config/theme/ColorsTheme';

interface Props {
  lowestPriceData: LowestPriceByTag[];
}

export const NearLocationTab = ({lowestPriceData}: Props) => {
  const {lastKnownLocation, getLocation} = useLocationStore();

  const [warehousesWithDistance, setWarehousesWithDistance] = useState<
    WarehouseWithDistance[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noCompanies, setNoCompanies] = useState(false);

  useEffect(() => {
    if (!lastKnownLocation) {
      getLocation();
    }
  }, [getLocation, lastKnownLocation]);

  useEffect(() => {
    if (lastKnownLocation && lowestPriceData && lowestPriceData.length > 0) {
      const loadWarehouses = async () => {
        const companyIds = Array.from(
          new Set(lowestPriceData.map(item => item.companyId)),
        ).filter(Boolean);

        if (companyIds.length === 0) {
          console.log(
            'No hay company IDs disponibles, no se cargan los almacenes',
          );
          setIsLoading(false);
          setNoCompanies(true);
          return;
        }

        setIsLoading(true);

        try {
          const warehousesData = await fetchWarehousesByCompanyIds(companyIds);
          const warehousesWithDistance = warehousesData.map(warehouse => {
            const distance = getDistance(
              {
                latitude: lastKnownLocation.latitude,
                longitude: lastKnownLocation.longitude,
              },
              {
                latitude: warehouse.latitude,
                longitude: warehouse.longitude,
              },
            );

            return {
              ...warehouse,
              distance,
            };
          });

          warehousesWithDistance.sort((a, b) => a.distance - b.distance);

          setWarehousesWithDistance(warehousesWithDistance);
        } catch (error) {
          console.error('Error al cargar los almacenes:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadWarehouses();
    }
  }, [lowestPriceData, lastKnownLocation]);

  if (isLoading) {
    return (
      <Layout style={styles.centered}>
        <Spinner size="large" />
      </Layout>
    );
  }

  if (noCompanies) {
    return (
      <Layout style={styles.centered}>
        <Text category="s1">No hay empresas disponibles para mostrar</Text>
      </Layout>
    );
  }

  if (warehousesWithDistance.length === 0) {
    return (
      <Layout style={styles.centered}>
        <Text category="s1">No se encontraron almacenes cercanos</Text>
      </Layout>
    );
  }

  const nearestDistance = warehousesWithDistance[0].distance;

  const renderItem = ({item}: {item: WarehouseWithDistance}) => {
    const isNearest = item.distance === nearestDistance;
    const distanceDifference = item.distance - nearestDistance;
    const distanceDifferenceText = isNearest
      ? 'Más cercano'
      : `+ ${distanceDifference} metros`;

    const handleOpenGoogleMaps = () => {
      if (!lastKnownLocation) {
        console.warn('La ubicación actual no está disponible.');
        return;
      }

      const origin = `${lastKnownLocation.latitude},${lastKnownLocation.longitude}`;
      const destination = `${item.latitude},${item.longitude}`;

      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

      Linking.canOpenURL(url)
        .then(supported => {
          if (!supported) {
            console.warn('No se puede abrir Google Maps');
          } else {
            return Linking.openURL(url);
          }
        })
        .catch(err => console.error('Error al verificar Google Maps:', err));
    };

    return (
      <Card
        style={styles.card}
        status={isNearest ? 'info' : 'basic'}
        onPress={handleOpenGoogleMaps}
      >
        <Layout style={styles.cardContent}>
          <MyIcon name="map-outline" />
          <Layout style={styles.textContainer}>
            <Text category="s1" style={isNearest && styles.highlightedText}>
              {item.companyName}
            </Text>
            <Text appearance="hint" style={isNearest && styles.highlightedText}>
              {item.name}
            </Text>
            <Text style={isNearest && styles.highlightedText}>
              Distancia: {item.distance} metros ({distanceDifferenceText})
            </Text>
          </Layout>
        </Layout>
      </Card>
    );
  };

  return (
    <List
      data={warehousesWithDistance}
      renderItem={renderItem}
      contentContainerStyle={styles.listContentContainer}
      ListHeaderComponent={
        <Text category="h6" style={styles.headerTitle}>
          Almacenes cercanos:
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginVertical: 8,
    borderRadius: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  highlightedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
});
