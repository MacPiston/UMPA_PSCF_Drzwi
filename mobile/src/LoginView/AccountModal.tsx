import React, { useState } from 'react';
import { Text, View, Modal } from 'react-native';

interface ModalProps {
  visible: boolean;
  handleClose: () => void;
}
const AccountModal: React.FC<ModalProps> = ({
  visible,
  handleClose,
}: ModalProps) => (
  <Modal
    animationType="fade"
    visible={visible}
    onRequestClose={handleClose}
    transparent
  >
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 30,
        marginVertical: 320,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }}
      onTouchStart={handleClose}
    >
      <Text>Nie dostaniesz konta i chuj</Text>
    </View>
  </Modal>
);

export default AccountModal;
