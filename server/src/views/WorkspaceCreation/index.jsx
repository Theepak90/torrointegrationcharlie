/* third lib*/
import React from 'react';
import styled from '@emotion/styled';
/* material-ui */

/* local components & methods */
import WorkspaceForm from '@comp/WorkspaceForm';
import { THEME } from 'src/components/theme';

// Styled components
const WorkspaceCreationContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${THEME.colors.white};
`;

const WorkspaceCreation = () => {
  return (
    <WorkspaceCreationContainer>
      <WorkspaceForm addState={true} />
    </WorkspaceCreationContainer>
  );
};

export default WorkspaceCreation;
