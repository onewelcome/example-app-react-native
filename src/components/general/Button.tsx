import React from 'react';
import {StyleSheet, Text, Pressable, ViewStyle, TextStyle} from 'react-native';

interface Props {
  name: string;
  onPress?: () => void;
  disabled?: boolean;
  backgroundColor?: string;
  backgroundColorPressed?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<Props> = ({
  name,
  onPress,
  disabled = false,
  backgroundColor = '#25b2ff',
  backgroundColorPressed = '#1e8dca',
  containerStyle,
  textStyle,
}) => {
  const buttonStyle = {
    ...styles.button,
    ...containerStyle,
    opacity: disabled ? 0.5 : 1,
  };
  const buttonTextStyle = {
    ...styles.text,
    ...textStyle,
  };

  return (
    <Pressable
      style={({pressed}) => [
        {
          backgroundColor: pressed ? backgroundColorPressed : backgroundColor,
        },
        buttonStyle,
      ]}
      disabled={disabled}
      onPress={() => (disabled ? null : onPress?.())}
    >
      <Text style={buttonTextStyle}>{name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  text: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default Button;
