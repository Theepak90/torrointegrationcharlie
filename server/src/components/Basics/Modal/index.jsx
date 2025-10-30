/* third libs */
import React from 'react';
import styled from '@emotion/styled';

/* MUI */
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import ScrollBar from 'react-perfect-scrollbar';

// Import global variables from theme.js
import { COLORS } from '../../theme';

// Create styled component using @emotion/styled
const ModelPaper = styled.div`
  position: absolute;
  min-width: 30rem;
  background-color: ${COLORS.white};
  padding: 2rem 1rem 1rem;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25);
  min-height: 20rem;
  border-radius: 4px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  display: inline-block;
  outline: 0;
  max-width: calc(100vw - 2rem);
  max-height: calc(100vh - 2rem);

  &:focus-visible {
    outline: 0;
  }
`;

const CloseIconButton = styled(CloseIcon)`
  z-index: 999;
  width: 2rem;
  height: 2rem;
  color: ${COLORS.color12};
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
`;

const ModalScrollbar = styled(ScrollBar)`
  max-height: calc(100vh - 5rem);
  min-height: 20rem;
`;

const CustomModel = ({ children, name, open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby={`${name}-modal-title`}
      aria-describedby={`${name}-modal-description`}
    >
      <Fade in={open}>
        <ModelPaper>
          {handleClose && <CloseIconButton onClick={handleClose} />}
          <ModalScrollbar>{children}</ModalScrollbar>
        </ModelPaper>
      </Fade>
    </Modal>
  );
};

export default CustomModel;
