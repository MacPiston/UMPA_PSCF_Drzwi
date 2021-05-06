/* eslint-disable import/prefer-default-export */
import { Text, View, TextInput, Image, ScrollView } from 'react-native';
import styled from 'styled-components';

export const LoginViewContainer = styled(View)`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

export const HeaderText = styled(Text)`
  flex: 1.5;
  margin-top: 20px;
  font-weight: 600;
  font-size: 50px;
  /* border: 1px solid black; */
`;

export const SecondaryText = styled(Text)`
  font-size: 24px;
  font-weight: 500;
`;

export const ServerScrollView = styled(ScrollView)`
  flex: 6;
  width: 90%;
  border: 1px solid black;
  border-radius: 5px;
`;

export const InputContainer = styled(View)`
  margin-top: 20px;
  margin-bottom: 10px;
  flex: 2.2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  /* border: 1px solid black; */
  height: 55%;
  width: 100%;
`;

export const StyledTextInput = styled(TextInput)`
  border-radius: 5px;
  padding: 8px;
  width: 90%;
  height: 40%;
  font-size: 22px;
  background-color: ${(props) => (props.editable ? 'white' : 'lightgrey')};
  border: 1px solid lightgray;
`;

export const ButtonsContainer = styled(View)`
  flex: 2;
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  /* border: 1px solid black; */
`;
