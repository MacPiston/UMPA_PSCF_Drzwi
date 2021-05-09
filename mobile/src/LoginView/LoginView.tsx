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
import ServerEntry from './ServerEntry';
import ManualIP from './ManualIP';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

const LoginView: React.FC = () => {
  const { Background } = Styles;
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [uiActive, setUIactive] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket>();
  const [selectedServerIP, setSelectedServerIP] = useState<string>('');

  const virtualServers = [
    { ip: '192.168.50.1', name: 'testowy 1', key: 1 },
    { ip: '255.255.255.0', name: 'testowy 2', key: 2 },
    { ip: '127.0.0.1', name: 'testowy 3', key: 3 },
    { ip: '123.123.123.123', name: 'testowy 4', key: 4 },
  ];

  const handleLogin = async () => {
    setUIactive(false);
    await setTimeout(() => setUIactive(true), 1500);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await setTimeout(() => setRefreshing(false), 1500);
  };

  const handleConnection = async (ip: string = selectedServerIP) => {
    const address = 'https://'.concat(ip);
    const tempsocket = io(address);
    setSocket(tempsocket);
  };

  const handleServerSelection = (ip: string) => {
    setSelectedServerIP(ip);
    // handleConnection(ip);
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
              editable={uiActive && !refreshing}
            />
            <StyledTextInput
              autoCompleteType="password"
              keyboardType="default"
              secureTextEntry
              placeholder="Password..."
              onChangeText={setPwd}
              editable={uiActive && !refreshing}
            />
          </InputContainer>

          <ButtonsContainer>
            <CustomizedButton
              isLoading={refreshing || !uiActive}
              isPrimary
              text="Login"
              onPress={handleLogin}
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
