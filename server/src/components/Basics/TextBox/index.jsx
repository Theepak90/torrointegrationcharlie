/* third lib*/
import React from 'react';
import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import { COLORS } from '../../theme';

// Create styled text box container using @emotion/styled
const StyledTextBoxContainer = styled.div`
  .MuiFilledInput-multiline {
    padding: 12px 10px;
  }

  /* Add more styles as needed */
`;

const TextBox = ({
  id,
  name,
  onChange,
  value,
  type,
  placeholder,
  autoFocus,
  disabled,
  multiline,
  inputRef,
  maxLength,
  rows,
  error,
  ...props
}) => {
  let textType = type || 'text';
  return (
    <StyledTextBoxContainer>
      <TextField
        id={id}
        name={name}
        value={value}
        inputProps={{ maxLength: maxLength }}
        onChange={e => {
          onChange(e.target.value);
        }}
        variant='filled'
        fullWidth
        placeholder={placeholder}
        type={textType}
        autoFocus={autoFocus}
        disabled={disabled}
        multiline={multiline}
        rows={rows}
        error={error}
        inputRef={inputRef}
        {...props}
      />
    </StyledTextBoxContainer>
  );
};

export default TextBox;
