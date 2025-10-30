/* third lib*/
import React from 'react';
import styled from '@emotion/styled';
import { Controller } from 'react-hook-form';

/* MUI */
import TextBox from '@basics/TextBox';
import FormLabel from '@mui/material/FormLabel';

/* local components */
import Text from '@basics/Text';
import { COLORS, SPACING } from '../../theme';

// Styled components for complex styles
const TextInput = styled.div`
  & .MuiFilledInput-input {
    color: ${COLORS.color12};
  }
`;

const UserInput = ({
  id,
  name,
  control,
  label,
  type,
  placeholder,
  autoFocus,
}) => {
  let textId = id;
  let textLabel = label;
  let defaultValue = '';
  let textName = name;
  let textPlaceholder = placeholder || placeholder;
  let textType = type || 'text';

  return (
    <div style={{ color: COLORS.mainPurple }}>
      <FormLabel
        style={{
          display: 'inline-block',
          marginBottom: SPACING.space16,
          color: COLORS.mainPurple,
        }}
      >
        <Text type='subTitle'>{textLabel}</Text>
      </FormLabel>
      <TextInput>
        <Controller
          name={textName}
          control={control}
          defaultValue={defaultValue}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => (
            <TextBox
              id={textId}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={textPlaceholder}
              type={textType}
              autoFocus={autoFocus}
            />
          )}
        />
      </TextInput>
    </div>
  );
};

export default UserInput;
