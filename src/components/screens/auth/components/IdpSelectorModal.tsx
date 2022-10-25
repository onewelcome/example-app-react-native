import React from 'react';
import ModalSelector from 'react-native-modal-selector';
import {StyleSheet} from 'react-native';
import {Types} from 'onewelcome-react-native-sdk';

interface Props {
  identityProviders: Types.IdentityProvider[];
  onSetSelectedIdp: (id: string) => void;
  visible: boolean;
  onCancel: () => void;
}
// The empty fragment is intended here to hide the default button that the ModalSelector generates by default
const IdpSelectorModal: React.FC<Props> = props => {
  return (
    <ModalSelector
      visible={props.visible}
      data={props.identityProviders}
      initValue={'Select an identity provider'}
      keyExtractor={item => item.id}
      labelExtractor={item => item.name}
      selectedKey={''}
      selectedItemTextStyle={styles.modalText}
      style={styles.modal}
      onModalClose={option => {
        //workaround for ios onchange being called twice. https://github.com/peacechen/react-native-modal-selector/issues/140
        if (option.id) {
          props.onSetSelectedIdp(option.id);
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
  container: {
    marginTop: '30%',
    width: '100%',
    alignItems: 'center',
  },
  switch: {
    marginTop: 10,
  },
  errorText: {
    marginTop: 10,
    fontSize: 15,
    color: '#c82d2d',
  },
  modal: {
    width: '100%',
  },
  modalText: {
    fontWeight: '700',
  },
});

export default IdpSelectorModal;
