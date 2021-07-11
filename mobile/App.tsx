/* eslint-disable @typescript-eslint/no-unused-vars */
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { io, Socket } from 'socket.io-client';
import React, { useState } from 'react';
import LoginView from './src/LoginView/LoginView';
import DoorsView from './src/DoorsView/DoorsView';
import { MainStackParams } from './src/Navigation/Params';
import { SocketContext } from './src/SocketIO/socket.provider';

const MainStack = createStackNavigator<MainStackParams>();

const App = () => {
  const [socket, setSocket] = useState<Socket>(io());

  return (
    <NavigationContainer>
      <SocketContext.Provider value={{ socket, setSocket }}>
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
      </SocketContext.Provider>
    </NavigationContainer>
  );
};

export default App;
