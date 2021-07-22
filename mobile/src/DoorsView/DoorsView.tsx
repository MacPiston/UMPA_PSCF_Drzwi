import React, { useEffect, useState, useContext } from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  View,
  Text,
  ScrollView,
  Pressable,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/core';
import BleManager from 'react-native-ble-manager';
import { styles } from './Stylesheets/Stylesheets';
import ExpandableItem from './ExpandableItem';
import Door from './DoorType';
import BtDevice from './BtType';
import { DoorsScreenRouteProp, MainStackParams } from '../Navigation/Params';
import { SocketContext } from '../SocketIO/socket.provider';

type doorsScreenProp = StackNavigationProp<MainStackParams, 'Doors'>;
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const DoorsView: React.FC = () => {
  const [doorList, setDoorList] = useState<Door[]>([]);
  const navigation = useNavigation<doorsScreenProp>();
  const { params } = useRoute<DoorsScreenRouteProp>();
  const { email } = params;
  const { socket } = useContext(SocketContext);
  const [isScanning, setIsScanning] = useState(false);
  const [bleList, setBleList] = useState<BtDevice[]>([]);
  const peripherals = new Map();

  const refreshDoorList = () => {
    console.log('email : '.concat(email));
    socket.emit('doorsList', { email });
  };

  const logOut = () => {
    socket.disconnect();
    navigation.navigate('Login');
  };

  interface DataType {
    doorsList: Door[];
  }

  socket.on('doors', (data: DataType) => {
    const array = data.doorsList.map((item) => ({
      lockID: item.lockID,
      doorName: item.doorName,
      uuid: item.uuid,
      isOpen: item.isOpen,
      inBtRange: false,
      isExpanded: false,
    }));
    setDoorList(array);
  });

  const updateLayout = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...doorList];
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex].isExpanded = !array[placeindex].isExpanded)
        : (array[placeindex].isExpanded = false),
    );
    setDoorList(array);
  };

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, false)
        .then((results) => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
    BleManager.getDiscoveredPeripherals().then((peripheralsArray) => {
      // Success code
      console.log('Discovered peripherals: '.concat(peripheralsArray.length));
      console.log(peripheralsArray);
      peripheralsArray.forEach((device) =>
        console.log(device.advertising.serviceUUIDs),
      );
    });
  };

  const handleDisconnectedPeripheral = (data) => {
    const peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setBleList(Array.from(peripherals.values()));
    }
    console.log('Disconnected from '.concat(data.peripheral));
  };

  const handleUpdateValueForCharacteristic = (data) => {
    console.log(
      'Received data from '
        .concat(data.peripheral)
        .concat(' characteristic ')
        .concat(data.characteristic),
      data.value,
    );
  };

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length === 0) {
        console.log('No connected peripherals');
      }
      console.log(results);
      for (let i = 0; i < results.length; i += 1) {
        const peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setBleList(Array.from(peripherals.values()));
      }
    });
  };

  const handleDiscoverPeripheral = (peripheral) => {
    // console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = Math.random().toString(36).substring(7);
    }
    peripherals.set(peripheral.id, peripheral);
    setBleList(Array.from(peripherals.values()));
  };

  useEffect(() => {
    refreshDoorList();

    BleManager.enableBluetooth()
      .then(() => {
        // Success code
        console.log('The bluetooth is already enabled or the user confirm');
      })
      .catch((error) => {
        // Failure code
        console.log('The user refuse to enable bluetooth');
      });

    BleManager.start({ showAlert: false }).then(() => {
      console.log('Module initialized');
    });

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );

    if (Platform.OS === 'android' && Platform.Version >= 29) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then((result) => {
        if (result) {
          console.log('Permission is OK (API >=29)');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then((result) => {
            if (result) {
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
          ).then((result) => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }

    console.log('Scanning bluetooth devices');
    startScan();

    return () => {
      console.log('unmount');
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      );
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => {
            // alert('Zostałeś wylogowany');
            logOut();
            console.log('User is logged out');
          }}
        >
          <Icon name="log-out" style={styles.headerButton} />
        </Pressable>
        <Text style={styles.headerText}>Available doors</Text>
        <Pressable
          onPress={() => {
            console.log('Available doors list has been refreshed');
            console.log('Scanning bluetooth devices');
            // setBleList([]);
            startScan();
            refreshDoorList();
          }}
        >
          <Icon name="refresh-ccw" style={styles.headerButton} />
        </Pressable>
      </View>
      <ScrollView>
        {doorList?.map((door, key) => (
          <ExpandableItem
            key={door.lockID}
            onPressFunction={() => {
              updateLayout(key);
            }}
            item={door}
          />
        ))}
        {/* {bleList?.map((device, key) => (
          <BtExpandableItem
            key={device.lockName}
            onPressFunction={() => {
              updateLayout(key);
            }}
            item={device}
          />
        ))} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoorsView;
