/* third lib */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

/* MUI */
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

// 从theme.js中导入全局变量
import { COLORS, SPACING } from '../../theme';

// 使用@emotion/styled创建样式组件
const SearchPaper = styled(Paper)`
  display: flex;
  align-items: center;
  width: 23.25rem;
  height: 3rem;

  &.fullWidth {
    width: 100%;
  }

  div[class*='Mui-focus'] {
    svg {
      color: ${COLORS.mainPurple};
    }
    input {
      color: ${COLORS.mainPurple};
    }
  }
`;

const SearchInput = styled(InputBase)`
  width: 100%;
  padding-right: ${SPACING.space20};
  box-sizing: border-box;
`;

const SearchIconButton = styled(IconButton)`
  padding: ${SPACING.space12} ${SPACING.space20};
`;

const Search = ({ value, onChange, handleSearch, fullWidth, placeholder }) => {
  return (
    <SearchPaper className={fullWidth ? 'fullWidth' : ''}>
      <SearchInput
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search google maps' }}
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
        startAdornment={
          <SearchIconButton
            type='submit'
            aria-label='search'
            onClick={handleSearch}
          >
            <SearchIcon />
          </SearchIconButton>
        }
      />
    </SearchPaper>
  );
};

Search.propTypes = {
  onChange: PropTypes.func,
};

export default Search;
