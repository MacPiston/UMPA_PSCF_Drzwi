/* eslint-disable @typescript-eslint/no-unused-vars */
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginView from './src/LoginView/LoginView';
import DoorsView from './src/DoorsView/DoorsView';
import { MainStackParams } from './src/Navigation/Params';

const MainStack = createStackNavigator<MainStackParams>();

const App = () => {
  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{ gestureEnabled: false }}>
        <MainStack.Screen
          name="Login"
          component={LoginView}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="Doors"
          component={DoorsView}
          options={{ headerShown: false }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
