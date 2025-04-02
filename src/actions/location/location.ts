import Geolocation from '@react-native-community/geolocation';
import {Location} from '../../infrastructure/interfaces/location';

export const getCurrentLocation = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      info => {
        resolve({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      error => {
        console.log("Can't get location");
        reject(error);
      },
      {
        enableHighAccuracy: true,
      },
    );
  });
};

export const watchCurrentLocation = (
  locationCallback: (location: Location) => void,
): number => {
  return Geolocation.watchPosition(
    info =>
      locationCallback({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error => {
      throw new Error("Can't get watchPosition");
    },
    {
      enableHighAccuracy: true,
    },
  );
};

export const clearWatchLocation = (watchId: number) => {
  Geolocation.clearWatch(watchId);
};

export const reverseGeocodeLocation = async (
  location: Location,
): Promise<string | null> => {
  const {latitude, longitude} = location;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
    );

    if (!response.ok) {
      console.error(
        'Error al realizar la solicitud de geocodificación inversa',
      );
      return null;
    }

    const data = await response.json();

    const city = data.address.city || data.address.town || data.address.village;

    return city || null;
  } catch (error) {
    console.error('Error en la geocodificación inversa:', error);
    return null;
  }
};
