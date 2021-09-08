interface AdvertisingData {
  isConnectable?: boolean;
  localName?: string;
  manufacturerData?: any;
  serviceUUIDs?: string[];
  txPowerLevel?: number;
}
export interface Peripheral {
  id: string;
  rssi: number;
  name?: string;
  advertising: AdvertisingData;
}
