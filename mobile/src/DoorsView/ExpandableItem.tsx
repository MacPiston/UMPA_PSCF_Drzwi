import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './Stylesheets/Stylesheets';
import { Door } from './DoorType';

interface ItemProps {
  item: Door;
  onPressFunction: () => void;
  longOpenFunction: () => void;
  quickOpenFunction: () => void;
  closeFunction: () => void;
  doorsListRefresh: () => void;
}

const ExpandableItem = ({
  item,
  onPressFunction,
  longOpenFunction,
  quickOpenFunction,
  closeFunction,
  doorsListRefresh,
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

  const afterClickRefresh = () => {
    setTimeout(() => doorsListRefresh(), 1337);
  };

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
      {item.isOpen ? (
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.accordionListElement}
            onPress={() =>
              item.inBtRange
                ? [closeFunction(), afterClickRefresh()]
                : alert(item.doorName.concat(' is not in BT range'))
            }
          >
            <Text style={styles.accordionListElementText}>Close door</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            height: layoutHeight,
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.accordionListElement}
            onPress={() =>
              item.inBtRange
                ? [longOpenFunction(), afterClickRefresh()]
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
                ? [quickOpenFunction(), afterClickRefresh()]
                : alert(item.doorName.concat(' is not in BT range'))
            }
          >
            <Text style={styles.accordionListElementText}>Open for 10s</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ExpandableItem;
