import React from 'react';
import {AuthProvider} from '../../providers/auth.provider';
import {NavigationContainer} from '@react-navigation/native';
import App from './App';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {Provider as PaperProvider} from 'react-native-paper';
import OneWelcomeTheme from '../constants/Theme';
import DialogProvider from '../../providers/dialogProvider';

const AppBootstrap: React.FC<{}> = () => {
  return (
    <PaperProvider theme={OneWelcomeTheme}>
      <DialogProvider>
        <ActionSheetProvider>
          <NavigationContainer>
            <AuthProvider>
              <App />
            </AuthProvider>
          </NavigationContainer>
        </ActionSheetProvider>
      </DialogProvider>
    </PaperProvider>
  );
};

export default AppBootstrap;
