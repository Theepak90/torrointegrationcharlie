/* third lib*/
import React, { useMemo } from 'react';
import styled from '@emotion/styled';

/* MUI */
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Input from '@mui/material/Input';

// 从theme.js中导入全局变量
import { COLORS, SPACING } from '../../theme';

// 使用@emotion/styled创建样式组件
const KeyPairGroupContainer = styled.div`
  /* 容器样式 */
`;

const KeyPairItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${SPACING.space20};
`;

const StyledInput = styled(Input)`
  flex: 1;

  input {
    border: 1px solid ${COLORS.textGrey};
    padding: 0.5rem 1rem;
    height: 1.5rem;
    border-radius: 4px;

    &:focus,
    &:active {
      border-color: ${COLORS.mainPurple};
    }
  }
`;

const Separator = styled.div`
  margin: 0 ${SPACING.space8};
`;

const OperationContainer = styled.div`
  margin-left: ${SPACING.space8};
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  color: ${COLORS.textGrey};
  cursor: pointer;
`;

const KeyPairGroup = ({ options, onChange }) => {
  let maxId = useMemo(() => {
    return options.length + 1;
  }, [options]);

  const optionsChange = (value, index, label) => {
    let tmpOptions = JSON.parse(JSON.stringify(options));
    label
      ? (tmpOptions[index].label = value)
      : (tmpOptions[index].value = value);

    onChange(tmpOptions);
  };

  const addItem = index => {
    let tmpOptions = JSON.parse(JSON.stringify(options));
    tmpOptions.splice(index + 1, 0, {
      label: 'Options' + maxId,
      value: 'Options' + maxId,
    });
    onChange(tmpOptions);
  };

  const deleteItem = index => {
    let tmpOptions = JSON.parse(JSON.stringify(options));
    tmpOptions.splice(index, 1);
    onChange(tmpOptions);
  };
  return (
    <KeyPairGroupContainer>
      {options.map((item, index) => {
        return (
          <KeyPairItem key={index}>
            <StyledInput
              value={item.label}
              disableUnderline
              variant='outlined'
              onChange={e => {
                optionsChange(e.target.value, index, true);
              }}
            />
            <Separator>-</Separator>
            <StyledInput
              value={item.value}
              disableUnderline
              variant='outlined'
              onChange={e => {
                optionsChange(e.target.value, index, false);
              }}
            />
            <OperationContainer>
              {options.length > 1 && (
                <IconContainer
                  onClick={() => {
                    deleteItem(index);
                  }}
                >
                  <RemoveCircleOutlineIcon />
                </IconContainer>
              )}
              <IconContainer
                onClick={() => {
                  addItem(index);
                }}
              >
                <AddCircleOutlineIcon />
              </IconContainer>
            </OperationContainer>
          </KeyPairItem>
        );
      })}
    </KeyPairGroupContainer>
  );
};

export default KeyPairGroup;
