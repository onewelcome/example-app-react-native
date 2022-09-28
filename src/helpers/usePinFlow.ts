import {useCallback, useEffect, useState} from 'react';
import OnewelcomeSdk, {Events} from 'onewelcome-react-native-sdk';
import {useProfileStorage} from './useProfileStorage';

const usePinFlow = () => {
  const [flow, setFlow] = useState<Events.PinFlow>(Events.PinFlow.Create);
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [visible, setVisible] = useState(false);
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
    async (event: Events.PinOpenEvent) => {
      setVisible(true);
      if (flow !== event.flow) {
        setFlow(event.flow);
      }
      if (event.data && !isNaN(Number(event.data))) {
        await setPinProfile(event.profileId, event.data);
        setPinLength(event.data);
      } else {
        setPinLength(await getPinProfile(event.profileId));
      }
    },
    [flow, getPinProfile, setPinProfile],
  );

  const handleError = useCallback((err: string) => {
    setError(err);
    setConfirmMode(false);
    setPin('');
  }, []);

  const handleIncorrectPin = useCallback((event: Events.IncorrectPinEvent) => {
    setRemainingFailureCount(event.remainingFailureCount);
    setPin('');
    setConfirmMode(false);
  }, []);

  const handlePinNotAllowed = useCallback(
    (event: Events.PinNotAllowedEvent) => {
      setError(event.errorMsg);
      setConfirmMode(false);
      setPin('');
    },
    [],
  );

  const handleNotification = useCallback(
    async (event: Events.PinEvent) => {
      console.log('handle PIN notification event: ', event);
      switch (event.action) {
        case Events.Pin.Open:
          await handleOpen(event);
          break;
        case Events.Pin.Close:
          setInitialState();
          break;
        case Events.Pin.IncorrectPin:
          handleIncorrectPin(event);
          break;
        case Events.Pin.PinNotAllowed:
          handlePinNotAllowed(event);
          break;
      }
    },
    [handleOpen, setInitialState, handleIncorrectPin, handlePinNotAllowed],
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
  };
};

const onCancelPinFlow = (flow: Events.PinFlow) =>
  OnewelcomeSdk.submitPinAction(flow, Events.PinAction.Cancel, null);

export {usePinFlow};
