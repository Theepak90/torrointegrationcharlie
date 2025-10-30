/* third lib*/
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ScrollBar from 'react-perfect-scrollbar';

/* local components & methods */
import styled from '@emotion/styled';
import { COLORS, SPACING, SHADOWS } from '@comp/theme';

const Mask = styled.div`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const DesignerPanel = styled.div`
  height: 100%;
  width: 0;
  background-color: ${COLORS.white};
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: ${COLORS.white};
  border-radius: 4px;
  top: 0;
  right: 0;
  padding: ${SPACING.space32} 0;
  box-shadow: ${SHADOWS.paperShadow};

  &.open {
    transition: 0.3s all;
    width: 48rem;
  }
`;

const InnerContent = styled.div`
  padding: 0 ${SPACING.space32};
`;

const DesignPanel = ({ open, handleClose }) => {
  const [openState, setOpenState] = useState(false);

  useEffect(() => {
    if (!open) {
      setOpenState(false);
      return;
    }
    setTimeout(() => {
      setOpenState(true);
    }, 0);
  }, [open]);

  if (!open) {
    return <></>;
  }

  return (
    <Mask>
      <ClickAwayListener onClickAway={handleClose}>
        <DesignerPanel
          id='designPanel'
          className={cn({
            open: openState,
          })}
        >
          <ScrollBar>
            <InnerContent>323123213</InnerContent>
          </ScrollBar>
        </DesignerPanel>
      </ClickAwayListener>
    </Mask>
  );
};

export default DesignPanel;
