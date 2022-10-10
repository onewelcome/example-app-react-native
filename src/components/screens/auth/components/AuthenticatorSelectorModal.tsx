import React, {useCallback, useEffect, useState} from 'react';
import ModalSelector from 'react-native-modal-selector';
import {StyleSheet} from 'react-native';
import {Authenticator} from 'onewelcome-react-native-sdk/ts/data-types';
import OneWelcomeSdk from 'onewelcome-react-native-sdk';

interface Props {
  onSelectAuthenticator: (authenticator: string) => void;
  onCancel: () => void;
  visible: boolean;
  profileId: string;
}
const AuthenticatorSelectorModal: React.FC<Props> = props => {
  const [authenticators, setAuthenticators] = useState<Authenticator[]>([]);

  const updateAuthenticators = useCallback(async () => {
    try {
      const authenticators_ = await OneWelcomeSdk.getRegisteredAuthenticators(
        props?.profileId ?? '',
      );
      setAuthenticators(authenticators_);
    } catch (err) {
      setAuthenticators([]);
    }
  }, [props.profileId]);

  useEffect(() => {
    updateAuthenticators();
  }, [props.profileId, updateAuthenticators]);

  // The empty fragment is intended here to hide the default button that the ModalSelector generates by default
  return (
    <ModalSelector
      visible={props.visible}
      data={authenticators}
      selectedKey={''}
      keyExtractor={item => item.id}
      labelExtractor={item => item.name}
      selectedItemTextStyle={styles.modalText}
      style={styles.modal}
      onModalClose={option => {
        //workaround for ios onchange being called twice. https://github.com/peacechen/react-native-modal-selector/issues/140
        if (option.id) {
          props.onSelectAuthenticator(option.id);
        } else {
          props.onCancel();
        }
      }}
    >
      <></>
    </ModalSelector>
  );
};

const styles = StyleSheet.create({
  modalText: {
    fontWeight: '700',
  },
  modal: {
    width: '100%',
  },
});

export default AuthenticatorSelectorModal;
