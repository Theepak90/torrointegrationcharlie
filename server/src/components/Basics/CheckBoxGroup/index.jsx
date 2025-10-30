/* third lib */
import React, { useState, useMemo, useCallback } from 'react';
import cn from 'classnames';
import styled from '@emotion/styled';

/* MUI */
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';

// 从theme.js中导入全局变量
import { COLORS, SPACING } from '../../theme';

// 使用@emotion/styled创建样式组件
const FilterBox = styled.div`
  padding: ${SPACING.space8} 0;
  margin: 0 ${SPACING.space16};
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${COLORS.mainPurple};

  svg {
    margin-left: ${SPACING.space8};
  }
`;

const FilterInput = styled(InputBase)`
  margin-left: ${SPACING.space4};
`;

const StyledCheckbox = styled(Checkbox)`
  padding: ${SPACING.space4} !important;
  margin-right: ${SPACING.space4} !important;

  &.checked {
    svg {
      color: ${COLORS.mainPurple};
    }
  }
`;

const CheckBoxGroup = ({
  value,
  options,
  onChange,
  inputProps,
  disableFullwidth,
  disabled,
  error,
}) => {
  const [filterVal, setFilterVal] = useState('');

  const currentOptions = useMemo(() => {
    return options.map(item => {
      return { label: item.label, value: item.label };
    });
  }, [options]);

  const valueList = useMemo(() => {
    return value ? value.split(',') : [];
  }, [value]);

  const filterOptions = useMemo(() => {
    if (filterVal) {
      return currentOptions.filter(option => {
        return new RegExp(
          filterVal.replace(/[()[\]{}?*+\\/]/g, '\\$&'),
          'i'
        ).test(option.label);
      });
    } else {
      return currentOptions;
    }
  }, [filterVal, currentOptions]);

  const closePopupHandle = useCallback(e => {
    setFilterVal('');
  }, []);

  const stopPropagation = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <Select
      value={valueList}
      onChange={e => {
        onChange(e.target.value.join(','));
      }}
      multiple
      renderValue={selected => selected.join(',')}
      error={error}
      variant='filled'
      inputProps={inputProps}
      onClose={closePopupHandle}
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
      }}
    >
      <FilterBox>
        <SearchIcon />
        <FilterInput
          value={filterVal}
          onKeyDown={stopPropagation}
          onClick={stopPropagation}
          onChange={e => {
            e.stopPropagation();
            setFilterVal(e.target.value);
          }}
          fullWidth
          placeholder='Search your option'
        />
      </FilterBox>

      {filterOptions &&
        filterOptions.length &&
        filterOptions.map((item, index) => {
          return (
            <MenuItem key={item.value + item.label + index} value={item.value}>
              <StyledCheckbox
                className={cn({ checked: valueList.includes(item.value) })}
                checked={valueList.includes(item.value)}
              />
              {item.label}
            </MenuItem>
          );
        })}
    </Select>
  );
};

export default CheckBoxGroup;
