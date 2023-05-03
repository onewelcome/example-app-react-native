import OneWelcomeSdk from 'onewelcome-react-native-sdk';
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
      setBuilt(true);
      setRedirectUri(uri);
    } catch (e: any) {
      Alert.alert(`Error when starting SDK. Code:${e.code}`, e.message);
      setSdkError(true);
    }
  };

  useEffect(() => {
    const handleOpenURL = (event: {url: string}) => {
      if (event.url.startsWith(redirectUri)) {
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
