/* eslint-disable no-param-reassign */
import { useState } from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Door } from './DoorType';
import { Peripheral } from './BtTypes';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

let isScanning = false;
let UUIDsList: string[];
let newDoorsList: Door[];
const peripherals = new Map();

// const [isScanning, setIsScanning] = useState(false);
// const [bleList, setBleList] = useState([]);
// const [UUIDsList, setUUIDsList] = useState<string[]>([]);
// const [newDoorsList, setNewDoorsList] = useState<Door[]>([]);
// const peripherals = new Map();

const handleDiscoverPeripheral = (peripheral: Peripheral) => {
  peripherals.set(peripheral.id, peripheral);
  //   setBleList(Array.from(peripherals.values()));
};

const updateInBtRange = (UUID: string) => {
  let deviceFound = false;
  UUIDsList.forEach((e) => {
    if (e === UUID) deviceFound = true;
  });
  return deviceFound;
};

const handleStopScan = (doorsList: Door[]) => {
  console.log('Scan is stopped');
  isScanning = false;
  BleManager.getDiscoveredPeripherals().then((peripheralsArray) => {
    console.log(
      'Discovered peripherals: '.concat(peripheralsArray.length.toString()),
    );
    peripheralsArray.forEach((device) =>
      console.log(device.advertising.serviceUUIDs),
    );
    const tempArray = new Array(peripheralsArray.length);
    for (let i = 0; i < peripheralsArray.length; i += 1) {
      tempArray[i] = peripheralsArray[i].advertising.serviceUUIDs;
    }
    UUIDsList = tempArray;
  });
  const array = [...doorsList];
  array.forEach((door: Door) => {
    if (updateInBtRange(door.uuid) === true) {
      door.inBtRange = true;
    } else {
      door.inBtRange = false;
    }
  });
  newDoorsList = array;
};

export const getDoorsInRange = () => {
  return newDoorsList;
};

export const initBTModule = () => {
  BleManager.start({ showAlert: false }).then(() => {
    console.log('Module initialized');
  });

  bleManagerEmitter.addListener(
    'BleManagerDiscoverPeripheral',
    handleDiscoverPeripheral,
  );
  bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
};

export const checkPermissionAndroid = () => {
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

export const startScan = () => {
  if (!isScanning) {
    BleManager.scan([], 5, false)
      .then(() => {
        console.log('Scanning...');
        isScanning = true;
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

export const disableBTModule = () => {
  bleManagerEmitter.removeListener(
    'BleManagerDiscoverPeripheral',
    handleDiscoverPeripheral,
  );
  bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
  BleManager.stopScan();
};
