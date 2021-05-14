/* eslint-disable global-require */
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { RefreshControl, KeyboardAvoidingView, TextInput } from 'react-native';
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
import ServerEntry from './ServerEntry/ServerEntry';
import ManualIP from './ManualIP/ManualIP';
import { LoginButton, loginStates } from './LoginView.LoginButton';
import useLocalStorage from './useLocalStorage';
import {
  server,
  serversReducer,
  connectionStates,
  ActionState,
} from './ServersReducer';

const LoginView: React.FC = () => {
  const { Background } = Styles;
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const emailInputRef = useRef() as React.MutableRefObject<TextInput>;
  const pwdInputRef = useRef() as React.MutableRefObject<TextInput>;

  const [fetchServers, saveServers] = useLocalStorage<server[]>('servers');
  const [selectedServerKey, setSelectedServerKey] = useState<number>(-1);
  const [servers, srvDispatch] = useReducer(serversReducer, []);

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isRefreshing, setRefreshing] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<number>(loginStates.disabled);

  const [socket, setSocket] = useState<Socket>();

  const handleRefresh = async () => {
    setRefreshing(true);

    if (socket) socket.disconnect();
    setSelectedServerKey(-1);

    emailInputRef.current.clear();
    pwdInputRef.current.clear();

    await setTimeout(() => setRefreshing(false), 1500);
  };

  const handleLoginResponse = async (response: boolean) => {
    console.log(response);
    setLoginState(
      response ? loginStates.loginSuccess : loginStates.loginFailed,
    );
    setTimeout(() => setLoginState(loginStates.enabled), 1500);
  };

  const handleConnection = (key: number) => {
    if (socket) socket.disconnect();
    setLoginState(loginStates.disabled);
    emailInputRef.current.clear();
    pwdInputRef.current.clear();

    const ip = servers.find((e) => e.key === key)?.ip;

    if (ip && ip !== '') {
      const address = 'http://'.concat(ip).concat(':4000');
      const tempsocket = io(address, { transports: ['websocket'] });

      tempsocket.on('connect', () => {
        setSocket(tempsocket);
        setLoginState(loginStates.enabled);
      });
      tempsocket.on('disconnect', () => setLoginState(loginStates.disabled));
      tempsocket.on('loginRequestRes', async (data) =>
        handleLoginResponse(data),
      );
    }
  };

  const manualIPSelection = async (ip: string) => {
    const newServer: server = {
      name: 'nowy',
      ip,
      key: servers.length,
      status: connectionStates.none,
    };
    const newServers = [...servers, newServer];
    srvDispatch({
      type: ActionState.LoadServers,
      servers: newServers,
      key: -1,
    });
    await saveServers(newServers);
  };

  const handleServerSelection = (key: number) => {
    setSelectedServerKey(key);
  };

  const handleServerDeletion = (key: number) => {
    const newServers = servers.splice(key, 1);
    srvDispatch({
      type: ActionState.LoadServers,
      servers: newServers,
      key: -1,
    });
    saveServers(newServers);
  };

  const handleLogin = async () => {
    if (socket?.connected) {
      console.log('logging in');
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
      if (temp)
        srvDispatch({
          type: ActionState.LoadServers,
          servers: temp,
          key: -1,
        });
    };
    fetchServersAsync();
  }, []);

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={Background}
      contentContainerStyle={{ flex: 1 }}
    >
      <LoginViewContainer>
        <HeaderText>door_system</HeaderText>

        <ServerScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
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
                  isSelected={element.key === selectedServerKey}
                  onPress={() => {
                    handleServerSelection(element.key);
                    handleConnection(element.key);
                  }}
                  onLongPress={() => handleServerDeletion(element.key)}
                  connectionStatus={element.status}
                />
              );
            })}
          <ManualIP connectionHandler={manualIPSelection} />
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

      {isModalVisible && <StyledBlurView blurType="regular" blurAmount={1} />}
      <AccountModal
        visible={isModalVisible}
        handleClose={() => setModalVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginView;
