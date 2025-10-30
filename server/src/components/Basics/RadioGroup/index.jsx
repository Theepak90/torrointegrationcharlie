// third lib
import React from 'react';
import styled from '@emotion/styled';

/* MUI */
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

// 从theme.js中导入全局变量
import { COLORS } from '../../theme';

// 使用@emotion/styled创建样式组件
const StyledFormControl = styled(FormControl)`
  & .radioGroup {
    display: flex !important;
    flex-direction: row !important;
  }
`;

const StyledRadio = styled(Radio)`
  &.checked {
    svg {
      color: ${COLORS.mainPurple};
    }
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  display: inline-block;
`;

const CustRadioGroup = ({ value, options, onChange, disabled }) => {
  return (
    <StyledFormControl>
      <RadioGroup name='radio-buttons-group' className='radioGroup'>
        {options.map((item, index) => {
          return (
            <StyledFormControlLabel
              key={index}
              control={
                <StyledRadio
                  className='checked'
                  checked={value === item.label}
                  onChange={e => {
                    onChange(item.label);
                  }}
                  name={item.label}
                  disabled={disabled}
                />
              }
              label={item.label}
            />
          );
        })}
      </RadioGroup>
    </StyledFormControl>
  );
};

export default CustRadioGroup;
