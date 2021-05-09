/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  SafeAreaView,
  RefreshControl,
  KeyboardAvoidingView,
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

const LoginView: React.FC = () => {
  const { Background } = Styles;
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loginEnabled, setLoginEnabled] = useState<boolean>(false);

  const [socket, setSocket] = useState<Socket>();
  const [selectedServerIP, setSelectedServerIP] = useState<string>('');

  const virtualServers = [
    {
      ip: '192.168.50.1',
      name: 'testowy 1',
      key: 1,
      status: connectionStates.none,
    },
    {
      ip: '255.255.255.0',
      name: 'testowy 2',
      key: 2,
      status: connectionStates.inRange,
    },
    {
      ip: '127.0.0.1',
      name: 'testowy 3',
      key: 3,
      status: connectionStates.connected,
    },
    {
      ip: '123.123.123.123',
      name: 'testowy 4',
      key: 4,
      status: connectionStates.connecting,
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await setTimeout(() => setRefreshing(false), 1500);
  };

  const handleServerSelection = async (ip: string) => {
    setSelectedServerIP(ip);
    setLoginEnabled(true);
    // handleConnection(ip);
  };

  const handleConnection = async (ip: string = selectedServerIP) => {
    const address = 'https://'.concat(ip);
    // const tempsocket = io(address);
    // setSocket(tempsocket);
  };

  const handleLogin = async () => {
    console.log('logging in');
    socket?.emit('loginRequest', email, pwd);
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
            {virtualServers.map((element) => {
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
              autoCompleteType="email"
              keyboardType="email-address"
              placeholder="Email address..."
              onChangeText={setEmail}
              editable={loginEnabled && !refreshing}
            />
            <StyledTextInput
              autoCompleteType="password"
              keyboardType="default"
              secureTextEntry
              placeholder="Password..."
              onChangeText={setPwd}
              editable={loginEnabled && !refreshing}
            />
          </InputContainer>

          <ButtonsContainer>
            <CustomizedButton
              disabled={refreshing || !loginEnabled}
              loading={refreshing}
              isPrimary
              text="Login"
              onPress={() => handleLogin()}
            />
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
