/* third lib*/
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import { useForm } from 'react-hook-form';
import Scrollbar from 'react-perfect-scrollbar';
import cn from 'classnames';
import styled from '@emotion/styled';

/* material-ui */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/* local components & methods */

import Button from '@basics/Button';
import FormItem from '@comp/FormItem';
import CheckBoxIcon from '@assets/icons/moduleIcon/CheckBoxIcon';
import DropdownIcon from '@assets/icons/moduleIcon/DropdownIcon';
import TextIcon from '@assets/icons/moduleIcon/TextIcon';
import UploadIcon from '@assets/icons/moduleIcon/UploadIcon';
import ToggleIcon from '@assets/icons/moduleIcon/ToggleIcon';
import DatePickerIcon from '@assets/icons/moduleIcon/DatePickerIcon';
import { THEME } from '@comp/theme';
import {} from '@lib/api';
import DesignPanel from './DesignPanel';
import Text from '@basics/Text';
import HeadLine from '@basics/HeadLine';

const moduleTypeList = [
  { style: 1, icon: CheckBoxIcon, cls: 'checkbox', temp: 'text' },
  { style: 2, icon: DropdownIcon, cls: 'dropdown' },
  { style: 3, icon: TextIcon, cls: 'text' },
  { style: 4, icon: UploadIcon, cls: 'upload' },
  { style: 5, icon: ToggleIcon, cls: 'switch' },
  { style: 6, icon: DatePickerIcon, cls: 'datepicker' },
];

const styleMap = {
  1: 'Checkbox',
  2: 'Dropdown',
  3: 'Text',
  4: 'Upload',
  5: 'Toggle',
  6: 'Datepicker',
};

// Styled Components
const SystemDefineFieldContainer = styled.div`
  display: flex;
  height: 100%;
  background-color: ${THEME.colors.lightGrey};
`;

const OnBack = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${THEME.colors.mainPurple};
  margin: ${THEME.spacing.space16} 0;

  svg {
    margin-right: ${THEME.spacing.space12};
  }
`;

const ModuleType = styled.div`
  display: flex;
  align-items: center;
  height: 3.75rem;
  margin: ${THEME.spacing.space12} 0 0 ${THEME.spacing.space8};
`;

const ModuleIcon = styled.div`
  color: ${THEME.colors.textGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: ${THEME.spacing.space40};

  svg {
    width: 24px;
    height: 24px;
  }

  .checkbox {
    width: 18px;
    height: 18px;
  }
  .dropdown {
    width: 32px;
    height: 32px;
  }
  &.switch {
    width: 26px;
    height: 14px;
  }

  &.active {
    color: ${THEME.colors.mainPurple};
  }
`;

const Content = styled.div`
  position: relative;
  background-color: ${THEME.colors.white};
  flex: 1;
  box-shadow: ${THEME.shadows.paperShadow};

  .formTitle {
    font-weight: bold;
    font-size: ${THEME.fontSizes.fontSize1};
    color: ${THEME.colors.darkPurple};
    font-family: Comfortaa;
  }
`;

const DefineView = styled.div`
  width: 100%;
  padding: ${THEME.spacing.space20} ${THEME.spacing.space20}
    ${THEME.spacing.space20};
  position: relative;
  min-height: 100%;
`;

const ItemList = styled.div`
  margin-bottom: 3.75rem;
`;

const ItemType = styled.div`
  width: 100%;
  margin-bottom: ${THEME.spacing.space20};
`;

const ItemTypeTitle = styled.div`
  color: ${THEME.colors.mainPurple};
  margin: ${THEME.spacing.space24} 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddFields = styled.div`
  display: inline-block;
  text-align: center;
  padding: 0.5rem;
  min-width: unset;
  height: auto;
  border-width: 1px;
  background-color: ${THEME.colors.mainPurple};
  color: ${THEME.colors.white};
  border-radius: 4px;
  cursor: pointer;

  svg {
    margin-right: 8px;
  }
`;

const Items = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: ${THEME.spacing.space20};
  right: ${THEME.spacing.space20};
`;

const SystemDefineField = ({
  cancelHandle,
  fieldTemplate,
  systemDefineField,
  onChange,
}) => {
  const { control } = useForm(); // initialise the hook
  const [defineData, setDefineData] = useState(systemDefineField);
  const [editData, setEditData] = useState(null);
  const [currentStyle, setCurrentStyle] = useState(1);

  const LatestId = useMemo(() => {
    let maxId = 0;
    Object.keys(defineData).forEach(key => {
      let fieldList = defineData[key];
      fieldList.forEach(item => {
        let idI = Number(item.id.replace('s', ''));
        if (idI > maxId) maxId = idI;
      });
    });
    return maxId + 1;
  }, [defineData]);

  const fieldTemplateMap = useMemo(() => {
    let map = {};
    fieldTemplate.forEach(item => {
      map[item.style] = {
        ...item.default,
        id: `s${LatestId}`,
        label: `System field${LatestId}`,
      };
    });
    return map;
  }, [fieldTemplate, LatestId]);

  const currentModule = useMemo(() => {
    if (!editData) {
      return null;
    }
    return defineData[editData.style][editData.index];
  }, [editData, defineData]);

  const deleteHandle = index => {
    let tmpData = JSON.parse(JSON.stringify(defineData));
    tmpData[currentStyle].splice(index, 1);
    setDefineData(tmpData);
  };

  const renderFormItem = items => {
    return items.map((item, index) => {
      return (
        <FormItem
          key={index}
          data={item}
          index={index}
          onChange={() => {}}
          onDelete={() => {
            deleteHandle(index);
          }}
          editState={
            editData
              ? editData.index === index && editData.style === item.style
              : false
          }
          onEdit={key => {
            if (key) {
              setEditData({
                style: item.style,
                index: index,
              });
            } else {
              setEditData(null);
            }
          }}
          enableEdit={true}
          control={control}
        />
      );
    });
  };

  const currentList = useMemo(() => {
    return defineData[currentStyle];
  }, [defineData, currentStyle]);

  const clickAwayHandle = e => {
    setEditData(null);
  };

  useEffect(() => {
    setDefineData({
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      ...systemDefineField,
    });
  }, [systemDefineField]);

  return (
    <SystemDefineFieldContainer>
      <Content onClick={clickAwayHandle}>
        <Scrollbar>
          <DefineView>
            <OnBack
              onClick={() => {
                cancelHandle();
              }}
            >
              <ArrowBackIcon />
              <Text type='subTitle'>
                <Intl id='back' />
              </Text>
            </OnBack>
            <ModuleType>
              {moduleTypeList.map(item => {
                let Icon = item.icon;
                return (
                  <ModuleIcon
                    key={item.style}
                    className={cn(item.cls, {
                      active: item.style === currentStyle,
                    })}
                    onClick={() => {
                      setCurrentStyle(item.style);
                    }}
                  >
                    <Icon className={item.cls} />
                  </ModuleIcon>
                );
              })}
            </ModuleType>
            <ItemList>
              <ItemType>
                <ItemTypeTitle>
                  <HeadLine>{styleMap[currentStyle]}</HeadLine>
                  <AddFields
                    onClick={e => {
                      let tmp = { ...defineData };
                      tmp[currentStyle].push(fieldTemplateMap[currentStyle]);
                      setDefineData(tmp);
                    }}
                  >
                    <Intl id='addField' />
                  </AddFields>
                </ItemTypeTitle>
                {currentList && (
                  <ItemList>
                    <Items>{renderFormItem(currentList)}</Items>
                  </ItemList>
                )}
              </ItemType>
            </ItemList>
            <ButtonWrapper>
              <Button
                variant='contained'
                onClick={() => {
                  onChange(defineData);
                }}
              >
                <Intl id='save' />
              </Button>
            </ButtonWrapper>
          </DefineView>
        </Scrollbar>
      </Content>
      <DesignPanel
        id='designPanel'
        currentModule={currentModule}
        onChange={data => {
          let tmp = { ...defineData };
          tmp[editData.style][editData.index] = data;
          setDefineData(tmp);
        }}
      />
    </SystemDefineFieldContainer>
  );
};

export default SystemDefineField;
