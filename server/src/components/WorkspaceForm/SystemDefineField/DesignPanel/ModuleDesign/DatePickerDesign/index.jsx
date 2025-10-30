/* third lib*/
import React from 'react';
import { FormattedMessage as Intl } from 'react-intl';

/* material-ui */
import Input from '@mui/material/Input';

/* local components & methods */
import Text from '@basics/Text';
import { ModuleEdit, EditItem, Label, EditInput } from '../sharedStyles';

const DatePickerDesign = ({ data, onChange }) => {
  return (
    <ModuleEdit>
      <div className='title'>
        <Text type='subTitle'>
          <Intl id='advanceOptions' />
        </Text>
      </div>
      <EditItem>
        <Label>
          <Text type='subTitle'>
            <Intl id='label' />:
          </Text>
        </Label>
        <EditInput>
          <Input
            value={data.label}
            disableUnderline
            variant='outlined'
            onChange={e => {
              onChange({
                ...data,
                label: e.target.value,
              });
            }}
          />
        </EditInput>
      </EditItem>
    </ModuleEdit>
  );
};

export default DatePickerDesign;
