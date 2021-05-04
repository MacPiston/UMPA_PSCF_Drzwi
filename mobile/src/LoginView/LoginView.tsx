import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { DivStyles } from './Stylesheets/Stylesheets';
import { HeaderText } from './LoginView.Components';

const LoginView: React.FC = (props) => {
  const { Background } = DivStyles;
  return (
    <View style={Background}>
      <SafeAreaView>
        <HeaderText>LoginView</HeaderText>
      </SafeAreaView>
    </View>
  );
};

export default LoginView;
