/* eslint-disable no-param-reassign */
import { useEffect, useState, useCallback } from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Door } from './DoorType';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const useBTManager = (): {
  UUIDsList: string[];
  startScan: () => void;
  disableBTModule: () => void;
  getDoorsInRange: (doorsList: Door[]) => Door[];
} => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [UUIDsList, setUUIDsList] = useState<string[]>([]);
  const [doorsInRangeList, setDoorsInRangeList] = useState<Door[]>();
  let permissionGranted: boolean;

  const updateInBtRange = (UUID: string): boolean => {
    let deviceFound = false;
    UUIDsList.forEach((e) => {
      if (UUID) {
        if (e === UUID) {
          deviceFound = true;
        }
      }
    });
    return deviceFound;
  };

  const filter = (el: BleManager.Peripheral): string => {
    if (el.advertising.serviceUUIDs !== undefined) {
      return el.advertising.serviceUUIDs[0];
    }
    return 'blank';
  };

  const handleStopScan = async (): Promise<void> => {
    setIsScanning(false);
    const peripheralsArray = await BleManager.getDiscoveredPeripherals();
    if (peripheralsArray !== undefined) {
      const newArray = peripheralsArray
        .filter((el) => el !== undefined)
        .map((el) => filter(el));
      setUUIDsList(newArray);
    }
  };

  const getDoorsInRange = useCallback(
    (doorsList: Door[]): Door[] => {
      doorsList.forEach((door: Door) => {
        if (updateInBtRange(door.uuid) === true) {
          door.inBtRange = true;
        } else {
          door.inBtRange = false;
        }
      });
      setDoorsInRangeList(doorsList);
      return doorsList;
    },
    [UUIDsList],
  );

  const initBTModule = (): void => {
    BleManager.start({ showAlert: false });

    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
  };

  const checkPermissionAndroid = (): void => {
    if (Platform.OS === 'android' && Platform.Version >= 29) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then((result) => {
        if (result) {
          permissionGranted = true;
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then((result2) => {
            if (result2) {
              permissionGranted = true;
            } else {
              permissionGranted = false;
            }
          });
        }
      });
    } else if (
      Platform.OS === 'android' &&
      Platform.Version >= 23 &&
      Platform.Version <= 28
    ) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then((result) => {
        if (result) {
          permissionGranted = true;
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ).then((result2) => {
            if (result2) {
              permissionGranted = true;
            } else {
              permissionGranted = false;
            }
          });
        }
      });
    }
  };

  const startScan = (): void => {
    if (!isScanning) {
      BleManager.scan([], 3, false)
        .then(() => {
          if (permissionGranted) setIsScanning(true);
        })
        .catch(() => {
          setIsScanning(false);
        });
    }
  };

  const disableBTModule = (): void => {
    bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
    BleManager.stopScan();
  };

  useEffect(() => {
    initBTModule();
    checkPermissionAndroid();
    startScan();
  }, []);

  return {
    UUIDsList,
    startScan,
    disableBTModule,
    getDoorsInRange,
  };
};

export default useBTManager;
