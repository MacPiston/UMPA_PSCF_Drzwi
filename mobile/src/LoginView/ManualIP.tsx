import React, { useState } from 'react';
import { SecondaryText, StyledTextInput } from './LoginView.Components';
import {
  ViewContainerVertical,
  InputContainerHorizontal,
  ConnectIcon,
} from './ManualIP.Components';

interface ManualIPProps {
  connectionHandler: (ip: string, callback?: () => void) => void;
}

const ManualIP: React.FC<ManualIPProps> = ({
  connectionHandler,
}: ManualIPProps) => {
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const connect = async () => {
    setIsConnecting(true);
    await connectionHandler(address);
    setIsConnecting(false);
  };

  return (
    <ViewContainerVertical>
      <SecondaryText style={{ marginTop: 10, marginBottom: 10 }}>
        Manual IP
      </SecondaryText>
      <InputContainerHorizontal>
        <StyledTextInput
          editable={!isConnecting}
          style={{ height: 40, flex: 7 }}
          placeholder="Server's IP"
          onChangeText={setAddress}
        />
        <ConnectIcon onPress={connect} />
      </InputContainerHorizontal>
    </ViewContainerVertical>
  );
};

export default ManualIP;
