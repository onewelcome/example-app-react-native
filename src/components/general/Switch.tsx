import React from 'react';
import {View, StyleSheet, Text, ViewStyle, TextStyle} from 'react-native';
import AppColors from '../constants/AppColors';
import {Switch as PaperSwitch} from 'react-native-paper';

interface Props {
  value: boolean;
  onSwitch?: (enabled: boolean) => void;
  label: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: ViewStyle | TextStyle;
}

const Switch: React.FC<Props> = ({
  value,
  onSwitch,
  label,
  disabled = false,
  containerStyle,
  labelStyle,
}) => {
  const containerStyles = {
    ...styles.container,
    ...containerStyle,
  };

  const labelStyles = {
    ...styles.label,
    ...labelStyle,
  };

  return (
    <View style={containerStyles}>
      <Text style={labelStyles}>{label}</Text>
      <PaperSwitch
        style={styles.switch}
        color={AppColors.primary}
        onValueChange={onSwitch}
        value={value}
        disabled={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '400',
    color: AppColors.textDefault,
  },
  switch: {
    transform: [{scale: 0.7}],
  },
});

export default Switch;
