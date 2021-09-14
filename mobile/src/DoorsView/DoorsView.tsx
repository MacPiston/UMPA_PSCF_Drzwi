/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/core';
import BleManager from 'react-native-ble-manager';
import { styles } from './Stylesheets/Stylesheets';
import ExpandableItem from './ExpandableItem';
import { MainStackParams } from '../Navigation/Params';
import useBTManager from './BTManager';
import useSocketManager from './SocketManager';
import useSocketEmitter from './SocketEmitter';

type doorsScreenProp = StackNavigationProp<MainStackParams, 'Doors'>;

const DoorsView: React.FC = () => {
  const {
    UUIDsList,
    startScan,
    disableBTModule,
    getDoorsInRange,
  } = useBTManager();
  const { doorsList, setDoorsList, disconnectSocket } = useSocketManager();
  const {
    refreshDoorsList,
    lockLongOpen,
    lockQuickOpen,
    lockClose,
  } = useSocketEmitter();
  const navigation = useNavigation<doorsScreenProp>();

  const refreshDoors = () => {
    refreshDoorsList();
    startScan();
  };

  const logOut = () => {
    disconnectSocket();
    disableBTModule();
    navigation.navigate('Login');
  };

  const updateLayout = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...doorsList];
    array.forEach((value, placeindex) => {
      value.isExpanded =
        placeindex === index
          ? (array[placeindex].isExpanded = !array[placeindex].isExpanded)
          : (array[placeindex].isExpanded = false);
    });
    setDoorsList(array);
  };

  useEffect(() => {
    refreshDoorsList();
    if (Platform.OS === 'android') {
      BleManager.enableBluetooth()
        .then()
        .catch(() => {
          logOut();
        });
    }
    return () => {
      disableBTModule();
    };
  }, []);

  useEffect(() => {
    const newDoorsList = getDoorsInRange(doorsList);
    setDoorsList(newDoorsList);
  }, [UUIDsList]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => {
            logOut();
          }}
        >
          <Icon name="log-out" style={styles.headerButton} />
        </Pressable>
        <Text style={styles.headerText}>Available doors</Text>
        <Pressable
          onPress={() => {
            refreshDoors();
          }}
        >
          <Icon name="refresh-ccw" style={styles.headerButton} />
        </Pressable>
      </View>
      <ScrollView>
        {doorsList?.map((door, key) => (
          <ExpandableItem
            key={door.lockID}
            onPressFunction={() => {
              updateLayout(key);
            }}
            longOpenFunction={() => {
              lockLongOpen(door.uuid);
            }}
            quickOpenFunction={() => {
              lockQuickOpen(door.uuid);
            }}
            closeFunction={() => {
              lockClose(door.uuid);
            }}
            doorsListRefresh={() => {
              refreshDoors();
            }}
            item={door}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoorsView;
