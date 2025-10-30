/* third lib */
import React, { useEffect, useMemo, useState } from 'react';

/* material-ui */
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';

/* local components & methods */
import styled from '@emotion/styled';
import FilterIcon from '@assets/icons/FilterIcon';
import { startsWith } from 'lodash';

// Import theme variables
import { COLORS, SPACING, SHADOWS } from '../theme';

// Create styled components
const FilterPaper = styled(Paper)`
  display: flex;
  align-items: center;
  position: relative;
  width: 22rem;
  height: 3rem;
  box-shadow: ${SHADOWS.cardShadow};
`;

const ListPaper = styled(Paper)`
  width: 22rem;
`;

const Filter = ({ id, value, options, onChange }) => {
  const [current, setCurrent] = useState(value);
  const [inputVal, setInputVal] = useState('');

  const currentOption = useMemo(() => {
    let preList = [...options];
    if (inputVal) {
      preList = preList.filter(option => {
        return startsWith(
          String(inputVal).toLowerCase(),
          String(option.label).toLowerCase()
        );
      });
    }
    return preList;
  }, [inputVal, options]);

  const handleInputChange = event => {
    setInputVal(event.target.value);
  };
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleClick = event => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const selectHandle = option => {
    setInputVal(option.label);
    onChange(option.value);
    setOpen(false);
  };

  useEffect(() => {
    let currentOption = options.find(item => item.value === value);
    setInputVal(currentOption ? currentOption.label : '');
    setCurrent(value);
  }, [value, options]);

  return (
    <FilterPaper id={id} ref={anchorRef} elevation={0}>
      <InputBase
        id='outlined-select-currency'
        value={inputVal}
        onChange={handleInputChange}
        fullWidth
        placeholder={'Filter'}
        startAdornment={
          <FilterIcon style={{ margin: `0 ${SPACING.space8}` }} />
        }
        onClick={handleClick}
        style={{ width: '100%' }}
      />
      <Popper
        placement='bottom'
        id='simple-menu'
        anchorEl={anchorRef.current}
        open={open}
      >
        <div style={{ width: '22rem' }}>
          <ListPaper elevation={2}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList value={current}>
                {currentOption.map(option => (
                  <MenuItem
                    onClick={() => {
                      selectHandle(option);
                    }}
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </ListPaper>
        </div>
      </Popper>
    </FilterPaper>
  );
};

export default Filter;
