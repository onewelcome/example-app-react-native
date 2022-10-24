import React, {useContext, useEffect} from 'react';
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
import {AuthContext} from '../../providers/auth.provider';

export type RootStackParamList = {
  Home: undefined;
  AuthScreen: undefined;
  DashboardScreen: undefined;
  InfoScreen: undefined;
};

const App: React.FC<{}> = () => {
  const {isBuilt, isSdkError, startSDK} = useSDK();
  const {
    state: {authorized: isAuthorized},
  } = useContext(AuthContext);

  useEffect(() => {
    startSDK();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Stack = createNativeStackNavigator<RootStackParamList>();

  if (!isBuilt && !isSdkError) {
    return <SplashScreen />;
  }

  return (
    <>
      <FingerprintModal />
      <MobileAuthOTPModal />
      <TwoWayOtpApiModal />
      <PinModal />

      <Stack.Navigator>
        {isAuthorized ? (
          <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AuthScreen" component={AuthScreen} />
            <Stack.Screen name="InfoScreen" component={InfoScreen} />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default App;
