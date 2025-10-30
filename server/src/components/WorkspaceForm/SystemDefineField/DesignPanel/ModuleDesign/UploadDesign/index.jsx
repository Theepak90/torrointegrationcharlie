/* third lib*/
import React from 'react';
import { FormattedMessage as Intl } from 'react-intl';

/* material-ui */
import Checkbox from '@mui/material/Checkbox';

/* local components & methods */
import Text from '@basics/Text';
import { ModuleEdit, EditItem, Label, EditInput } from '../sharedStyles';
import Input from '@mui/material/Input';

const UploadDesign = ({ data, onChange }) => {
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
            <Intl id='multiple' />:
          </Text>
        </Label>
        <Checkbox
          checked={data.multiple || false}
          onChange={() => {
            onChange({
              ...data,
              multiple: !data.multiple,
            });
          }}
        />
      </EditItem>
    </ModuleEdit>
  );
};

export default UploadDesign;
