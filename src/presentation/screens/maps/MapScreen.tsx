import { ActivityIndicator, View } from 'react-native';
import { MainLayout } from '../../layouts/MainLayout';
import { useLocationStore } from '../../store/location/useLocationStore';
import { Map } from '../../components/maps/Map';
import { useEffect } from 'react';

export const MapScreen = () => {

    const { lastKnownLocation, getLocation } = useLocationStore();

    useEffect(() => {
        if (lastKnownLocation === null) {
            getLocation();
        }
    }, [])

    if (lastKnownLocation === null) {
        return (
            <MainLayout title="Ubicación más cercana">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </MainLayout>
        )
    }


    return (
        <MainLayout title="Ubicación más cercana">
            <Map initialLocation={lastKnownLocation} />
        </MainLayout>
    )
}
