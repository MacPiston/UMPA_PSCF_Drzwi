import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity
          style={styles.content}
          onPress={() => alert('Otwarto ' + item.room_name)}
        >
          <Text style={styles.openButton}>Otwórz drzwi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExpandableItem;
