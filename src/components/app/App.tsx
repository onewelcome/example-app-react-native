import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  BackHandler,
  ToastAndroid,
  View,
  Text,
} from 'react-native';
import PinModal from '../modals/pin/PinModal';
import TwoWayOtpApiModal from '../modals/customRegistration/TwoWayOtpApiModal';
import HomeScreen from '../screens/home/HomeScreen';
import MobileAuthOTPModal from '../modals/mobileauthotp/MobileAuthOTPModal';
import FingerprintModal from '../modals/fingerprint/FingerprintModal';
import {AuthProvider} from '../../providers/auth.provider';
import {useSDK} from '../../helpers/useSDK';
import SplashScreen from '../screens/splash/SplashScreen';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const App: React.FC<{}> = () => {
  const [isReadyToExit, setIsReadyToExit] = useState(false);
  const {isBuilt, isSdkError, startSDK} = useSDK();
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

  function MainContent() {
    return (
      <>
        <StatusBar
          barStyle={Platform.OS === 'android' ? 'light-content' : 'default'}
          backgroundColor={'#4a38ae'}
        />
        <SafeAreaView style={styles.container}>
          <FingerprintModal />
          <MobileAuthOTPModal />
          <TwoWayOtpApiModal />
          <PinModal />
          <HomeScreen />
        </SafeAreaView>
      </>
    );
  }

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Splash">
          {isBuilt || isSdkError ? (
            <Stack.Screen name="Home" component={MainContent} />
          ) : (
            <Stack.Screen name="Splash" component={SplashScreen} />
          )}
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;
