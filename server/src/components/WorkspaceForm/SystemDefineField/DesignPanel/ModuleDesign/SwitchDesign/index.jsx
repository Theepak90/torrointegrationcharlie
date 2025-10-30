/* third lib*/
import React from 'react';
import { FormattedMessage as Intl } from 'react-intl';

/* MUI */
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';

/* local components & methods */
import Text from '@basics/Text';
import { ModuleEdit, EditItem, Label, EditInput } from '../sharedStyles';

const SwitchDesign = ({ data, onChange }) => {
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
      <EditItem>
        <Label>
          <Text type='subTitle'>
            <Intl id='default' />:
          </Text>
        </Label>
        <Checkbox
          checked={data.default}
          onChange={() => {
            onChange({
              ...data,
              default: !data.default,
            });
          }}
        />
      </EditItem>
    </ModuleEdit>
  );
};

export default SwitchDesign;
