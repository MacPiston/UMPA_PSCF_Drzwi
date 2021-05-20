export type server = {
  name: string;
  ip: string;
  key: number;
  status: number;
};

export const connectionStates = {
  none: 0,
  inRange: 1,
  connecting: 2,
  connected: 3,
};

export enum ActionState {
  SetConnected = 'CONN',
  SetConnecting = 'CNTG',
  SetDisconnected = 'DISC',
  SetInRange = 'INRG',
  DisconnectAll = 'ADSC',
  AddServers = 'ADDS',
  DeleteServer = 'DELS',
  LoadServers = 'LDSV',
}

type ServerAction = {
  type: ActionState;
  servers?: server[];
  server?: server;
};

export const serversReducer = (
  state: server[],
  action: ServerAction,
): server[] => {
  const { none, inRange, connecting, connected } = connectionStates;
  const {
    SetConnected,
    SetConnecting,
    SetDisconnected,
    SetInRange,
    DisconnectAll,
    AddServers,
    LoadServers,
    DeleteServer,
  } = ActionState;
  const { type, servers, server } = action;

  const newState = [...state];
  let index = -1;

  if (server) {
    index = newState.indexOf(server);
    console.log(index);
    if (index < 0) return state;
  }

  switch (type) {
    case DisconnectAll:
      newState.forEach((_, i, array) => {
        array[i].status = none;
      });
      return newState;

    case SetDisconnected:
      console.log('setting disconnected');
      newState[index].status = none;
      return newState;

    case SetInRange:
      console.log('setting inrange');
      newState[index].status = inRange;
      return newState;

    case SetConnecting:
      console.log('setting connecting');
      newState[index].status = connecting;
      return newState;

    case SetConnected:
      console.log('setting connected');
      newState[index].status = connected;
      return newState;

    case AddServers:
      console.log('adding server');
      if (servers) {
        return newState.concat(servers);
      }
      return newState;

    case LoadServers:
      console.log('loading servers');
      if (servers) return servers;
      return [];

    case DeleteServer:
      console.log('deleting server');
      if (server) {
        if (index === 0) newState.shift();
        else newState.splice(index - 1, 1);
      }
      return newState;

    default:
      return newState;
  }
};
