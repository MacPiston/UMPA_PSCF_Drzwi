import React from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

export interface SocketInterface {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  setSocket: React.Dispatch<
    React.SetStateAction<Socket<DefaultEventsMap, DefaultEventsMap>>
  >;
}

export const SocketContext = React.createContext<SocketInterface>(
  {} as SocketInterface,
);
