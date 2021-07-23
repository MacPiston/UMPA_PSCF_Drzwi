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
import { Peripheral } from './BtTypes';
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
  const [bleList, setBleList] = useState([]);
  const [UUIDsList, setUUIDsList] = useState<string[]>([]);
  const peripherals = new Map();

  const refreshDoorList = () => {
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

  const updateInBtRange = (UUID: string) => {
    // UUIDsList.map((uuid) => {
    //   if (UUID === uuid) {
    //     return true;
    //   }
    // });
    for (const uuid of UUIDsList) {
      if (UUID == uuid) {
        return true;
      }
    }
    return false;
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
      setUUIDsList(tempArray);
    });
    doorList.forEach((door: Door) => {
      if (updateInBtRange(door.uuid) === true) {
        door.inBtRange = true;
      } else {
        door.inBtRange = false;
      }
    });
    console.log(doorList);
  };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    // console.log('Got ble peripheral', peripheral);
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoorsView;
