/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useMemo, useEffect} from "react";
import {
  Layout,
  Text,
  List,
  ListItem,
  Button,
  Divider,
} from "@ui-kitten/components";
import {Image, StyleSheet, TouchableOpacity, Linking} from "react-native";
import {useBasketStore} from "../../store/basket/useBasketStore";
import {Prodcomcity} from "../../../domain/entities/prodcomcity";
import {MainLayout} from "../../layouts/MainLayout";
import {MyIcon} from "../../components/ui/MyIcon";
import {useLocationStore} from "../../store/location/useLocationStore";
import {fetchWarehousesByCompanyIds} from "../../../actions/warehouses/fetchWarehousesByCompanyIds";
import {getDistance} from "geolib";

export const BasketScreenTab = () => {
  const items = useBasketStore(state => state.items);
  const removeItem = useBasketStore(state => state.removeItem);
  const clearBasket = useBasketStore(state => state.clearBasket);

  const {lastKnownLocation, getLocation} = useLocationStore();

  useEffect(() => {
    if (!lastKnownLocation) {
      getLocation();
    }
  }, [lastKnownLocation]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  const handleViewRoute = async () => {
    if (!lastKnownLocation) {
      console.warn("La ubicación actual no está disponible.");
      return;
    }

    const companyIds = Array.from(
      new Set(items.map(item => item.comcity.company.id)),
    ).filter(Boolean);

    if (companyIds.length === 0) {
      console.warn("No hay empresas disponibles para mostrar");
      return;
    }

    try {
      const warehousesData = await fetchWarehousesByCompanyIds(companyIds);

      const nearestWarehouses = companyIds
        .map(companyId => {
          const companyWarehouses = warehousesData.filter(
            warehouse => warehouse.companyId === companyId,
          );

          if (companyWarehouses.length === 0) {
            return null;
          }

          const warehousesWithDistance = companyWarehouses.map(warehouse => {
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
            return {...warehouse, distance};
          });

          warehousesWithDistance.sort((a, b) => a.distance - b.distance);
          return warehousesWithDistance[0];
        })
        .filter(Boolean);

      if (nearestWarehouses.length === 0) {
        console.warn(
          "No se encontraron almacenes cercanos para las empresas en la canasta.",
        );
        return;
      }

      nearestWarehouses.sort(
        (a, b) => (a?.distance ?? Infinity) - (b?.distance ?? Infinity),
      );

      const locations = [
        `${lastKnownLocation.latitude},${lastKnownLocation.longitude}`,
        ...nearestWarehouses
          .map(loc => (loc ? `${loc.latitude},${loc.longitude}` : ""))
          .filter(Boolean),
      ];

      let url = `https://www.google.com/maps/dir/?api=1&origin=${
        locations[0]
      }&destination=${locations[locations.length - 1]}`;

      if (locations.length > 2) {
        const waypoints = locations.slice(1, -1).join("|");
        url += `&waypoints=${encodeURIComponent(waypoints)}`;
      }

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.warn("No se puede abrir Google Maps");
      }
    } catch (error) {
      console.error("Error al cargar los almacenes:", error);
    }
  };

  const renderItem = ({item}: {item: Prodcomcity}) => (
    <ListItem
      title={item.product.title}
      description={`Precio: $${item.price} - Empresa: ${item.comcity.company.name}`}
      accessoryLeft={() =>
        item.product.images.length > 0 ? (
          <Image
            source={{uri: item.product.images[0]}}
            style={{width: 60, height: 60}}
          />
        ) : (
          <Image
            source={require("../../../assets/no-product-image.png")}
            style={{width: 60, height: 60}}
          />
        )
      }
      accessoryRight={() => (
        <TouchableOpacity onPress={() => removeItem(item.product.id)}>
          <MyIcon name="checkmark-outline" color="color-success-500" />
        </TouchableOpacity>
      )}
      style={styles.listItem}
    />
  );

  return (
    <MainLayout title="Canasta" showBackAction={false}>
      <Layout style={styles.container}>
        {items.length === 0 ? (
          <Layout style={styles.emptyContainer}>
            <Text category="h6">La canasta está vacía</Text>
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
                Vaciar Canasta
              </Button>
              <Button style={styles.button} onPress={handleViewRoute}>
                Ver Ruta
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
    justifyContent: "center",
    alignItems: "center",
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  footer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
  },
  button: {
    marginLeft: 16,
    marginTop: 8,
    borderRadius: 20,
  },
  listItem: {
    borderRadius: 12,
    marginVertical: 4,
  },
});
