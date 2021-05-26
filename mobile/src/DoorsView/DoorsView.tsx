import React, { useEffect, useState } from 'react';
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
import { RouteProp, useRoute } from '@react-navigation/core';
import { styles } from './Stylesheets/Stylesheets';
import ExpandableItem from './ExpandableItem';
import { DoorsScreenRouteProp, MainStackParams } from '../Navigation/Params';

interface Door {
  doorName: string;
  lockID: string;
  inBtRange: boolean;
  isExpanded: boolean;
}

type doorsScreenProp = StackNavigationProp<MainStackParams, 'Doors'>;

const DoorsView: React.FC = () => {
  const [doorList, setDoorList] = useState<Door[]>();
  // const navigation = useNavigation<doorsScreenProp>();
  const { socket, email } = useRoute<DoorsScreenRouteProp>();

  const refreshDoorList = () => {
    socket.emit('doorsList', { email });
  };
  useEffect(() => {
    refreshDoorList();
  }, []);

  const logOut = () => {
    socket.disconnect();
    // TODO powrót do widoku logowania
  };

  socket.on('doors', (data) => {
    const array = data.doorsList.map(
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
        ? (array[placeindex].isExpanded = !array[placeindex].isExpanded)
        : (array[placeindex].isExpanded = false),
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
