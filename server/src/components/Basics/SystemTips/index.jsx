/* third lib*/
import React, { useState, useMemo, useEffect } from 'react';
import styled from '@emotion/styled';

/* MUI */
import ClickAwayListener from '@mui/material/ClickAwayListener';

/* local components & methods */
import TagDisplay from '@comp/TagDisplay';

// Import global variables from theme.js
import { COLORS, SPACING } from '../../theme';

// Create styled component using @emotion/styled
const SystemTipsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const TipsPanel = styled.div`
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
  padding: 0 ${SPACING.space32};

  &.open {
    transition: 0.3s all;
    width: 30rem;
  }
`;

const SystemTips = ({ style, show, handleClose, ...options }) => {
  const [openState, setOpenState] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOpenState(true);
    }, 0);
  }, [show]);

  const TipsComponent = useMemo(() => {
    if (style === 1) {
      return <TagDisplay {...options} />;
    }
  }, [style, options]);

  return (
    <SystemTipsContainer>
      <ClickAwayListener onClickAway={handleClose}>
        <TipsPanel className={openState ? 'open' : ''} id='designPanel'>
          {TipsComponent}
        </TipsPanel>
      </ClickAwayListener>
    </SystemTipsContainer>
  );
};

export default SystemTips;
