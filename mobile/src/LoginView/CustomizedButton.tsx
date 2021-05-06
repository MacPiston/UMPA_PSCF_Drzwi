import React from 'react';
import { Text, Pressable, ActivityIndicator } from 'react-native';

interface ButtonProps {
  isPrimary?: boolean;
  isLoading?: boolean;
  text: string;
  onPress: () => void;
}

const CustomizedButton: React.FC<ButtonProps> = ({
  isPrimary = false,
  text,
  onPress,
  isLoading = false,
}: ButtonProps) => {
  return (
    <Pressable
      style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}
      onPress={onPress}
      disabled={isLoading}
    >
      {!isLoading && (
        <Text
          style={
            isPrimary ? { fontSize: 36, fontWeight: '600' } : { fontSize: 20 }
          }
        >
          {text}
        </Text>
      )}
      {isLoading && <ActivityIndicator size="large" color="black" />}
    </Pressable>
  );
};

export default CustomizedButton;
