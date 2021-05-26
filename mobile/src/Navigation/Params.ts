import { RouteProp } from '@react-navigation/core';
import { Socket } from 'socket.io-client';

export type MainStackParams = {
  Login: undefined;
  Doors: {
    email: string;
    socket: Socket;
  };
};

export type DoorsScreenRouteProp = RouteProp<MainStackParams, 'Doors'>;
