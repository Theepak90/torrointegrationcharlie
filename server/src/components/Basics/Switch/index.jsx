/* third lib */
import React from 'react';
import styled from '@emotion/styled';
import MuiSwitch from '@mui/material/Switch';
import { COLORS } from '../../theme';

// Styles adapted for MUI 7
const StyledSwitchContainer = styled.div`
  display: block;

  /* MUI 7 uses more specific selectors to ensure styles are applied correctly */
  & .MuiSwitch-root .MuiSwitch-track {
    background-color: ${COLORS.textGrey};
    transition: background-color 0.2s ease;
  }

  & .MuiSwitch-root.Mui-checked .MuiSwitch-track {
    background-color: ${COLORS.mainPurple} !important;
  }

  & .MuiSwitch-root.Mui-checked .MuiSwitch-thumb {
    color: ${COLORS.mainPurple} !important;
    background-color: white;
  }
`;

const SwitchBtn = ({
  name,
  value,
  onChange,
  disabled,
  className,
  ...props
}) => {
  // Simplify checked state calculation, direct conversion comparison
  const checked = String(value) === 'true';

  // Handle onChange event
  const handleChange = e => {
    if (onChange) {
      onChange(String(e.target.checked));
    }
  };

  return (
    <StyledSwitchContainer className={className || ''}>
      <MuiSwitch
        checked={checked}
        onChange={handleChange}
        name={name}
        inputProps={{ 'aria-label': 'checkbox' }}
        disabled={disabled}
        color='primary'
        size='small'
        {...props}
      />
    </StyledSwitchContainer>
  );
};

export default SwitchBtn;
