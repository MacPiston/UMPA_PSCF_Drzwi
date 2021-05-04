import React from 'react';
import { Text, Pressable } from 'react-native';

interface ButtonProps {
  primary?: boolean;
  text: string;
  onPress: () => void;
}

const CustomizedButton: React.FC<ButtonProps> = ({
  primary = false,
  text,
  onPress,
}: ButtonProps) => {
  return (
    <Pressable
      style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}
      onPress={onPress}
    >
      <Text style={primary ? { fontSize: 34 } : { fontSize: 20 }}>{text}</Text>
    </Pressable>
  );
};

export default CustomizedButton;
