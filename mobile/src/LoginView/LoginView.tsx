/* eslint-disable global-require */
import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  RefreshControl,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  View,
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
  const {
    SetConnected,
    DisconnectAll,
    AddServers,
    DeleteServer,
    LoadServers,
  } = ActionState;
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const emailInputRef = useRef() as React.MutableRefObject<TextInput>;
  const pwdInputRef = useRef() as React.MutableRefObject<TextInput>;

  const [fetchServers, saveServers] = useLocalStorage<server[]>('servers');
  const [selectedServer, setSelectedServer] = useState<server | null>(null);
  const [servers, srvDispatch] = useReducer(serversReducer, []);

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isRefreshing, setRefreshing] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<number>(loginStates.disabled);

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const fetchServersAsync = async () => {
      const temp = await fetchServers();
      if (temp)
        srvDispatch({
          type: LoadServers,
          servers: temp,
        });
    };
    fetchServersAsync();

    return () => {
      if (socket) socket.disconnect();
      srvDispatch({ type: DisconnectAll });
    };
  }, []);

  useEffect(() => {
    const saveServersAsync = async () => {
      await saveServers(servers);
    };
    if (servers) saveServersAsync();
  }, [servers]);

  const handleRefresh = async () => {
    if (socket) socket.disconnect();

    setRefreshing(true);
    setSelectedServer(null);

    emailInputRef.current.clear();
    pwdInputRef.current.clear();

    await setTimeout(() => setRefreshing(false), 1500);
  };

  const manualIPSelection = (ip: string) => {
    if (ip !== '') {
      const newServer: server[] = [
        {
          name: 'nowy '.concat(servers.length.toString()),
          ip,
          key: servers.length,
          status: connectionStates.none,
        },
      ];
      srvDispatch({
        type: AddServers,
        servers: newServer,
      });
    }
  };

  const handleConnection = (passedServer: server) => {
    const { ip } = passedServer;

    setLoginState(loginStates.disabled);
    if (socket) socket.disconnect();

    emailInputRef.current.clear();
    pwdInputRef.current.clear();

    if (ip && ip !== '') {
      const address = 'http://'.concat(ip).concat(':4000');
      const tempsocket = io(address, { transports: ['websocket'] });

      tempsocket.on('connect', () => {
        setSocket(tempsocket);
        setLoginState(loginStates.enabled);
        srvDispatch({ type: SetConnected, server: passedServer });
      });
      tempsocket.on('disconnect', () => {
        setLoginState(loginStates.disabled);
        srvDispatch({ type: DisconnectAll });
      });
      tempsocket.on('loginRequestRes', async (data) =>
        // eslint-disable-next-line no-use-before-define
        handleLoginResponse(data),
      );
    }
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

  const handleLoginResponse = async (response: boolean) => {
    console.log(response);
    setLoginState(
      response ? loginStates.loginSuccess : loginStates.loginFailed,
    );
    setTimeout(() => setLoginState(loginStates.enabled), 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={Background}
      contentContainerStyle={{ flex: 1 }}
      keyboardVerticalOffset={-100}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LoginViewContainer>
          <HeaderText>door_system</HeaderText>

          <ServerScrollView
            refreshControl={
              // eslint-disable-next-line react/jsx-wrap-multilines
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
            {servers.map((element) => {
              return (
                <ServerEntry
                  key={element.key}
                  description={element.name}
                  ip={element.ip}
                  isSelected={element === selectedServer}
                  onPress={() => {
                    setSelectedServer(element);
                    handleConnection(element);
                  }}
                  onLongPress={() =>
                    srvDispatch({
                      type: DeleteServer,
                      server: element,
                    })
                  }
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
          {isModalVisible && (
            <StyledBlurView blurType="regular" blurAmount={1} />
          )}
          <AccountModal
            visible={isModalVisible}
            handleClose={() => setModalVisible(false)}
          />
        </LoginViewContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginView;
