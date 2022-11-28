import OneWelcomeSdk from 'onewelcome-react-native-sdk';
import 'promise-any-polyfill';

const cancelRegistration = () => {
  return Promise.any([
    cancelBrowserRegistration(),
    cancelCustomRegistration('The registration has been canceled'),
  ]);
};

const cancelBrowserRegistration = async () => {
  return await OneWelcomeSdk.cancelBrowserRegistration();
};

const cancelCustomRegistration = async (message: string) => {
  return await OneWelcomeSdk.cancelCustomRegistration(message);
};

export {cancelRegistration};
