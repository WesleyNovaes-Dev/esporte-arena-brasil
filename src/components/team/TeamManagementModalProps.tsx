
import React from 'react';
import { Modal } from '@/components/ui/modal';

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const TeamManagementModal: React.FC<TeamManagementModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      {children}
    </Modal>
  );
};

export default TeamManagementModal;
