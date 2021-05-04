/* eslint-disable import/prefer-default-export */
import { Text, View, TextInput, Image } from 'react-native';
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
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 8px;
  width: 90%;
  height: 40%;
  font-size: 22px;
`;

export const StyledImage = styled(Image)`
  flex: 6;
  aspect-ratio: 1;
`;

export const ButtonsContainer = styled(View)`
  flex: 2;
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  /* border: 1px solid black; */
`;
