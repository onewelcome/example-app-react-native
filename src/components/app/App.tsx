import React, {useEffect} from 'react';
import PinModal from '../modals/pin/PinModal';
import TwoWayOtpApiModal from '../modals/customRegistration/TwoWayOtpApiModal';
import HomeScreen from '../screens/home/HomeScreen';
import MobileAuthOTPModal from '../modals/mobileauthotp/MobileAuthOTPModal';
import FingerprintModal from '../modals/fingerprint/FingerprintModal';
import {useSDK} from '../../helpers/useSDK';
import SplashScreen from '../screens/splash/SplashScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthScreen from '../screens/auth/AuthScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import InfoScreen from '../screens/info/InfoScreen';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  AuthScreen: undefined;
  DashboardScreen: undefined;
  InfoScreen: undefined;
};

const App: React.FC<{}> = () => {
  const {isBuilt, isSdkError, startSDK} = useSDK();

  useEffect(() => {
    startSDK();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <>
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
            <Stack.Screen name="DashboardScreen" component={DashboardScreen} />

            {/* <Stack.Screen name="PinScreen" component={PinScreen} /> */}
          </>
        ) : (
          <Stack.Screen name="Splash" component={SplashScreen} />
        )}
      </Stack.Navigator>
    </>
  );
};

export default App;
