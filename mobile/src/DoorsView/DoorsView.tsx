import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  LayoutAnimation,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../AppGlobalStyles/GlobalStylesheets';
import { styles } from './Stylesheets/Stylesheets';

const ExpandableItem = ({ item, onPressFunction }) => {
  //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState(0);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);

  return (
    <View>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPressFunction}
        style={styles.item}
      >
        <Text style={styles.tileText}>{item.room_name}</Text>
      </TouchableOpacity>
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
        }}
      >
        {/*Content under the header of the Expandable List Item*/}
        {item.subcategory.map((item, key) => (
          <TouchableOpacity
            key={key}
            style={styles.content}
            onPress={() => alert('Otwarto drzwi ' + item)}
          >
            <Text style={styles.openButton}>Otwórz drzwi</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const DATA = [
  {
    isExpanded: false,
    room_name: '101',
    subcategory: [{ id: 1, val: 'Sub Cat 1' }],
  },
  {
    isExpanded: false,
    room_name: '102',
    subcategory: [{ id: 1, val: 'Sub Cat 1' }],
  },
  {
    isExpanded: false,
    room_name: '103',
    subcategory: [{ id: 1, val: 'Sub Cat 1' }],
  },
  {
    isExpanded: false,
    room_name: '201',
    subcategory: [{ id: 1, val: 'Sub Cat 1' }],
  },
];

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
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: Colors.BlueAccent, flex: 0.1 }}>
          <Text style={styles.header}>Dostępne drzwi</Text>
        </View>
        <ScrollView>
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
      </View>
    </SafeAreaView>
  );
};

export default DoorsView;
