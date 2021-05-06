/* eslint-disable global-require */
import React, { useState } from 'react';
import {
  SafeAreaView,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { DivStyles } from './Stylesheets/Stylesheets';
import {
  HeaderText,
  InputContainer,
  LoginViewContainer,
  StyledTextInput,
  ButtonsContainer,
  ServerScrollView,
  SecondaryText,
} from './LoginView.Components';
import AccountModal from './AccountModal';
import CustomizedButton from './CustomizedButton';
import ServerEntry from './ServerEntry';

const LoginView: React.FC = () => {
  const { Background } = DivStyles;

  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [uiActive, setUIactive] = useState<boolean>(true);

  const handleLogin = async () => {
    console.log(email);
    setUIactive(false);
    await setTimeout(() => setUIactive(true), 1500);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await setTimeout(() => setRefreshing(false), 1500);
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
            showsVerticalScrollIndicator
          >
            <SecondaryText
              style={{
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              Select server to log into:
            </SecondaryText>
            <ServerEntry description="randomowo" ip="127.0.0.1" inRange />
            <ServerEntry description="randomowo" ip="127.0.0.1" />
          </ServerScrollView>

          <InputContainer>
            <StyledTextInput
              autoCompleteType="email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email address..."
              onChange={setEmail}
              editable={uiActive && !refreshing}
            />
            <StyledTextInput
              autoCompleteType="password"
              autoCapitalize="none"
              keyboardType="default"
              secureTextEntry
              placeholder="Password..."
              onChange={setPwd}
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

        {modalVisible && (
          <BlurView
            blurType="regular"
            blurAmount={1}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          />
        )}

        <AccountModal
          visible={modalVisible}
          handleClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginView;
