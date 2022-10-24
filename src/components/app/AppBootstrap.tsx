import React from 'react';
import {Platform, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthProvider} from '../../providers/auth.provider';
import {NavigationContainer} from '@react-navigation/native';
import App from './App';

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

const AppBootstrap: React.FC<{}> = () => {
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={state => {
        console.log(state);
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
      }}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppBootstrap;
