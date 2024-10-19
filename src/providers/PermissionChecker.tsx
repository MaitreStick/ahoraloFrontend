import {PropsWithChildren, useEffect} from 'react';
import {AppState} from 'react-native';
import { usePermissionStore } from '../presentation/store/permissions/usePermissionStore';

export const PermissionsChecker = ({children}: PropsWithChildren) => {
  const {checkLocationPermission} = usePermissionStore();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
};