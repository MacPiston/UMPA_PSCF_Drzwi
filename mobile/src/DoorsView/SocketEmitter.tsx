import { useContext } from 'react';
import { useRoute } from '@react-navigation/core';
import { DoorsScreenRouteProp } from '../Navigation/Params';
import { SocketContext } from '../SocketIO/socket.provider';

const useSocketEmitter = () => {
  const { params } = useRoute<DoorsScreenRouteProp>();
  const { email } = params;
  const { socket } = useContext(SocketContext);

  const refreshdoorsList = () => {
    socket.emit('doorsList', { email });
  };

  const lockLongOpen = (doorId: string) => {
    socket.emit('openDoor', { doorId });
  };

  const lockQuickOpen = (doorId: string) => {
    socket.emit('quickOpenDoor', { doorId });
  };

  return {
    refreshdoorsList,
    lockLongOpen,
    lockQuickOpen,
  };
};

export default useSocketEmitter;
