import React, {useContext, useEffect} from 'react';
import PinModal from '../modals/pin/PinModal';
import TwoWayOtpApiModal from '../modals/customRegistration/TwoWayOtpApiModal';
import MobileAuthOTPModal from '../modals/mobileauthotp/MobileAuthOTPModal';
import FingerprintModal from '../modals/fingerprint/FingerprintModal';
import {useSDK} from '../../helpers/useSDK';
import SplashScreen from '../screens/splash/SplashScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import InfoScreen from '../screens/info/InfoScreen';
import {AuthContext} from '../../providers/auth.provider';
import AuthScreen from '../screens/auth/AuthScreen';
import DevicesView from '../screens/devices/DevicesView';
import OtpCodeView from '../screens/dashboard/components/OtpCodeView';
import SettingsActionsView from '../screens/dashboard/components/SettingsActionsView';
import ChangeAuthView from '../screens/dashboard/components/ChangeAuthView';

export type RootStackParamList = {
  AuthScreen: undefined;
  DashboardScreen: undefined;
  InfoScreen: undefined;
  DevicesScreen: undefined;
  OTPScreen: undefined;
  SettingsScreen: undefined;
  ChangeAuthScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

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

  if (!isBuilt || isSdkError) {
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
          <>
            <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
            <Stack.Screen name="DevicesScreen" component={DevicesView} />
            <Stack.Screen name="OTPScreen" component={OtpCodeView} />
            <Stack.Screen
              name="SettingsScreen"
              component={SettingsActionsView}
            />
            <Stack.Screen name="ChangeAuthScreen" component={ChangeAuthView} />
          </>
        ) : (
          <>
            <Stack.Screen name="AuthScreen" component={AuthScreen} />
            <Stack.Screen name="InfoScreen" component={InfoScreen} />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default App;
