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

interface ButtonProps {
  primary?: boolean;
  text: string;
  onPress: () => void;
}
const CustomizedButton = ({ primary = false, text, onPress }: ButtonProps) => {
  return (
    <Pressable
      style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}
      onPress={onPress}
    >
      <Text style={primary ? { fontSize: 34 } : { fontSize: 20 }}>{text}</Text>
    </Pressable>
  );
};

interface ModalProps {
  visible: boolean;
  handleClose: () => void;
}
const InfoModal = ({ visible, handleClose }: ModalProps) => (
  <Modal
    animationType="fade"
    visible={visible}
    onRequestClose={handleClose}
    transparent
  >
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 30,
        marginVertical: 320,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}
      onTouchStart={handleClose}
    >
      <Text>Nie dostaniesz konta i chuj</Text>
    </View>
  </Modal>
);

const LoginView: React.FC = () => {
  const { Background } = DivStyles;
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleLogin = () => {
    console.log('Login');
  };

  return (
    <View style={Background}>
      <SafeAreaView>
        <InfoModal
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
