import React from 'react';
import {
  EntryContainer,
  TextContainer,
  PrimaryText,
  SecondaryText,
  RangeIcon,
  CheckIcon,
} from './ServerEntry.Components';
import { Colors } from './Stylesheets/Stylesheets';

interface EntryProps {
  ip: string;
  description: string;
  inRange?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
}

const ServerEntry: React.FC<EntryProps> = ({
  ip,
  description,
  inRange,
  isSelected,
  onPress,
}: EntryProps) => (
  <EntryContainer onTouchStart={onPress}>
    <CheckIcon name="check" color={isSelected ? 'lightblue' : 'transparent'} />
    <TextContainer>
      <PrimaryText>{description}</PrimaryText>
      <SecondaryText>
        IP:
        {ip}
      </SecondaryText>
    </TextContainer>
    <RangeIcon name="wifi" color={inRange ? Colors.Accent : '#8f8f8f'} />
  </EntryContainer>
);

export default ServerEntry;
