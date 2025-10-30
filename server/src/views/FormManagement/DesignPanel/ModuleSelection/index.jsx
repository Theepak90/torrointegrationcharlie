/* third lib*/
import React, { useMemo } from 'react';
import cn from 'classnames';
import { FormattedMessage as Intl } from 'react-intl';

/* local components & methods */
import Collapse from '@basics/Collapse';
import Text from '@basics/Text';
import CheckBoxIcon from '@assets/icons/moduleIcon/CheckBoxIcon';
import DropdownIcon from '@assets/icons/moduleIcon/DropdownIcon';
import TextIcon from '@assets/icons/moduleIcon/TextIcon';
import UploadIcon from '@assets/icons/moduleIcon/UploadIcon';
import ToggleIcon from '@assets/icons/moduleIcon/ToggleIcon';
import DatePickerIcon from '@assets/icons/moduleIcon/DatePickerIcon';
import styled from '@emotion/styled';
import { SPACING, COLORS } from '@comp/theme';

const DesignerTitle = styled.div({
  marginTop: '3.125rem',
  color: COLORS.textGrey,
  marginLeft: SPACING.space40,
});

const Title = styled.div({
  textAlign: 'center',
  color: COLORS.mainPurple,
  marginTop: SPACING.space8,
});

const WorkflowOptionsType = styled.div({
  padding: SPACING.space40,
});

const ModuleType = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '3.75rem',
  marginTop: SPACING.space12,
  padding: `0 ${SPACING.space40}`,
});

const ModuleIcon = styled.div({
  color: COLORS.textGrey,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '& svg': {
    width: '24px',
    height: '24px',
  },
  '& .checkbox': {
    width: '18px',
    height: '18px',
  },
  '& .dropdown': {
    width: '32px',
    height: '32px',
  },
  '&.switch': {
    width: '26px',
    height: '14px',
  },
  '&.active': {
    color: COLORS.mainPurple,
  },
});

const TemplateItem = styled.div({
  padding: '0.75rem 0',
  color: COLORS.textGrey,
  userSelect: 'none',
  cursor: 'pointer',
});

const DefaultTemplate = styled.div({
  color: COLORS.textGrey,
  lineHeight: '3.75rem',
  cursor: 'pointer',
  borderTop: `1px solid ${COLORS.lightGrey}`,
});

/* moduleDesigb */
import CheckBoxDesign from '../ModuleDesign/CheckBoxDesign';
import DropdownDesign from '../ModuleDesign/DropdownDesign';
import TextDesign from '../ModuleDesign/TextDesign';
import UploadDesign from '../ModuleDesign/UploadDesign';
import SwitchDesign from '../ModuleDesign/SwitchDesign';
import DatePickerDesign from '../ModuleDesign/DatePickerDesign';

const ModuleTemplate = ({ templateData, setTemplate, existIdList }) => {
  let systemList = templateData.systemList;
  let dynamicList = templateData.dynamicList;

  const remainSystemList = useMemo(() => {
    if (!systemList || systemList.length < 1) {
      return [];
    }

    return systemList.filter(item => !existIdList.includes(item.id));
  }, [systemList, existIdList]);

  const remainDynamicList = useMemo(() => {
    if (!dynamicList || dynamicList.length < 1) {
      return [];
    }

    return dynamicList.filter(item => !existIdList.includes(item.id));
  }, [dynamicList, existIdList]);

  return (
    <>
      <DefaultTemplate
        onClick={() => {
          setTemplate(templateData.default);
        }}
      >
        <Text type='subTitle'>
          <Intl id='restoreField' />
        </Text>
      </DefaultTemplate>

      {remainSystemList.length > 0 && (
        <Collapse title={<Intl id='sysField' />}>
          {remainSystemList.map((item, index) => {
            return (
              <TemplateItem
                key={index}
                onClick={() => {
                  setTemplate(item);
                }}
              >
                {item.label}
              </TemplateItem>
            );
          })}
        </Collapse>
      )}
      {remainDynamicList.length > 0 && (
        <Collapse title={<Intl id='dynamicApproval' />}>
          {remainDynamicList.map((item, index) => {
            return (
              <TemplateItem
                key={index}
                onClick={() => {
                  setTemplate(item);
                }}
              >
                {item.label}
              </TemplateItem>
            );
          })}
        </Collapse>
      )}
    </>
  );
};

const ModuleSelection = ({
  data,
  template,
  onChange,
  tagTemplate,
  existIdList,
}) => {
  const curModuleStyle = useMemo(() => {
    return data.style;
  }, [data]);

  const moduleTypeList = useMemo(() => {
    let moduleType = [
      { style: 1, icon: CheckBoxIcon, cls: 'checkbox', temp: 'text' },
      { style: 2, icon: DropdownIcon, cls: 'dropdown' },
      { style: 3, icon: TextIcon, cls: 'text' },
      { style: 4, icon: UploadIcon, cls: 'upload' },
      { style: 5, icon: ToggleIcon, cls: 'switch' },
      { style: 6, icon: DatePickerIcon, cls: 'datepicker' },
    ];
    return tagTemplate
      ? moduleType.filter(item => item.style !== 4)
      : moduleType;
  }, [tagTemplate]);

  const currentTemplate = useMemo(() => {
    return (
      template.find(item => {
        return Number(item.style) === Number(curModuleStyle);
      }) || null
    );
  }, [curModuleStyle, template]);

  const ModuleEdit = useMemo(() => {
    let style = Number(curModuleStyle);
    switch (style) {
      case 1:
        return CheckBoxDesign;
      case 2:
        return DropdownDesign;
      case 3:
        return TextDesign;
      case 4:
        return UploadDesign;
      case 5:
        return SwitchDesign;
      case 6:
        return DatePickerDesign;
      default:
    }
  }, [curModuleStyle]);

  const handleClick = style => {
    const defaultTemplate = template.find(item => {
      return Number(item.style) === Number(style);
    }).default;
    onChange(defaultTemplate, true);
  };

  if (!template) {
    return <></>;
  }

  return (
    <>
      <DesignerTitle>
        <Text type='title'>Fields Tool</Text>
      </DesignerTitle>
      <ModuleType>
        {moduleTypeList.map(item => {
          let Icon = item.icon;
          return (
            <ModuleIcon
              key={item.style}
              className={cn(item.cls, {
                active: item.style === curModuleStyle,
              })}
              onClick={() => {
                handleClick(item.style);
              }}
            >
              <Icon className={item.cls} />
            </ModuleIcon>
          );
        })}
      </ModuleType>
      <Title>
        <Text type='subTitle'>
          <Intl id='template' />
        </Text>
      </Title>
      {currentTemplate && (
        <WorkflowOptionsType>
          <div>
            <ModuleTemplate
              templateData={currentTemplate}
              setTemplate={data => {
                onChange(data);
              }}
              existIdList={existIdList}
            />
          </div>
          {data.id.startsWith('u') && (
            <ModuleEdit
              systemCopy={
                String(data?.point_id)?.startsWith('s') ||
                String(data?.point_id)?.startsWith('d')
              }
              data={data}
              onChange={onChange}
            />
          )}
        </WorkflowOptionsType>
      )}
    </>
  );
};

export default ModuleSelection;
