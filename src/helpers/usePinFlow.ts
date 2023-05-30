import {useCallback, useEffect, useState} from 'react';
import OnewelcomeSdk, {Events} from '@onewelcome/react-native-sdk';
import {useProfileStorage} from './useProfileStorage';

const usePinFlow = () => {
  const [flow, setFlow] = useState<Events.PinFlow>(Events.PinFlow.Create);
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmMode, setConfirmMode] = useState(false);
  const [pinLength, setPinLength] = useState<number>(0);
  const {getPinProfile, setPinProfile} = useProfileStorage();

  const cancelPinFlow = () => onCancelPinFlow(flow);

  const setInitialState = useCallback(() => {
    setError(null);
    setConfirmMode(false);
    setVisible(false);
    setPin('');
  }, []);

  const handleCreateOpen = useCallback(
    async (event: Events.PinCreateOpenEvent) => {
      setVisible(true);
      setFlow(event.flow);
      setPinLength(event.pinLength);
      await setPinProfile(event.profileId, event.pinLength);
    },
    [setPinProfile],
  );

  const handleAuthOpen = useCallback(
    async (event: Events.PinAuthenticationOpenEvent) => {
      setVisible(true);
      setFlow(event.flow);
      setPinLength(await getPinProfile(event.profileId));
    },
    [getPinProfile],
  );

  const handleError = useCallback((err: string) => {
    setError(err);
    setConfirmMode(false);
    setPin('');
  }, []);

  const handleIncorrectPin = useCallback(
    (event: Events.IncorrectPinEvent) => {
      handleError(
        `Pin is incorrect, you have ${event.remainingFailureCount} attempts remaining`,
      );
    },
    [handleError],
  );

  const handlePinNotAllowed = useCallback(
    (event: Events.PinNotAllowedEvent) => {
      handleError(event.errorMsg);
    },
    [handleError],
  );

  const handleCreateNotification = useCallback(
    async (event: Events.PinCreateEvent) => {
      console.log('handle PIN notification event: ', event);
      switch (event.action) {
        case Events.PinCreate.Open:
          await handleCreateOpen(event);
          break;
        case Events.PinCreate.Close:
          setInitialState();
          break;
        case Events.PinCreate.PinNotAllowed:
          handlePinNotAllowed(event);
          break;
      }
    },
    [handleCreateOpen, setInitialState, handlePinNotAllowed],
  );

  const handleAuthNotification = useCallback(
    async (event: Events.PinAuthenticationEvent) => {
      console.log('handle PIN notification event: ', event);
      switch (event.action) {
        case Events.PinAuthentication.Open:
          await handleAuthOpen(event);
          break;
        case Events.PinAuthentication.Close:
          setInitialState();
          break;
        case Events.PinAuthentication.IncorrectPin:
          handleIncorrectPin(event);
          break;
      }
    },
    [handleAuthOpen, setInitialState, handleIncorrectPin],
  );

  useEffect(() => {
    const authListener = OnewelcomeSdk.addEventListener(
      Events.SdkNotification.PinAuth,
      handleAuthNotification,
    );
    const createListener = OnewelcomeSdk.addEventListener(
      Events.SdkNotification.PinCreate,
      handleCreateNotification,
    );
    return () => {
      authListener.remove();
      createListener.remove();
    };
  }, [handleAuthNotification, handleCreateNotification]);

  const handleCreateConfirmPin = (newPinValue: string) => {
    if (newPinValue.length === pinLength) {
      if (firstPin === newPinValue) {
        OnewelcomeSdk.submitPin(flow, newPinValue);
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
      OnewelcomeSdk.submitPin(flow, newPinValue);
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

const onCancelPinFlow = (flow: Events.PinFlow) => {
  switch (flow) {
    case Events.PinFlow.Authentication:
      OnewelcomeSdk.cancelPinAuthentication();
      break;
    case Events.PinFlow.Create:
      OnewelcomeSdk.cancelPinCreation();
  }
};

export {usePinFlow};
