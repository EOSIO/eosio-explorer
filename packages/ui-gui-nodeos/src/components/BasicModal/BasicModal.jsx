import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ButtonPrimary, ButtonSecondary } from 'styled';

const Portal = ({ children }) => {
  const modalRoot = document.getElementById('modal');
  const el = document.createElement("div");

  useEffect(() => {
    modalRoot.appendChild(el);
  }, []);

  return createPortal(children, el);
};

// Wrapper replacement for Model 'reactstrap'
const BasicModal = ({ children, header, toggle, open, handleConfirm }) => (
  <Portal>
    <Modal isOpen={open} toggle={toggle} backdrop={true}>
      <ModalHeader>{header}</ModalHeader>
      <ModalBody>
        {children}
      </ModalBody>
      <ModalFooter>
        {
          handleConfirm &&
          <ButtonPrimary onClick={handleConfirm}>
            Confirm
          </ButtonPrimary>
        }
        <ButtonSecondary onClick={toggle}>
          Close
        </ButtonSecondary>
      </ModalFooter>
    </Modal>
  </Portal>
)

export default BasicModal;
