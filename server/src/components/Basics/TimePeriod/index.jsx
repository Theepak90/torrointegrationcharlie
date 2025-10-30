/* third lib */
import React from 'react';
import styled from '@emotion/styled';

/* material-ui */
import DatePicker from '@basics/DatePicker';

// Import global variables from theme.js
import { SPACING, COLORS } from '../../theme';

// Create styled component using @emotion/styled
const TimePeriodContainer = styled.div`
  margin-bottom: ${SPACING.space12};

  .label {
    color: ${COLORS.mainPurple};
    margin-bottom: ${SPACING.space8};
  }

  .detail {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sep {
      margin: 0 ${SPACING.space8};
    }
  }
`;

const TimePeriod = ({ value, id, onChange }) => {
  let from = '';
  let to = '';
  let timeValue = value ? value : [];
  let fromIndex, toIndex;

  timeValue.forEach((time, index) => {
    if (time[1] === '>') {
      from = time[0];
      fromIndex = index;
    }
    if (time[1] === '<') {
      to = time[0];
      toIndex = index;
    }
  });

  return (
    <TimePeriodContainer>
      <div className='detail'>
        <DatePicker
          value={from}
          onChange={value => {
            if (timeValue[fromIndex]) {
              timeValue[fromIndex][0] = value;
            } else {
              timeValue.push([value, '>']);
            }

            onChange([...timeValue]);
          }}
        />
        <div className='sep'>-</div>
        <DatePicker
          value={to}
          onChange={value => {
            if (timeValue[toIndex]) {
              timeValue[toIndex][0] = value;
            } else {
              timeValue.push([value, '<']);
            }
            onChange([...timeValue]);
          }}
        />
      </div>
    </TimePeriodContainer>
  );
};

export default TimePeriod;
