import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  PermissionStatus as RNPermissionStatus,
} from 'react-native-permissions';
import type {PermissionStatus} from '../../infrastructure/interfaces/permissions';
import {Platform} from 'react-native';

export const requestStoragePermission = async (): Promise<PermissionStatus> => {
  let status: RNPermissionStatus = 'unavailable';

  if (Platform.OS === 'ios') {
    status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
  } else if (Platform.OS === 'android') {
    const androidVersion = Platform.Version;

    if (androidVersion >= 33) {
      status = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    } else if (androidVersion >= 29) {
      status = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    } else {
      status = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }
  } else {
    throw new Error('Unsupported platform');
  }

  if (status === 'blocked') {
    await openSettings();
    return await checkStoragePermission();
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

export const checkStoragePermission = async (): Promise<PermissionStatus> => {
  let status: RNPermissionStatus = 'unavailable';

  if (Platform.OS === 'ios') {
    status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
  } else if (Platform.OS === 'android') {
    const androidVersion = Platform.Version;

    if (androidVersion >= 33) {
      status = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    } else if (androidVersion >= 29) {
      status = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    } else {
      status = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }
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
