/* third lib */
import React from 'react';
import styled from '@emotion/styled';

/* MUI */
import Tooltip from '@mui/material/Tooltip';

// Import global variables from theme.js
import { COLORS } from '../../theme';

// Create styled component using @emotion/styled
const CustomTooltip = styled(Tooltip)`
  .MuiTooltip-tooltip {
    background-color: ${COLORS.white};
    color: rgba(0, 0, 0, 0.87);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 11px;
    border-color: ${COLORS.white};
  }

  .MuiTooltip-arrow {
    backgroundcolor: ${COLORS.white};
  }
`;

export default CustomTooltip;
