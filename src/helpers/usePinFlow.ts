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

  const provideNewPinKey = (newKey: string) =>
    onNewPinKey(newKey, pin, setPin, flow, setError, pinLength || 5, isConfirmMode, setConfirmMode, firstPin, setFirstPin);

  const cancelPinFlow = () => onCancelPinFlow(flow);

  // Event Handlers

  const setInitialState = useCallback(() => {
    setError(null);
    setConfirmMode(false);
    setVisible(false);
    setPin('');
  }, []);

  const setConfirmState = useCallback(() => {
    setConfirmMode(true);
    setPin('');
  }, []);

  const handleOpen = useCallback(
    async (event: Events.PinOpenEvent) => {
      setVisible(true);
      if (flow !== event.flow) {
        setFlow(event.flow);
      }
      if (event.flow === Events.PinFlow.Create) {
        await setPinProfile(event.profileId, event.data);
        setPinLength(event.data);
      } else {
        setPinLength(await getPinProfile(event.profileId));
      }
    },
    [flow, getPinProfile, setPinProfile],
  );

  const handleError = useCallback(
    (event: Events.PinErrorEvent) => {
      setError(event.errorMsg);
      setConfirmMode(false);
      setUserInfo(userInfo || null);
      setPin('');
    },
    [userInfo],
  );

  const handleNotification = useCallback(
    async (event: Events.PinEvent) => {
      console.log('handle PIN notification event: ', event);
      switch (event.action) {
        case Events.Pin.Open:
          await handleOpen(event);
          break;
        case Events.Pin.Error:
          handleError(event);
          break;
        case Events.Pin.Close:
          setInitialState();
          break;
      }
    },
    [handleOpen, setConfirmState, handleError, setInitialState],
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

const onNewPinKey = (
  newKey: string,
  pin: string,
  setPin: (pin: string) => void,
  flow: Events.PinFlow,
  setError: (error: string | null) => void,
  requiredPinLength: number,
  isConfirmMode: boolean,
  setConfirmMode: (mode: boolean) => void,
  firstPin: string,
  setFirstPin: (pin: string) => void
) => {
  setError(null);
  if (newKey === '<' && pin.length > 0) {
    setPin(pin.substring(0, pin.length - 1));
    return;
  }
  const newValue = pin + newKey;
  setPin(newValue);
  switch (flow) {
    case Events.PinFlow.Authentication:
      if (newValue.length === requiredPinLength) {
          OnewelcomeSdk.submitPinAction(flow, Events.PinAction.ProvidePin, newValue);
      }
      break;
    case Events.PinFlow.Create:
    case Events.PinFlow.Change:
      if (isConfirmMode) {
        handleConfirmPin();
      } else {
        handleFirstPin();
      }
      break;
  }
  function handleConfirmPin() {
    if (newValue.length === requiredPinLength) {
      if (firstPin === newValue) {
        OnewelcomeSdk.submitPinAction(flow, Events.PinAction.ProvidePin, newValue);
      } else {
        setError('Pins do not match');
        setConfirmMode(false);
        setPin('');
      }
    }
  }
  function handleFirstPin() {
    setFirstPin(newValue);
    if (newValue.length === requiredPinLength) {
      setConfirmMode(true);
      setPin('');
    }
  }
};

const onCancelPinFlow = (flow: Events.PinFlow) =>
  OnewelcomeSdk.submitPinAction(flow, Events.PinAction.Cancel, null);

export {usePinFlow};
