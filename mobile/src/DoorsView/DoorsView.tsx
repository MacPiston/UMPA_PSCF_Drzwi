import React from 'react';
import { Text, View, SafeAreaView, SectionList, Alert } from 'react-native';
import { Colors } from '../AppGlobalStyles/GlobalStylesheets';
import { Styles } from './Stylesheets/Stylesheets';

const DATA = [
  {
    data: [
      '101',
      '102',
      '103',
      'Serwerownia',
      'Biuro prezesa złodzieja',
      'Chuj',
      'Chuj drugi',
      'Chuj trzeci',
      'Chuj 3,5',
      'Chuj i chuj',
      'Chuj^2',
    ],
  },
];

const Item = ({ title }) => (
  <View style={Styles.item}>
    <Text style={Styles.tile} onPress={() => Alert.alert(`${title} pressed`)}>
      {title}
    </Text>
  </View>
);

const DoorsView = () => {
  return (
    <SafeAreaView style={Styles.container}>
      <View style={{ backgroundColor: Colors.BlueAccent, flex: 0.1 }}>
        <Text style={Styles.header}>Dostępne drzwi</Text>
      </View>
      <SectionList
        style={{ flex: 1 }}
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} />}
      />
    </SafeAreaView>
  );
};

export default DoorsView;
