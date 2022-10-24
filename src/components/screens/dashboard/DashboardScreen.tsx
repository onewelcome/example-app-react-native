import React, {useState} from 'react';
import {StyleSheet, Alert, ScrollView} from 'react-native';
import SettingsActionsView from './components/SettingsActionsView';
import DashboardActionsView from './components/DashboardActionsView';
import ChangeAuthView from './components/ChangeAuthView';
import OtpCodeView from './components/OtpCodeView';
import OneWelcomeSdk, {Events} from 'onewelcome-react-native-sdk';
import DevicesView from '../devices/DevicesView';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'src/components/app/App';

type Props = NativeStackScreenProps<RootStackParamList, 'DashboardScreen'>;

const DashboardScreen = ({}: Props) => {
  const [contentView, setContentView] = useState(
    CONTENT_VIEW.DASHBOARD_ACTIONS,
  );

  function onShowAccessToken() {
    OneWelcomeSdk.getAccessToken()
      .then(token => Alert.alert('Access Token', token))
      .catch(() => Alert.alert('Error!', 'Could not get AccessToken!'));
  }

  return (
    <ScrollView style={styles.container}>
      {renderContent(contentView, setContentView, onShowAccessToken)}
    </ScrollView>
  );
};

//
enum CONTENT_VIEW {
  DASHBOARD_ACTIONS = 'DASHBOARD_ACTIONS',
  SETTINGS_ACTIONS = 'SETTINGS_ACTIONS',
  CHANGE_AUTH = 'CHANGE_AUTH',
  OTP_CODE = 'OTP_CODE',
  DEVICES = 'DEVICES',
}

const TITLE_BY_CONTENT_VIEW: Map<CONTENT_VIEW, string> = new Map([
  [CONTENT_VIEW.DASHBOARD_ACTIONS, 'Example'],
  [CONTENT_VIEW.SETTINGS_ACTIONS, 'Settings'],
  [CONTENT_VIEW.CHANGE_AUTH, 'Change Auth'],
  [CONTENT_VIEW.DEVICES, 'Devices'],
]);

const backButtonHandler = (
  currentContentView: CONTENT_VIEW,
  setContentView: (contentView: CONTENT_VIEW) => void,
) => {
  switch (currentContentView) {
    case CONTENT_VIEW.SETTINGS_ACTIONS:
      setContentView(CONTENT_VIEW.DASHBOARD_ACTIONS);
      break;
    case CONTENT_VIEW.CHANGE_AUTH:
      setContentView(CONTENT_VIEW.SETTINGS_ACTIONS);
      break;
    case CONTENT_VIEW.OTP_CODE:
      setContentView(CONTENT_VIEW.DASHBOARD_ACTIONS);
      break;
    case CONTENT_VIEW.DEVICES:
      setContentView(CONTENT_VIEW.DASHBOARD_ACTIONS);
      break;
    default:
      console.log('Unsupported CONTENT_VIEW for [BackButton]');
      break;
  }
};

const renderContent = (
  currentContentView: CONTENT_VIEW,
  setContentView: (contentView: CONTENT_VIEW) => void,
  onShowAccessToken?: () => void,
) => {
  switch (currentContentView) {
    case CONTENT_VIEW.DASHBOARD_ACTIONS:
      return (
        <DashboardActionsView
          onSettingsPressed={() =>
            setContentView(CONTENT_VIEW.SETTINGS_ACTIONS)
          }
          onMobileAuthWithOTPPressed={() =>
            setContentView(CONTENT_VIEW.OTP_CODE)
          }
          onYourDevicesPressed={() => setContentView(CONTENT_VIEW.DEVICES)}
          onAccessTokenPressed={onShowAccessToken}
        />
      );
    case CONTENT_VIEW.SETTINGS_ACTIONS:
      return (
        <SettingsActionsView
          onChangeAuthPressed={() => setContentView(CONTENT_VIEW.CHANGE_AUTH)}
          onChangePinPressed={() =>
            OneWelcomeSdk.submitPinAction(
              Events.PinFlow.Change,
              Events.PinAction.Cancel, // ONEGINI_PIN_ACTIONS.CHANGE - why it was CHANGE here? there is no such action
              null,
            )
          }
        />
      );
    case CONTENT_VIEW.CHANGE_AUTH:
      return <ChangeAuthView />;
    case CONTENT_VIEW.OTP_CODE:
      return <OtpCodeView />;
    case CONTENT_VIEW.DEVICES:
      return <DevicesView />;
    default:
      console.log('Unsupported CONTENT_VIEW for [renderContent]');
      break;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
});

export default DashboardScreen;
