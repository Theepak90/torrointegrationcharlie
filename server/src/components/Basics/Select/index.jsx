/* third lib */
import React from 'react';
import styled from '@emotion/styled';

/* MUI */
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

// 从theme.js中导入全局变量
import { SPACING } from '../../theme';

// 使用@emotion/styled创建样式组件
const StyledMenuItem = styled(MenuItem)`
  padding: ${SPACING.space8} ${SPACING.space16} !important;
`;

const SelectC = ({
  value,
  options,
  onChange,
  inputProps,
  disableFullwidth,
  disabled,
  error,
  maxHeight,
  className,
}) => {
  return (
    <Select
      value={value}
      onChange={e => {
        onChange(e.target.value);
      }}
      className={className}
      error={error}
      variant='filled'
      inputProps={inputProps}
      disableUnderline
      disabled={disabled}
      displayEmpty
      fullWidth={!disableFullwidth}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
        MenuListProps: {
          style: { maxHeight: maxHeight },
        },
      }}
    >
      <MenuItem value='' disabled>
        <em>None</em>
      </MenuItem>
      {options &&
        options.length &&
        options.map((item, index) => {
          return (
            <StyledMenuItem
              key={item.value + item.label + index}
              value={item.value}
            >
              {item.label}
            </StyledMenuItem>
          );
        })}
    </Select>
  );
};

export default SelectC;
