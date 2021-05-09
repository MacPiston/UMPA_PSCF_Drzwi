import React from 'react';
import { Text, Pressable, ActivityIndicator } from 'react-native';
import { Styles } from './Stylesheets/Stylesheets';
import { Shadows, Colors } from './Stylesheets/Stylesheets';

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
            isPrimary
              ? { fontSize: 36, fontWeight: '600', color: Colors.Font }
              : { fontSize: 20, color: Colors.Font }
          }
        >
          {text}
        </Text>
      )}
      {isLoading && <ActivityIndicator size="large" color={Colors.Accent} />}
    </Pressable>
  );
};

export default CustomizedButton;
