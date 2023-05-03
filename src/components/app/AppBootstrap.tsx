import React from 'react';
import {AuthProvider} from '../../providers/auth.provider';
import {NavigationContainer} from '@react-navigation/native';
import App from './App';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {Provider as PaperProvider} from 'react-native-paper';
import OneWelcomeTheme from '../constants/Theme';

const AppBootstrap: React.FC<{}> = () => {
  return (
    <PaperProvider theme={OneWelcomeTheme}>
      <ActionSheetProvider>
        <NavigationContainer>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NavigationContainer>
      </ActionSheetProvider>
    </PaperProvider>
  );
};

export default AppBootstrap;
