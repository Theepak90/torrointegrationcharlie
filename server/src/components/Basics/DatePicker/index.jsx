/* third lib */
import React from 'react';
import dayjs from 'dayjs';
import styled from '@emotion/styled';

/* MUI */
import {
  LocalizationProvider,
  DatePicker as MuiDatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// 从theme.js中导入全局变量
import { COLORS } from '../../theme';

// 使用@emotion/styled创建样式组件
const DatePickerBox = styled.div`
  width: 100%;

  .datePicker {
    display: block;

    div[class*='MuiFilledInput-underline']:hover::before {
      border-width: 1px;
    }
  }

  div[class*='MuiPickersToolbar-toolbar'],
  button[class*='MuiPickersDay-daySelected'] {
    background-color: ${COLORS.mainPurple} !important;
    color: ${COLORS.white} !important;
  }

  button[class*='MuiPickersDay-current'] {
    color: ${COLORS.mainPurple};
  }
`;

const CustomDatePicker = ({ value, id, name, onChange, disabled }) => {
  // 将传入的值转换为Dayjs对象
  const formattedValue = value ? dayjs(value) : null;

  return (
    <DatePickerBox>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MuiDatePicker
          className='datePicker'
          name={name}
          format='MM/DD/YYYY'
          value={formattedValue}
          onChange={data => onChange(data?.format('YYYY-MM-DD'))}
          id={id}
          disabled={disabled}
          renderInput={params => (
            <input
              {...params.inputProps}
              fullWidth
              disabled={disabled}
              className='MuiFilledInput-input'
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '8px',
                fontFamily: 'inherit',
              }}
            />
          )}
        />
      </LocalizationProvider>
    </DatePickerBox>
  );
};

export default CustomDatePicker;
