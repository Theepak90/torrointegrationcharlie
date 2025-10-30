/* third lib*/
import React, { useCallback, useMemo } from 'react';
import cn from 'classnames';
import { Controller } from 'react-hook-form';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui */
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Close';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import FileCopyIcon from '@mui/icons-material/FileCopy';

/* local components & methods */
import Text from '@basics/Text';
import FileUpload from '@basics/FileUpload';
import DatePicker from '@basics/DatePicker';
import TextBox from '@basics/TextBox';
import Select from '@basics/Select';
import Switch from '@basics/Switch';
import PolicyTags from '@comp/PolicyTags';
import CheckBoxGroup from '@basics/CheckBoxGroup';
import RadioGroup from '@basics/RadioGroup';
import TimePeriod from '@basics/TimePeriod';
import DepartmentSelect from '@basics/DepartmentSelect';
import { THEME } from '../theme';

// Styled components
const FormItemContainer = styled.div`
  width: calc(33.3%);
  position: relative;
  box-sizing: border-box;
  border: 1px solid transparent;
  overflow: hidden;

  &.fullWidth {
    width: 100% !important;

    .formControl {
      padding: ${THEME.spacing.space16} 0;
    }
  }

  &:hover {
    .operation {
      display: flex !important;
    }
  }

  &.edit {
    border: 1px dashed ${THEME.colors.mainPurple} !important;
    border-radius: 4px;
    background-color: rgba(143, 160, 245, 0.05);

    .operation {
      display: flex !important;
    }
  }

  &.flex-basis {
    flex-basis: 100%;
  }
`;

const FormControl = styled.div`
  width: 100%;
  padding: ${THEME.spacing.space16};
  box-sizing: border-box;
  color: ${THEME.colors.mainPurple};

  .label {
    display: inline-block;
    margin-bottom: ${THEME.spacing.space16};
    color: ${THEME.colors.mainPurple};
  }
`;

const OperationContainer = styled.div`
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
  top: 1rem;
  right: 1rem;
  gap: 0.5rem;

  svg {
    color: ${THEME.colors.textGrey};
    cursor: pointer;
    width: 1.2rem;
    height: 1.2rem;

    &:hover {
      color: ${THEME.colors.mainPurple};
    }
  }
`;

const AddFieldsButton = styled.div`
  border: 1px solid ${THEME.colors.mainPurple};
  border-radius: 4px;
  width: 100%;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${THEME.colors.mainPurple};
  margin-top: ${THEME.spacing.space24};
  cursor: pointer;

  svg {
    margin-right: 8px;
  }
`;

const FormItem = ({
  data,
  index,
  onDelete,
  onEdit,
  onCopy,
  onUp,
  onDown,
  control,
  editState,
  enableEdit,
  register,
  disabled,
  systemTag,
  fullWidth,
  changeCb,
  specialField,
}) => {
  const FormComponent = useMemo(() => {
    let type = Number(data.style);
    switch (type) {
      case 1:
        return CheckBoxGroup;
      case 2:
        return Select;
      case 4:
        return FileUpload;
      case 5:
        return Switch;
      case 6:
        return DatePicker;
      case 7:
        return PolicyTags;
      case 8:
        return RadioGroup;
      case 9:
        return TimePeriod;
      case 10:
        return DepartmentSelect;
      default:
        return TextBox;
    }
  }, [data]);

  const dataProps = useMemo(() => {
    let type = Number(data.style);
    let name = `prop${data.id}`;
    switch (type) {
      case 1:
        return {
          options: data.options,
        };
      case 2:
        return {
          options: data.options,
        };
      case 4:
        return {
          ref: register,
          id: name,
          name: name,
          multiple: data.multiple ?? true,
          placeholder: data.placeholder,
          fileTemplate: data.fileTemplate,
        };
      case 5:
        return {};
      case 6:
        return {};
      case 8:
        return {
          options: data.options,
        };
      case 10:
        return {
          departments: data.departments || [],
        };
      default:
        return {
          id: name,
          name: name,
          placeholder: data.placeholder,
          type: 'text',
        };
    }
  }, [data, register]);

  const preFix = useCallback(style => {
    switch (style) {
      case 2:
        return 'selectEmpty';
      case 6:
        return 'dateEmpty';
      case 10:
        return 'selectEmpty';
      default:
        return 'textEmptpy';
    }
  }, []);

  const defaultValue = useMemo(() => {
    let type = Number(data.style);
    switch (type) {
      case 1:
        return data.default ? data.default : '';
      case 5:
        return data.default ? data.default : 'false';
      case 6:
        return data.default ? new Date(data.default) : new Date();
      default:
        return data.default || '';
    }
  }, [data]);

  const pattern = useMemo(() => {
    switch (data.rule) {
      case 1: {
        return {
          value:
            /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
          message: 'Invalid amount, please check.',
        };
      }
      case 2:
        /* eslint-disable */
        return {
          value:
            /^([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i,
          message: 'Please input correct email',
        };
      /* eslint-disable */

      case 3:
        return {
          value:
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          message: 'Please input correct phone number',
        };
      default:
        return { value: false };
    }
  }, [data.rule]);

  const maxLength = useMemo(() => {
    return {
      value: data.maxLength,
      message: `Please limit your input in ${data.maxLength} letters`,
    };
  }, [data.maxLength]);

  const dataRequired = useMemo(() => {
    return (
      data.required ||
      /^[s][0-9]+$/.test(data?.id) ||
      /^[d][0-9]+$/.test(data?.id) ||
      /^[d][0-9]+$/.test(String(data?.point_id)) ||
      /^[d][0-9]+$/.test(String(data?.point_id)) ||
      specialField?.includes(data?.id)
    );
  }, [data, specialField]);

  return (
    <FormItemContainer
      key={data.id}
      className={cn({
        edit: editState,
        'flex-basis': data.style === 7,
        fullWidth: fullWidth,
      })}
      style={{ width: data.width + '%' }}
      onDoubleClick={() => {
        enableEdit && onEdit && onEdit(true);
      }}
    >
      <FormControl>
        <FormLabel
          style={{
            display: 'inline-block',
            marginBottom: THEME.spacing.space16,
            color: THEME.colors.mainPurple,
          }}
        >
          <Text type='subTitle' title={data.des}>
            {data.label}
            {systemTag && (
              <span
                style={{
                  color: THEME.colors.darkYellow,
                  marginLeft: THEME.spacing.space8,
                }}
              >
                (<Intl id='system' />)
              </span>
            )}
            {(String(data?.point_id)?.startsWith('s') ||
              String(data?.point_id)?.startsWith('d')) && (
              <span
                style={{
                  color: THEME.colors.darkYellow,
                  marginLeft: THEME.spacing.space8,
                }}
              >
                (<Intl id='copy' />)
              </span>
            )}
            {dataRequired && (
              <span
                style={{
                  color: THEME.colors.mainRed,
                  marginLeft: THEME.spacing.space4,
                }}
              >
                *
              </span>
            )}
          </Text>
        </FormLabel>
        <div>
          <Controller
            name={`${data.id}`}
            control={control}
            defaultValue={defaultValue}
            rules={{
              required: {
                value: dataRequired,
                message: (
                  <>
                    <Intl id={preFix(data.style)} />
                    {data.label}.
                  </>
                ),
              },
              maxLength: Number(data.style) === 3 ? maxLength : null,
              pattern: pattern,
            }}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => {
              // 处理组件的onChange事件
              const handleComponentChange = data => {
                if (changeCb) {
                  changeCb(data);
                }
                onChange(data);
              };

              // 为不同组件准备props，适配MUI 7
              const componentProps = {
                ...dataProps,
                value,
                onChange: handleComponentChange,
                disabled,
                error: invalid,
                name,
                maxLength: data.maxLength,
              };

              // 根据组件类型添加特定属性
              if (FormComponent === Switch) {
                // Switch组件特殊处理
                componentProps.checked = String(value) === 'true';
              } else if (data.rule === 1 || data.rule === 3) {
                // 数字输入框
                componentProps.type = 'number';
              }

              return (
                <>
                  <FormComponent {...componentProps} />
                  {invalid && (
                    <div
                      style={{
                        color: '#f44336',
                      }}
                    >
                      <FormHelperText>{error.message}</FormHelperText>
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
      </FormControl>
      {enableEdit && (
        <OperationContainer className='operation'>
          {!editState && (
            <>
              <Edit
                onClick={e => {
                  e.stopPropagation();
                  onEdit(true);
                }}
              />
              <Delete onClick={onDelete} />
              {onUp && <ArrowUpward onClick={onUp} />}
              {onDown && <ArrowDownward onClick={onDown} />}
              {onCopy && <FileCopyIcon onClick={onCopy} />}
            </>
          )}
          {editState && (
            <Delete
              onClick={e => {
                e.stopPropagation();
                onEdit(false);
              }}
            />
          )}
        </OperationContainer>
      )}
    </FormItemContainer>
  );
};

export default FormItem;
