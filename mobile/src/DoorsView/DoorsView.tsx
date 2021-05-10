import React, { useState } from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
// import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/Feather';
import { styles } from './Stylesheets/Stylesheets';
import ExpandableItem from './ExpandableItem';

const DoorsView = () => {
  const [listDataSource, setListDataSource] = useState(DATA);

  const updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...listDataSource];
    // If single select is enabled
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );
    setListDataSource(array);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => {
            alert('Zostałeś wylogowany');
            console.log('You have been logged out');
          }}
        >
          <Icon name="log-out" style={styles.headerButton}></Icon>
        </Pressable>
        <Text style={styles.header}>Dostępne drzwi</Text>
        <Pressable
          onPress={() => console.log('Available doors list has been refreshed')}
        >
          <Icon name="refresh-ccw" style={styles.headerButton}></Icon>
        </Pressable>
      </View>
      <ScrollView
        style={{
          flex: 1,
          flexGrow: 1,
        }}
      >
        {listDataSource.map((item, key) => (
          <ExpandableItem
            key={item.room_name}
            onPressFunction={() => {
              updateLayout(key);
            }}
            item={item}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoorsView;

const DATA = [
  {
    isExpanded: false,
    room_name: '101',
    inBtRange: true,
  },
  {
    isExpanded: false,
    room_name: '102',
    inBtRange: false,
  },
  {
    isExpanded: false,
    room_name: '103',
    inBtRange: false,
  },
  {
    isExpanded: false,
    room_name: '201',
    inBtRange: false,
  },
  {
    isExpanded: false,
    room_name: '202',
    inBtRange: false,
  },
  {
    isExpanded: false,
    room_name: '203',
    inBtRange: true,
  },
  {
    isExpanded: false,
    room_name: '204',
    inBtRange: false,
  },
  {
    isExpanded: false,
    room_name: '301',
    inBtRange: false,
  },
  {
    isExpanded: false,
    room_name: '302',
    inBtRange: false,
  },
  {
    isExpanded: false,
    room_name: '303',
    inBtRange: false,
  },
  {
    isExpanded: false,
    room_name: 'Serwerownia',
    inBtRange: true,
  },
  {
    isExpanded: false,
    room_name: 'Gabinet Prezesa',
    inBtRange: true,
  },
  {
    isExpanded: false,
    room_name: 'Pomieszczenie gospodarcze 111',
    inBtRange: false,
  },
  {
    isExpanded: false,
    room_name: 'Pomieszczenie gospodarcze 311',
    inBtRange: false,
  },
];
