interface BtDevice {
  isConnectable: boolean;
  serviceUUID: number;
  lockName: string;
  isExpanded: boolean;
}

export default BtDevice;
