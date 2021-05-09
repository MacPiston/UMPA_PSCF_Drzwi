/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Colors } from './Stylesheets/Stylesheets';

export const ViewContainerVertical = styled(View)`
  display: flex;
  width: 100%;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 10px;
  align-items: center;
`;

export const InputContainerHorizontal = styled(View)`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  /* border: 1px solid white; */
`;

export const ConnectIcon = styled(Icon).attrs({
  name: 'sync',
})`
  flex: 1;
  text-align: center;
  color: ${Colors.Accent};
  font-size: 30px;
`;
