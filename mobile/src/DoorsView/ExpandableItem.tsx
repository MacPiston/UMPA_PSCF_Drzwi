import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Stylesheets/Stylesheets';
import Door from './DoorType';

interface ItemProps {
  item: Door;
  onPressFunction: () => void;
}

const ExpandableItem = ({ item, onPressFunction }: ItemProps): JSX.Element => {
  // Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(undefined);
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
        <Text style={styles.accordionHeaderText}>{item.doorName}</Text>
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
              ? alert('Otwarto ' + item.doorName)
              : alert(item.doorName + ' nie jest w zasięgu')
          }
        >
          <Text style={styles.accordionListElementText}>Otwórz drzwi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExpandableItem;
