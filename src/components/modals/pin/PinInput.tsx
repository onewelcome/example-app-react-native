import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppColors from '../../constants/AppColors';

const Bullet: React.FC<{filled: boolean}> = props => {
  const style = {
    ...styles.bullet,
    ...(props.filled
      ? {borderWidth: 0, backgroundColor: AppColors.secondary}
      : {}),
  };

  return <View style={style} />;
};

const PinInput: React.FC<{
  currentPinLength: number;
  requiredPinLength: number;
}> = ({currentPinLength, requiredPinLength}) => {
  return (
    <View style={styles.container}>
      {Array.from(Array(requiredPinLength)).map((_, index) => (
        <Bullet key={index} filled={index < currentPinLength} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bullet: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: AppColors.disabled,
    marginHorizontal: 10,
  },
});

export default PinInput;
