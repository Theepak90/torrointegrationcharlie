/* third lib*/
import React from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import cn from 'classnames';

/* material-ui */
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';

/* local components & methods */
import Text from '@basics/Text';
import KeyPairGroup from '@basics/KeyPairGroup';
import styled from '@emotion/styled';
import { SPACING, COLORS } from '@comp/theme';

const ModuleEdit = styled.div({
  marginTop: SPACING.space40,
  '& .title': {
    textAlign: 'center',
    color: COLORS.mainPurple,
    marginBottom: SPACING.space40,
  },
});

const EditItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  margin: `${SPACING.space20} 0`,
  '& svg': {
    color: COLORS.mainPurple,
  },
});

const Label = styled.div({
  color: COLORS.textGrey,
  marginRight: '1rem',
  textAlign: 'right',
});

const EditInput = styled.div({
  flex: 1,
  '& input': {
    border: `1px solid ${COLORS.textGrey}`,
    padding: '0.5rem 1rem',
    height: '1.5rem',
    borderRadius: '4px',
    '&:focus, &:active': {
      borderColor: COLORS.mainPurple,
    },
  },
});

const ColumnItem = styled(EditItem)({
  flexDirection: 'column',
  alignItems: 'start',
  '& .label': {
    marginBottom: SPACING.space20,
  },
});

const DropdownDesign = ({ data, onChange, systemCopy }) => {
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
      {!systemCopy && (
        <>
          <EditItem>
            <Label>
              <Text type='subTitle'>
                <Intl id='des' />:
              </Text>
            </Label>
            <EditInput>
              <Input
                value={data.des}
                disableUnderline
                variant='outlined'
                onChange={e => {
                  onChange({
                    ...data,
                    des: e.target.value,
                  });
                }}
              />
            </EditInput>
          </EditItem>
          <EditItem>
            <Label>
              <Text type='subTitle'>
                <Intl id='required' />:
              </Text>
            </Label>
            <Checkbox
              checked={data.required}
              onChange={e => {
                onChange({
                  ...data,
                  required: !data.required,
                });
              }}
            />
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
        </>
      )}
    </ModuleEdit>
  );
};

export default DropdownDesign;
