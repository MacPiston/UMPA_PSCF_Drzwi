/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';
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

const useBTManager = () => {
  let isScanning = false;
  const [UUIDsList, setUUIDsList] = useState<(string[] | undefined)[]>([]);
  const [doorsInRangeList, setDoorsInRangeList] = useState<Door[]>();
  // let newDoorsList: Door[];

  const updateInBtRange = (UUID: string[] | undefined): boolean => {
    let deviceFound = false;
    UUIDsList.forEach((e) => {
      if (e === UUID) deviceFound = true;
    });
    return deviceFound;
  };

  const handleStopScan = async (): Promise<void> => {
    console.log('Scan is stopped');
    isScanning = false;
    const peripheralsArray = await BleManager.getDiscoveredPeripherals();
    const newArray = peripheralsArray.map((el) => el.advertising.serviceUUIDs);
    setUUIDsList(newArray);
  };

  const getDoorsInRange = (doorsList: Door[]): void => {
    // const response = await handleStopScan();
    const array = [...doorsList];
    array.forEach((door: Door) => {
      if (updateInBtRange(door.uuid) === true) {
        door.inBtRange = true;
      } else {
        door.inBtRange = false;
      }
    });
    setDoorsInRangeList(array);
  };

  const initBTModule = (): void => {
    BleManager.start({ showAlert: false }).then(() => {
      console.log('Module initialized');
    });

    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
  };

  const checkPermissionAndroid = (): void => {
    if (Platform.OS === 'android' && Platform.Version >= 29) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then((result) => {
        if (result) {
          console.log('Permission is OK (API >=29)');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then((result2) => {
            if (result2) {
              console.log('User accept');
            } else {
              console.log('User refuse');
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
          console.log('Permission is OK (API < 23;28 >)');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ).then((result2) => {
            if (result2) {
              console.log('User accept');
            } else {
              console.log('User refuse');
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
          console.log('Scanning...');
          isScanning = true;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const disableBTModule = (): void => {
    bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
    BleManager.stopScan();
  };

  useEffect(() => {
    // initBTModule();
    // checkPermissionAndroid();
    console.log('Scanning bluetooth devices');
    // startScan();
  });

  return {
    doorsInRangeList,
    disableBTModule,
    initBTModule,
  };
};

export default useBTManager;
