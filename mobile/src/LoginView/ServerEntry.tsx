import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/AntDesign';

const EntryContainer = styled(View)`
  margin-top: -0.5px;
  padding-left: 20px;

  height: 80px;
  width: 100%;
  display: flex;
  flex-direction: row;

  border-style: solid;
  border-top-color: black;
  border-top-width: 0.5px;
  border-bottom-color: black;
  border-bottom-width: 0.5px;
`;

const TextContainer = styled(View)`
  flex: 5;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
`;

const PrimaryText = styled(Text)`
  flex: 2;
  font-size: 28px;
  font-weight: 600;
  border: 1px solid black;
  padding-top: 6px;
`;

const SecondaryText = styled(Text)`
  flex: 1;
  font-size: 21px;
  border: 1px solid black;
`;

const StyledIcon = styled(Icon)`
  flex: 1;
  height: 100%;
  font-size: 42px;
  border: 1px solid black;
  align-self: center;
`;

interface EntryProps {
  ip: string;
  description: string;
  inRange?: boolean;
}

const ServerEntry: React.FC<EntryProps> = ({
  ip,
  description,
  inRange,
}: EntryProps) => (
  <EntryContainer>
    <TextContainer>
      <PrimaryText>{description}</PrimaryText>
      <SecondaryText>
        IP:
        {ip}
      </SecondaryText>
    </TextContainer>
    <StyledIcon name="wifi" color={inRange ? 'lightgreen' : 'lightgray'} />
  </EntryContainer>
);

export default ServerEntry;
