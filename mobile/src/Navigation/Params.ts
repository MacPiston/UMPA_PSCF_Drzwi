import { RouteProp } from '@react-navigation/core';

export type MainStackParams = {
  Login: undefined;
  Doors: {
    email: string;
    address: string;
  };
};

export type DoorsScreenRouteProp = RouteProp<MainStackParams, 'Doors'>;
