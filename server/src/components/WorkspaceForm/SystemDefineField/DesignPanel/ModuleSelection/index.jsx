/* third lib*/
import React, { useMemo } from 'react';
import styled from '@emotion/styled';

/* local components & methods */
import Text from '@basics/Text';
import { THEME } from '@comp/theme';

/* moduleDesigb */
import CheckBoxDesign from '../ModuleDesign/CheckBoxDesign';
import DropdownDesign from '../ModuleDesign/DropdownDesign';
import TextDesign from '../ModuleDesign/TextDesign';
import UploadDesign from '../ModuleDesign/UploadDesign';
import SwitchDesign from '../ModuleDesign/SwitchDesign';
import DatePickerDesign from '../ModuleDesign/DatePickerDesign';

// Styled Components
const DesignerTitle = styled.div`
  margin-top: 3.125rem;
  color: ${THEME.colors.textGrey};
  margin-left: ${THEME.spacing.space40};
`;

const ModuleEditContainer = styled.div`
  padding: ${THEME.spacing.space40};
`;

const ModuleSelection = ({ data, onChange }) => {
  const curModuleStyle = useMemo(() => {
    return data.style;
  }, [data]);

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

  return (
    <>
      <DesignerTitle>
        <Text type='title'>Fields Tool</Text>
      </DesignerTitle>
      <ModuleEditContainer>
        <ModuleEdit data={data} onChange={onChange} />
      </ModuleEditContainer>
    </>
  );
};

export default ModuleSelection;
