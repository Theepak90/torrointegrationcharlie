/* third lib*/
import React from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import styled from '@emotion/styled';

/* local components & methods */
import { THEME } from '@comp/theme';
import ModuleSelection from './ModuleSelection';

const DesignerPanel = styled.div`
  height: 100%;
  width: 23.75rem;
  background-color: ${THEME.colors.white};
  margin-left: ${THEME.spacing.space24};
  display: flex;
  flex-direction: column;
  box-shadow: ${THEME.shadows.paperShadow};
`;

const DesignPanel = ({ currentModule, onChange }) => {
  return (
    <DesignerPanel id='designPanel'>
      {currentModule && (
        <Scrollbar>
          <ModuleSelection data={currentModule} onChange={onChange} />
        </Scrollbar>
      )}
    </DesignerPanel>
  );
};

export default DesignPanel;
