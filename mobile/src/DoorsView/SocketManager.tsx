import { useState, useContext, useEffect } from 'react';
import { Door } from './DoorType';
import { SocketContext } from '../SocketIO/socket.provider';

interface DataType {
  doorsList: Door[];
}

const useSocketManager = () => {
  const [doorsList, setDoorsList] = useState<Door[]>([]);
  //   const { params } = useRoute<DoorsScreenRouteProp>();
  //   const { email } = params;
  const { socket } = useContext(SocketContext);

  const disconnectSocket = () => {
    socket.disconnect();
  };

  useEffect(() => {
    socket.on('doors', (data: DataType) => {
      const array = data.doorsList.map((item) => ({
        lockID: item.lockID,
        doorName: item.doorName,
        uuid: item.uuid,
        isOpen: item.isOpen,
        inBtRange: false,
        isExpanded: false,
      }));
      setDoorsList(array);
    });
  });

  return {
    doorsList,
    setDoorsList,
    disconnectSocket,
  };
};

export default useSocketManager;
