import OneWelcomeSdk from '@onewelcome/react-native-sdk';
import {Linking} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import DialogContext from '../providers/dialogContext';

export const useSDK = () => {
  const [isBuilt, setBuilt] = useState(false);
  const [sdkError, setSdkError] = useState(null);
  const [redirectUri, setRedirectUri] = useState('');
  const {showDialog, closeDialog} = useContext(DialogContext);
  const startSDK = async () => {
    console.log('startsdk');

    try {
      closeDialog();
      await OneWelcomeSdk.startClient();
      const uri = await OneWelcomeSdk.getRedirectUri();
      setSdkError(null);
      setBuilt(true);
      setRedirectUri(uri);
    } catch (e: any) {
      showDialog({
        title: 'Could not start the SDK',
        message: e?.message,
        onCloseDialog: startSDK,
      });
      setSdkError(e?.message);
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
    sdkError,
    redirectUri,
    startSDK,
  };
};
