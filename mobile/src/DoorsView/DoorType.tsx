export interface Door {
  lockID: string;
  doorName: string;
  uuid: string;
  isOpen: boolean;
  inBtRange: boolean;
  isExpanded: boolean;
}

export interface ServerResponse {
  doorsList: Door[];
}
