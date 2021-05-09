import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  EntryContainer,
  TextContainer,
  PrimaryText,
  SecondaryText,
  RangeIcon,
  CheckIcon,
} from './ServerEntry.Components';
import { Colors } from '../Stylesheets/Stylesheets';

export const connectionStates = {
  none: 0,
  inRange: 1,
  connecting: 2,
  connected: 3,
};
interface EntryProps {
  ip: string;
  description: string;
  connectionStatus?: number;
  isSelected?: boolean;
  onPress?: () => void;
}

export const ServerEntry: React.FC<EntryProps> = ({
  ip,
  description,
  isSelected,
  onPress,
  connectionStatus = connectionStates.none,
}: EntryProps) => {
  const switchIcon = () => {
    switch (connectionStatus) {
      case connectionStates.none:
        return <RangeIcon name="close" color={Colors.Gray} />;
      case connectionStates.inRange:
        return <RangeIcon name="wifi" color={Colors.Accent} />;
      case connectionStates.connecting:
        return <ActivityIndicator size="large" color={Colors.Accent} />;
      case connectionStates.connected:
        return <RangeIcon name="check" color={Colors.Green} />;
      default:
    }
  };

  return (
    <EntryContainer onTouchStart={onPress}>
      <CheckIcon
        name="check"
        color={isSelected ? 'lightblue' : 'transparent'}
      />
      <TextContainer>
        <PrimaryText>{description}</PrimaryText>
        <SecondaryText>
          IP:
          {ip}
        </SecondaryText>
      </TextContainer>
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        {switchIcon()}
      </View>
    </EntryContainer>
  );
};
