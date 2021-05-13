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
import { LoginButton, loginStates } from './LoginView.LoginButton';
import useLocalStorage from './useLocalStorage';

interface server {
  name: string;
  ip: string;
  key: number;
  status: number;
}

const LoginView: React.FC = () => {
  const { Background } = Styles;
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const emailInputRef = useRef() as React.MutableRefObject<TextInput>;
  const pwdInputRef = useRef() as React.MutableRefObject<TextInput>;

  const [fetchServers, saveServers] = useLocalStorage<server[]>('servers');
  const [servers, setServers] = useState<server[]>([]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<number>(loginStates.disabled);

  const [socket, setSocket] = useState<Socket>();
  const [selectedServerIP, setSelectedServerIP] = useState<string>('');
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    if (socket) socket.disconnect();
    setLoginState(loginStates.disabled);
    setSelectedServerIP('');

    emailInputRef.current.clear();
    pwdInputRef.current.clear();

    await setTimeout(() => setRefreshing(false), 1500);
  };

  const handleLoginResponse = (response: boolean) => {
    console.log(response);
    setLoginState(
      response ? loginStates.loginSuccess : loginStates.loginFailed,
    );
  };

  const handleConnection = (ip: string = selectedServerIP) => {
    if (socket) socket.disconnect();
    setLoginState(loginStates.disabled);
    emailInputRef.current.clear();
    pwdInputRef.current.clear();

    if (ip && ip !== '') {
      const address = 'http://'.concat(ip).concat(':4000');
      const tempsocket = io(address, { transports: ['websocket'] });

      tempsocket.on('connect', () => {
        setSocketConnected(true);
        setLoginState(loginStates.enabled);
      });
      tempsocket.on('loginRequestRes', (data) => handleLoginResponse(data));

      setSocket(tempsocket);
    }
  };

  const manualIPConnection = async (ip: string) => {
    const newServer: server = {
      name: 'nowy',
      ip,
      key: servers.length,
      status: connectionStates.inRange,
    };
    const newServers = [...servers, newServer];
    setServers(newServers);
    setSelectedServerIP(ip);
    await saveServers(newServers);
    handleConnection(ip);
  };

  const handleServerSelection = (ip: string) => {
    setSelectedServerIP(ip);
    handleConnection(ip);
  };

  const handleServerDeletion = (key: number) => {
    const newServers = servers.splice(key, 1);
    setServers(newServers);
    saveServers(newServers);
  };

  const handleLogin = async () => {
    if (socketConnected) {
      console.log('logging in');
      console.log(email);
      console.log(pwd);
      setLoginState(loginStates.loading);
      setTimeout(
        () => socket?.emit('loginRequest', { email, password: pwd }),
        600,
      );
    }
  };

  useEffect(() => {
    const fetchServersAsync = async () => {
      const temp = await fetchServers();
      if (temp) setServers(temp);
    };
    fetchServersAsync();
  }, []);

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  });

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
            {servers
              .sort((a, b) => {
                return b.key - a.key;
              })
              .map((element) => {
                return (
                  <ServerEntry
                    key={element.key}
                    description={element.name}
                    ip={element.ip}
                    isSelected={element.ip === selectedServerIP}
                    onPress={() => handleServerSelection(element.ip)}
                    onLongPress={() => handleServerDeletion(element.key)}
                    connectionStatus={element.status}
                  />
                );
              })}
            <ManualIP connectionHandler={manualIPConnection} />
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
