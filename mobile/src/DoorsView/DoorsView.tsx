import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { io } from 'socket.io-client';
import Icon from 'react-native-vector-icons/Feather';
import { styles } from './Stylesheets/Stylesheets';
import ExpandableItem from './ExpandableItem';

interface Door {
  doorName: string;
  lockID: string;
  inBtRange: boolean;
  isExpanded: boolean;
}

const DoorsView = () => {
  const [doorList, setDoorList] = useState<Door[]>();

  // TODO Do usunięcia pozostałości z testowania
  const socket = io('http://10.0.2.2:4000');

  const logindata = {
    email: 'test@gmail.com',
  };
  //----------------------------------------------------

  const refreshDoorList = () => {
    socket.emit('doorsList', logindata);
  };
  useEffect(() => {
    refreshDoorList();
  }, []);

  const logOut = () => {
    socket.disconnect();
    //TODO powrót do widoku logowania
  };

  socket.on('doors', (elem) => {
    const array = elem.doorsList.map(
      (item) =>
        ({
          doorName: item.doorName,
          lockID: item.lockID,
          inBtRange: false,
          isExpanded: false,
        } as Door),
    );
    setDoorList(array);
  });

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...doorList];
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );
    setDoorList(array);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => {
            alert('Zostałeś wylogowany');
            logOut();
            console.log('User is logged out');
          }}
        >
          <Icon name="log-out" style={styles.headerButton} />
        </Pressable>
        <Text style={styles.headerText}>Dostępne drzwi</Text>
        <Pressable
          onPress={() => {
            console.log('Available doors list has been refreshed');
            refreshDoorList();
          }}
        >
          <Icon name="refresh-ccw" style={styles.headerButton} />
        </Pressable>
      </View>
      <ScrollView>
        {doorList?.map((door, key) => (
          <ExpandableItem
            key={door.doorName}
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
