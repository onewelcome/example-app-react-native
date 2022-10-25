import React from 'react';
import {AuthProvider} from '../../providers/auth.provider';
import {NavigationContainer} from '@react-navigation/native';
import App from './App';

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
