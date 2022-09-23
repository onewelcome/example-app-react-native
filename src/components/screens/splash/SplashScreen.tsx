import React, {useEffect} from 'react';
import {StyleSheet, View, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OneWelcomeSdk, {Types} from 'onewelcome-react-native-sdk';
import {Assets} from '../../../../assets';

interface Props {
  onSdkStarted?: () => void;
  onSdkError?: () => void;
}

const SplashScreen: React.FC<Props> = (props) => {
  useEffect(() => {
    startSdk(props.onSdkStarted, props.onSdkError);
  }, [props.onSdkStarted]);

  return (
    <View style={styles.container}>
      <Image source={Assets.logo} />
    </View>
  );
};

const config: Types.Config = {
  enableFingerprint: true,
  securityControllerClassName:
    'com.onegini.mobile.rnexampleapp.SecurityController',
  enableMobileAuthenticationOtp: true,
  customProviders: [
    {id: '2-way-otp-api', isTwoStep: true},
    {id: 'qr_registration', isTwoStep: false},
  ],
  configModelClassName: null,
};

const startSdk = async (onStarted?: Props['onSdkStarted'], onError?: Props['onSdkError']) => {
  try {
    await OneWelcomeSdk.startClient(config);

    const linkUriResult = await OneWelcomeSdk.getRedirectUri();

    await AsyncStorage.setItem(
      '@redirectUri',
      linkUriResult.redirectUri.substr(
        0,
        linkUriResult.redirectUri.indexOf(':'),
      ),
    );
    onStarted?.();
  } catch (e) {
    Alert.alert('Error when starting SDK', JSON.stringify(e));
    onError?.();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;
