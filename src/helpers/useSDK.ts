import OneWelcomeSdk from 'onewelcome-react-native-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Linking} from 'react-native';
import {useEffect, useState} from 'react';

export const useSDK = () => {
  const [isBuilt, setBuilt] = useState(false);
  const [isSdkError, setSdkError] = useState(false);
  const [redirectUri, setRedirectUri] = useState('');
  const startSDK = async () => {
    console.log('startsdk');
    try {
      await OneWelcomeSdk.startClient();
      const uri = await OneWelcomeSdk.getRedirectUri();
      const uriPrefix = uri.substring(0, uri.indexOf(':'));
      await AsyncStorage.setItem('@redirectUri', uriPrefix);
      setBuilt(true);
      setRedirectUri(uriPrefix);
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
