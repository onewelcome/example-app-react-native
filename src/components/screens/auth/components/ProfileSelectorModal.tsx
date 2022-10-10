import React from 'react';
import ModalSelector from 'react-native-modal-selector';
import {StyleSheet} from 'react-native';

interface Props {
  profileId?: (success: boolean) => void;
  profiles: {id: string; authenticated: boolean}[];
  selectedProfileId: string;
  setSelectedProfileId: React.Dispatch<React.SetStateAction<string>>;
  visible?: boolean | null;
}
const ProfileSelectorModal: React.FC<Props> = props => {
  return props.visible ? (
    <ModalSelector
      data={props.profiles.map(p => p.id)}
      initValue={'Select a profile'}
      selectedKey={props.selectedProfileId}
      keyExtractor={item => item}
      labelExtractor={item => item}
      selectedItemTextStyle={styles.modalText}
      style={styles.modal}
      onChange={option => {
        props.setSelectedProfileId(option);
      }}
    />
  ) : (
    <></>
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

export default ProfileSelectorModal;
