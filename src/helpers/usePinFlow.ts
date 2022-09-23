import {useCallback, useEffect, useState} from 'react';
import OnewelcomeSdk, {Events} from 'onewelcome-react-native-sdk';
import {useProfileStorage} from './useProfileStorage';

const usePinFlow = () => {
  const [flow, setFlow] = useState<Events.PinFlow>(Events.PinFlow.Create);
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmMode, setConfirmMode] = useState(false);
  const [pinLength, setPinLength] = useState<number | null>(null);
  const {getPinProfile, setPinProfile} = useProfileStorage();

  const cancelPinFlow = () => onCancelPinFlow(flow);

  const setInitialState = useCallback(() => {
    setError(null);
    setConfirmMode(false);
    setVisible(false);
    setPin('');
  }, []);

  const handleOpen = useCallback(
    async (newFlow: Events.PinFlow, profileId: string, pinLength_?: number) => {
      setVisible(true);
      if (flow !== newFlow) {
        setFlow(newFlow);
      }
      if (pinLength_ && !isNaN(Number(pinLength_))) {
        await setPinProfile(profileId, pinLength_);
      } else {
        pinLength_ = await getPinProfile(profileId);
      }
      setPinLength(pinLength_);
    },
    [flow, getPinProfile, setPinProfile],
  );

  const handleError = useCallback((err: string | null, userInfo_?: any) => {
    setError(err);
    setConfirmMode(false);
    setUserInfo(userInfo_ || null);
    setPin('');
  }, []);

  const handleNotification = useCallback(
    async (event: any) => {
      console.log('handle PIN notification event: ', event);

      switch (event.action) {
        case Events.PinNotification.Open:
          await handleOpen(event.flow, event.profileId, event.data);
          break;
        case Events.PinNotification.Error:
          handleError(event.errorMsg, event.userInfo ?? undefined);
          break;
        case Events.PinNotification.Close:
          setInitialState();
          break;
      }
    },
    [handleOpen, handleError, setInitialState],
  );

  useEffect(() => {
    const listener = OnewelcomeSdk.addEventListener(
      Events.SdkNotification.Pin,
      handleNotification,
    );

    return () => {
      listener.remove();
    };
  }, [handleNotification]);

  const handleCreateConfirmPin = (newPinValue: string) => {
    if (newPinValue.length === pinLength) {
      if (firstPin === newPinValue) {
        OnewelcomeSdk.submitPinAction(
          flow,
          Events.PinAction.ProvidePin,
          newPinValue,
        );
      } else {
        handleError('Pins do not match');
      }
    }
  };

  const handleFirstCreatePin = (newPinValue: string) => {
    setFirstPin(newPinValue);
    if (newPinValue.length === pinLength) {
      OnewelcomeSdk.validatePinWithPolicy(newPinValue)
        .then(() => {
          setConfirmMode(true);
          setPin('');
        })
        .catch(err => {
          handleError(err.message);
        });
    }
  };

  const handleAuthenticatePin = (newPinValue: string) => {
    if (newPinValue.length === pinLength) {
      OnewelcomeSdk.submitPinAction(
        flow,
        Events.PinAction.ProvidePin,
        newPinValue,
      );
    }
  };

  const provideNewPinKey = (newKey: string) => {
    setError(null);
    if (newKey === '<' && pin.length > 0) {
      setPin(pin.substring(0, pin.length - 1));
      return;
    }
    const newPinValue = pin + newKey;
    setPin(newPinValue);
    switch (flow) {
      case Events.PinFlow.Authentication:
        handleAuthenticatePin(newPinValue);
        break;
      case Events.PinFlow.Create:
      case Events.PinFlow.Change:
        if (isConfirmMode) {
          handleCreateConfirmPin(newPinValue);
        } else {
          handleFirstCreatePin(newPinValue);
        }
        break;
    }
  };

  return {
    flow,
    pin,
    visible,
    isConfirmMode,
    error,
    provideNewPinKey,
    cancelPinFlow,
    pinLength,
    userInfo,
  };
};

const onCancelPinFlow = (flow: Events.PinFlow) =>
  OnewelcomeSdk.submitPinAction(flow, Events.PinAction.Cancel, null);

export {usePinFlow};
