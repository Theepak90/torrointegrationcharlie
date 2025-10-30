/* third lib*/
import React, { useMemo } from 'react';
import styled from '@emotion/styled';

/* MUI */
import CloseIcon from '@mui/icons-material/Close';

/* local components & methods */
import TextBox from '@basics/TextBox';
import Select from '@basics/Select';
import Ueditor from './Ueditor';
import Schema from './Schema';
import CommonConditionHolder from '../CommonConditionHolder';
import CheckBoxGroup from '@basics/CheckBoxGroup';
import DatePicker from '@basics/DatePicker';
import Switch from '@basics/Switch';
import Text from '@basics/Text';
import { THEME } from '../../../../theme';

// Styled components
const ContentTitle = styled.div`
  color: ${THEME.colors.textGrey};
`;

const ChildItemList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConditionItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${THEME.spacing.space20};
`;

const ConditionValue = styled.div`
  flex: 1;
  position: relative;
`;

const ConditionLabel = styled.div`
  font-size: ${THEME.fontSizes.fontSize6};
  color: ${THEME.colors.mainPurple};
  margin: ${THEME.spacing.space4};
  margin-right: ${THEME.spacing.space8};
`;

const ConditionType = styled.div`
  margin: 0 ${THEME.spacing.space12};
  flex: 0.5;
`;

const DeleteIcon = styled.div`
  margin-left: ${THEME.spacing.space8};
  cursor: pointer;
`;

const Required = styled.span`
  color: ${THEME.colors.mainRed};
  display: inline-block;
  margin-left: ${THEME.spacing.space4};
`;

const conditionTypeList = [
  { label: '=', value: '0' },
  { label: '!=', value: '1' },
  { label: '>=', value: '2' },
  { label: '<=', value: '3' },
];

const FormCondition = ({
  index,
  item,
  onChange,
  currentData,
  options,
  formFieldOptions,
}) => {
  return (
    <>
      <ConditionLabel>{item.label}</ConditionLabel>
      <ConditionType>
        <Select
          value={item.conditionType}
          options={conditionTypeList}
          onChange={value => {
            let tmpData = {
              ...currentData,
            };
            tmpData.condition[index].conditionType = value;
            onChange(tmpData);
          }}
        />
      </ConditionType>
      <ConditionValue>
        {item.style === 1 && (
          <CheckBoxGroup
            value={item.value}
            options={item.options}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          />
        )}
        {item.style === 2 && (
          <Select
            value={item.value}
            options={options}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          ></Select>
        )}
        {item.style === 3 && (
          <TextBox
            id={item.id}
            name={item.label}
            value={item.value}
            placeholder={item.placeholder}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          />
        )}

        {item.style === 5 && (
          <Switch
            value={item.value}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          />
        )}

        {item.style === 6 && (
          <DatePicker
            value={item.value}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          />
        )}
      </ConditionValue>
    </>
  );
};

const ApprovalCondition = ({
  index,
  item,
  onChange,
  currentData,
  options,
  formFieldOptions,
}) => {
  return (
    <>
      <ConditionLabel>
        <Text type='regular'>Approver{index + 1}:</Text>
      </ConditionLabel>

      <ConditionValue>
        <Text type='regular'>{item.label}</Text>
      </ConditionValue>
    </>
  );
};

const CommonCondition = ({
  index,
  item,
  onChange,
  currentData,
  options,
  formFieldOptions,
}) => {
  return (
    <>
      <ConditionLabel title={item.des}>
        {item.label}:{!item.optional && <Required>*</Required>}
      </ConditionLabel>
      <ConditionValue>
        {item.style === 1 && (
          <TextBox
            id={item.id}
            name={item.label}
            value={item.value}
            placeholder={item.placeholder || ''}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          />
        )}
        {item.style === 2 && (
          <Select
            value={item.value}
            options={options}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          />
        )}
        {item.style === 3 && (
          <Ueditor
            value={item.value}
            options={formFieldOptions}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          />
        )}

        {item.style === 4 && (
          <Schema
            value={item.value}
            options={options}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          />
        )}

        {item.style === 5 && (
          <Select
            value={item.value}
            options={formFieldOptions}
            onChange={value => {
              let tmpData = {
                ...currentData,
              };
              tmpData.condition[index].value = value;
              onChange(tmpData);
            }}
          />
        )}
      </ConditionValue>
    </>
  );
};

const ConditionItem = ({
  currentData,
  onChange,
  formFieldOptions,
  editFlow,
  flowIndex,
}) => {
  const Condition = useMemo(() => {
    switch (currentData.flowType) {
      case 'Trigger':
        return FormCondition;
      case 'Approval':
        return ApprovalCondition;
      case 'GoogleCloud':
        return CommonCondition;
      case 'System':
        return CommonCondition;
      default:
        return () => {
          return <></>;
        };
    }
  }, [currentData]);

  const enableCc = useMemo(() => {
    return (
      currentData.flowType === 'Trigger' || currentData.flowType === 'Approval'
    );
  }, [currentData.flowType]);

  const ccTitle = useMemo(() => {
    return currentData.flowType === 'Approval' ? 'Drop approver here' : null;
  }, [currentData.flowType]);

  return (
    <>
      {currentData.condition && (
        <div>
          <ContentTitle>Condition:</ContentTitle>
          <ChildItemList>
            {currentData.condition.map((item, index) => {
              let options = item.options || [];
              return (
                <ConditionItemContainer key={index}>
                  <Condition
                    index={index}
                    item={item}
                    onChange={data => {
                      onChange(data);
                    }}
                    currentData={currentData}
                    options={options}
                    formFieldOptions={formFieldOptions}
                  />
                  {enableCc && (
                    <DeleteIcon>
                      <CloseIcon
                        onClick={() => {
                          let tmpData = {
                            ...currentData,
                          };
                          tmpData.condition.splice(index, 1);
                          onChange(tmpData);
                        }}
                      />
                    </DeleteIcon>
                  )}
                </ConditionItemContainer>
              );
            })}
          </ChildItemList>
          {enableCc && (
            <CommonConditionHolder
              droppable={editFlow}
              index={flowIndex}
              title={ccTitle}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ConditionItem;
