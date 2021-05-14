export interface server {
  name: string;
  ip: string;
  key: number;
  status: number;
}

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
  AllDisconnected = 'ADSC',
  LoadServers = 'LDSV',
}

type ServerAction = {
  type: ActionState;
  key: number;
  servers: server[];
};

export const serversReducer = (
  state: server[],
  action: ServerAction,
): server[] => {
  const { type, key, servers } = action;
  const newState = state;

  switch (type) {
    case ActionState.AllDisconnected:
      return newState.forEach((srv) => (srv.status = connectionStates.none));
    case ActionState.SetDisconnected:
      newState[key].status = connectionStates.none;
      return newState;
    case ActionState.SetInRange:
      newState[key].status = connectionStates.inRange;
      return newState;
    case ActionState.SetConnecting:
      newState[key].status = connectionStates.connecting;
      return newState;
    case ActionState.SetConnected:
      newState[key].status = connectionStates.connected;
      return newState;
    case ActionState.LoadServers:
      return servers;

    default:
      return newState;
  }
};
