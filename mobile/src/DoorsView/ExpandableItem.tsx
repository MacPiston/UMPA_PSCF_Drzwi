import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Stylesheets/Stylesheets';

const ExpandableItem = ({ item, onPressFunction }) => {
  // Custom Component for the Expandable List
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
      {/* Header of the Expandable List Item */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressFunction}
        style={[
          styles.accordionHeaderItem,
          item.inBtRange ? styles.inRangeColor : styles.outOfRangeColor,
        ]}
      >
        <Text style={styles.accordionHeaderText}>{item.room_name}</Text>
      </TouchableOpacity>
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
        }}
      >
        {/* Content under the header of the Expandable List Item */}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.accordionListElement}
          onPress={() =>
            item.inBtRange
              ? alert('Otwarto ' + item.room_name)
              : alert(item.room_name + ' nie są w zasięgu')
          }
        >
          <Text style={styles.accordionListElementText}>Otwórz drzwi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExpandableItem;
