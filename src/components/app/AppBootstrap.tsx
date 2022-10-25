import React from 'react';
import {AuthProvider} from '../../providers/auth.provider';
import {NavigationContainer} from '@react-navigation/native';
import App from './App';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';

const AppBootstrap: React.FC<{}> = () => {
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};

export default AppBootstrap;
