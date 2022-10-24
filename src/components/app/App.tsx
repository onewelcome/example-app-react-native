import React, {useEffect, useState} from 'react';
import {Platform, BackHandler, ToastAndroid, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PinModal from '../modals/pin/PinModal';
import TwoWayOtpApiModal from '../modals/customRegistration/TwoWayOtpApiModal';
import HomeScreen from '../screens/home/HomeScreen';
import MobileAuthOTPModal from '../modals/mobileauthotp/MobileAuthOTPModal';
import FingerprintModal from '../modals/fingerprint/FingerprintModal';
import {AuthProvider} from '../../providers/auth.provider';
import {useSDK} from '../../helpers/useSDK';
import SplashScreen from '../screens/splash/SplashScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthScreen from '../screens/auth/AuthScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import InfoScreen from '../screens/info/InfoScreen';

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  AuthScreen: undefined;
  DashboardScreen: undefined;
  InfoScreen: undefined;
};

const App: React.FC<{}> = () => {
  const [isReadyToExit, setIsReadyToExit] = useState(false);
  const {isBuilt, isSdkError, startSDK} = useSDK();

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

  useEffect(() => {
    const subscriber = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isReadyToExit) {
        return false;
      }

      setIsReadyToExit(true);

      setTimeout(() => setIsReadyToExit(false), 2000);

      ToastAndroid.show('Click back again to exit.', ToastAndroid.SHORT);

      return true;
    });
    return () => subscriber.remove();
  }, [isReadyToExit]);

  useEffect(() => {
    startSDK();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isReady) {
    return null;
  }

  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={state =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <AuthProvider>
        <FingerprintModal />
        <MobileAuthOTPModal />
        <TwoWayOtpApiModal />
        <PinModal />

        <Stack.Navigator initialRouteName="Splash">
          {isBuilt || isSdkError ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="AuthScreen" component={AuthScreen} />
              <Stack.Screen name="InfoScreen" component={InfoScreen} />
              <Stack.Screen
                name="DashboardScreen"
                component={DashboardScreen}
              />

              {/* <Stack.Screen name="PinScreen" component={PinScreen} /> */}
            </>
          ) : (
            <Stack.Screen name="Splash" component={SplashScreen} />
          )}
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
