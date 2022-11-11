import OneWelcomeSdk, {Types} from 'onewelcome-react-native-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Linking} from 'react-native';
import {useEffect, useState} from 'react';

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

export const useSDK = () => {
  const [isBuilt, setBuilt] = useState(false);
  const [isSdkError, setSdkError] = useState(false);
  const [redirectUri, setRedirectUri] = useState('');
  const startSDK = async () => {
    console.log('startsdk');
    try {
      await OneWelcomeSdk.startClient(config);
      const linkUriResult = await OneWelcomeSdk.getRedirectUri();
      const linkUriString = linkUriResult.redirectUri.substring(
        0,
        linkUriResult.redirectUri.indexOf(':'),
      );
      await AsyncStorage.setItem('@redirectUri', linkUriString);
      setBuilt(true);
      setRedirectUri(linkUriString);
    } catch (e: any) {
      Alert.alert(`Error when starting SDK. Code:${e.code}`, e.message);
      setSdkError(true);
    }
  };

  useEffect(() => {
    const handleOpenURL = (event: {url: string}) => {
      if (event.url.substring(0, event.url.indexOf(':')) === redirectUri) {
        OneWelcomeSdk.handleRegistrationCallback(event.url);
      }
    };

    const listener = Linking.addListener('url', handleOpenURL);
    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [redirectUri]);

  return {
    isBuilt,
    isSdkError,
    redirectUri,
    startSDK,
  };
};
