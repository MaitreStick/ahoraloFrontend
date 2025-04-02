import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  PermissionStatus as RNPermissionStatus,
} from 'react-native-permissions';
import type {PermissionStatus} from '../../infrastructure/interfaces/permissions';
import {Platform} from 'react-native';

export const requestCameraPermission = async (): Promise<PermissionStatus> => {
  let status: RNPermissionStatus = 'unavailable';

  if (Platform.OS === 'ios') {
    status = await request(PERMISSIONS.IOS.CAMERA);
  } else if (Platform.OS === 'android') {
    status = await request(PERMISSIONS.ANDROID.CAMERA);
  } else {
    throw new Error('Unsupported platform');
  }

  if (status === 'blocked') {
    await openSettings();
    return await checkCameraPermission();
  }

  const permissionMapper: Record<RNPermissionStatus, PermissionStatus> = {
    granted: 'granted',
    denied: 'denied',
    blocked: 'blocked',
    unavailable: 'unavailable',
    limited: 'limited',
  };

  return permissionMapper[status] ?? 'unavailable';
};

export const checkCameraPermission = async (): Promise<PermissionStatus> => {
  let status: RNPermissionStatus = 'unavailable';

  if (Platform.OS === 'ios') {
    status = await check(PERMISSIONS.IOS.CAMERA);
  } else if (Platform.OS === 'android') {
    status = await check(PERMISSIONS.ANDROID.CAMERA);
  } else {
    throw new Error('Unsupported platform');
  }

  const permissionMapper: Record<RNPermissionStatus, PermissionStatus> = {
    granted: 'granted',
    denied: 'denied',
    blocked: 'blocked',
    unavailable: 'unavailable',
    limited: 'limited',
  };

  return permissionMapper[status] ?? 'unavailable';
};
