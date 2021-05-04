import React, { useState } from 'react';
import { SafeAreaView, Text, View, Pressable, Modal } from 'react-native';
import { DivStyles } from './Stylesheets/Stylesheets';
import {
  HeaderText,
  InputContainer,
  LoginViewContainer,
  StyledTextInput,
  StyledImage,
  ButtonsContainer,
} from './LoginView.Components';
import AccountModal from './AccountModal';
import CustomizedButton from './CustomizedButton';

const LoginView: React.FC = () => {
  const { Background } = DivStyles;
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleLogin = () => {
    console.log(email);
  };

  return (
    <View style={Background}>
      <SafeAreaView>
        <AccountModal
          visible={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
        <LoginViewContainer>
          <HeaderText>Door_system</HeaderText>
          <StyledImage resizeMode="stretch" source={require('./doors.png')} />
          <InputContainer>
            <StyledTextInput
              autoCompleteType="email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email address..."
              onChange={setEmail}
            />
            <StyledTextInput
              autoCompleteType="password"
              autoCapitalize="none"
              keyboardType="default"
              secureTextEntry
              placeholder="Password..."
              onChange={setPwd}
            />
          </InputContainer>
          <ButtonsContainer>
            <CustomizedButton
              text="Need account?"
              onPress={() => setModalVisible(true)}
            />
            <CustomizedButton primary text="Login" onPress={handleLogin} />
          </ButtonsContainer>
        </LoginViewContainer>
      </SafeAreaView>
    </View>
  );
};

export default LoginView;
