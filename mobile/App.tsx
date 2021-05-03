import React from 'react';
import { SafeAreaView } from 'react-native';
import LoginView from './src/LoginView/LoginView';
import DoorsView from './src/DoorsView/DoorsView';

const App = () => {
  return (
    <SafeAreaView>
      {/* Comment to disable */}
      <DoorsView />
      <LoginView />
    </SafeAreaView>
  );
};

export default App;
