/* third lib*/
import React from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import cn from 'classnames';

/* material-ui */
import Input from '@mui/material/Input';

/* local components & methods */
import Text from '@basics/Text';
import {
  ModuleEdit,
  EditItem,
  Label,
  EditInput,
  ColumnItem,
} from '../sharedStyles';
import KeyPairGroup from '@basics/KeyPairGroup';

const DropdownDesign = ({ data, onChange }) => {
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
            <Intl id='defaultvalue' />:
          </Text>
        </Label>
        <EditInput>
          <Input
            value={data.default}
            disableUnderline
            variant='outlined'
            onChange={e => {
              onChange({
                ...data,
                default: e.target.value,
              });
            }}
          />
        </EditInput>
      </EditItem>
      <ColumnItem>
        <Label>
          <Text type='subTitle'>
            <Intl id='options' />:
          </Text>
        </Label>

        <KeyPairGroup
          options={data.options}
          onChange={options => {
            onChange({
              ...data,
              options: options,
            });
          }}
        />
      </ColumnItem>
    </ModuleEdit>
  );
};

export default DropdownDesign;
