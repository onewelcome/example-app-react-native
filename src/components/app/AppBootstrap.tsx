import React from 'react';
import {Platform, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthProvider} from '../../providers/auth.provider';
import {NavigationContainer} from '@react-navigation/native';
import App from './App';

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

const AppBootstrap: React.FC<{}> = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppBootstrap;
