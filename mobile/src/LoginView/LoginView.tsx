/* eslint-disable global-require */
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  RefreshControl,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import { Styles } from './Stylesheets/Stylesheets';
import {
  HeaderText,
  InputContainer,
  LoginViewContainer,
  StyledTextInput,
  ButtonsContainer,
  ServerScrollView,
  SecondaryText,
  StyledBlurView,
} from './LoginView.Components';
import AccountModal from './AccountModal';
import CustomizedButton from './CustomizedButton';
import { ServerEntry, connectionStates } from './ServerEntry/ServerEntry';
import ManualIP from './ManualIP/ManualIP';
import { LoginButton, LoginStates } from './LoginView.LoginButton';

const virtualServers = [
  {
    ip: 'localhost',
    name: 'testy',
    key: 1,
    status: connectionStates.inRange,
  },
];

const LoginView: React.FC = () => {
  const { Background } = Styles;
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<number>(LoginStates.disabled);

  const [socket, setSocket] = useState<Socket>();
  const [selectedServerIP, setSelectedServerIP] = useState<string>('');
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  const emailInputRef = useRef() as React.MutableRefObject<TextInput>;
  const pwdInputRef = useRef() as React.MutableRefObject<TextInput>;

  const handleRefresh = async () => {
    if (socket) socket.disconnect();

    setRefreshing(true);
    setLoginState(LoginStates.disabled);
    setSelectedServerIP(null);

    emailInputRef.current.clear();
    pwdInputRef.current.clear();

    await setTimeout(() => setRefreshing(false), 1500);
  };

  const handleLoginResponse = (response: boolean) => {
    console.log(response);
    setLoginState(
      response ? LoginStates.loginSuccess : LoginStates.loginFailed,
    );
  };

  const handleConnection = async (ip: string = selectedServerIP) => {
    if (ip) {
      const address = 'http://'.concat(ip).concat(':4000');
      if (socket) socket.disconnect();
      const tempsocket = io(address, { transports: ['websocket'] });
      tempsocket.on('connect', () => {
        setSocketConnected(true);
        setLoginState(LoginStates.enabled);
      });
      tempsocket.on('loginRequestRes', (data) => handleLoginResponse(data));
      setSocket(tempsocket);
    }
  };

  const handleServerSelection = async (ip: string) => {
    emailInputRef.current.clear();
    pwdInputRef.current.clear();
    setSelectedServerIP(ip);
    handleConnection(ip);
  };

  const handleLogin = async () => {
    if (socketConnected) {
      console.log('logging in');
      console.log(email);
      console.log(pwd);
      setLoginState(LoginStates.loading);
      setTimeout(
        () => socket?.emit('loginRequest', { email, password: pwd }),
        600,
      );
    }
  };

  return (
    <KeyboardAvoidingView behavior="position" style={Background}>
      <SafeAreaView>
        <LoginViewContainer>
          <HeaderText>door_system</HeaderText>

          <ServerScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => handleRefresh()}
              />
            }
            contentContainerStyle={{ alignItems: 'center' }}
          >
            <SecondaryText
              style={{
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              Select a server to log into:
            </SecondaryText>
            {virtualServers
              .sort((a, b) => {
                return b.status - a.status;
              })
              .map((element) => {
                return (
                  <ServerEntry
                    key={element.key}
                    description={element.name}
                    ip={element.ip}
                    isSelected={element.ip === selectedServerIP}
                    onPress={() => handleServerSelection(element.ip)}
                    connectionStatus={element.status}
                  />
                );
              })}
            <ManualIP connectionHandler={handleConnection} />
          </ServerScrollView>

          <InputContainer>
            <StyledTextInput
              ref={emailInputRef}
              autoCompleteType="email"
              keyboardType="email-address"
              placeholder="Email address..."
              onChangeText={setEmail}
              editable={loginState === 0}
            />
            <StyledTextInput
              ref={pwdInputRef}
              autoCompleteType="password"
              keyboardType="default"
              secureTextEntry
              placeholder="Password..."
              onChangeText={setPwd}
              editable={loginState === 0}
            />
          </InputContainer>

          <ButtonsContainer>
            <LoginButton onPress={handleLogin} state={loginState} />
            <CustomizedButton
              text="Need account?"
              onPress={() => setModalVisible(true)}
            />
          </ButtonsContainer>
        </LoginViewContainer>

        {modalVisible && <StyledBlurView blurType="regular" blurAmount={1} />}
        <AccountModal
          visible={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginView;
