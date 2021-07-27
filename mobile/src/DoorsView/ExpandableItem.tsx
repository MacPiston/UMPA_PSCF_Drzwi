import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Stylesheets/Stylesheets';
import { Door } from './DoorType';

interface ItemProps {
  item: Door;
  onPressFunction: () => void;
  longOpenFunction: () => void;
  quickOpenFunction: () => void;
}

const ExpandableItem = ({
  item,
  onPressFunction,
  longOpenFunction,
  quickOpenFunction,
}: ItemProps): JSX.Element => {
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
        key={item.inBtRange.valueOf.toString()}
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
              ? longOpenFunction()
              : alert(item.doorName.concat(' is not in BT range'))
          }
        >
          <Text style={styles.accordionListElementText}>Open door</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.accordionListElement}
          onPress={() =>
            item.inBtRange
              ? quickOpenFunction()
              : alert(item.doorName.concat(' is not in BT range'))
          }
        >
          <Text style={styles.accordionListElementText}>Open for 10s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExpandableItem;
