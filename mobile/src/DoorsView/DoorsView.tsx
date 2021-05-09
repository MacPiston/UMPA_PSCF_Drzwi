import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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
      <View>
        <Text style={styles.header}>Dostępne drzwi</Text>
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
  },
  {
    isExpanded: false,
    room_name: '102',
  },
  {
    isExpanded: false,
    room_name: '103',
  },
  {
    isExpanded: false,
    room_name: '201',
  },
  {
    isExpanded: false,
    room_name: '202',
  },
  {
    isExpanded: false,
    room_name: '203',
  },
  {
    isExpanded: false,
    room_name: '204',
  },
  {
    isExpanded: false,
    room_name: '301',
  },
  {
    isExpanded: false,
    room_name: '302',
  },
  {
    isExpanded: false,
    room_name: '303',
  },
  {
    isExpanded: false,
    room_name: 'Serwerownia',
  },
  {
    isExpanded: false,
    room_name: 'Gabinet Prezesa',
  },
  {
    isExpanded: false,
    room_name: 'Pomieszczenie gospodarcze 111',
  },
  {
    isExpanded: false,
    room_name: 'Pomieszczenie gospodarcze 311',
  },
];
