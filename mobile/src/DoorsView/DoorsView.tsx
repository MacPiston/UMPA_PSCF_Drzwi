/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  View,
  Text,
  ScrollView,
  Pressable,
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
  // const [doorsList, setDoorsList] = useState<Door[]>([]);
  const { doorsInRangeList, disableBTModule, initBTModule } = useBTManager();
  const { doorsList, setDoorsList, disconnectSocket } = useSocketManager();
  const { refreshdoorsList, lockLongOpen, lockQuickOpen } = useSocketEmitter();
  const navigation = useNavigation<doorsScreenProp>();
  // const { socket } = useContext(SocketContext);

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
    refreshdoorsList();
    BleManager.enableBluetooth()
      .then()
      .catch(() => {
        logOut();
      });
    return () => {
      disableBTModule();
    };
  }, []);

  useEffect(() => {
    // const newDoorsList = getDoorsInRange(doorsList); //wywala undefined
    // console.log('new doorslist'.concat(newDoorsList.toString()));
    // setDoorsList(newDoorsList);
  }, [doorsList]);

  // useEffect(() => {
  //   console.log('new doorslist'.concat(doorsList));
  // }, [doorsList]);

  // useEffect(() => {
  //   socket.on('doors', (data: DataType) => {
  //     const array = data.doorsList.map((item) => ({
  //       lockID: item.lockID,
  //       doorName: item.doorName,
  //       uuid: item.uuid,
  //       isOpen: item.isOpen,
  //       inBtRange: false,
  //       isExpanded: false,
  //     }));
  //     setDoorsList(array);
  //   });

  //   console.log('Scanning bluetooth devices');
  //   startScan();

  //   const newDoorsList = getDoorsInRange(doorsList);

  //   setDoorsList(newDoorsList);

  //   return () => {
  //     disableBTModule();
  //   };
  // }, [doorsList]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => {
            logOut();
            console.log('User is logged out');
          }}
        >
          <Icon name="log-out" style={styles.headerButton} />
        </Pressable>
        <Text style={styles.headerText}>Available doors</Text>
        <Pressable
          onPress={() => {
            refreshdoorsList();
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
            item={door}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoorsView;
