/* third lib*/
import React, { useMemo } from 'react';
import Scrollbar from 'react-perfect-scrollbar';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* local components & methods */
import Text from '@basics/Text';
import FlowItemGroup from './FlowItemGroup';
import { THEME } from '../../theme';

// Styled components
const DesignerPanel = styled.div`
  height: 100%;
  width: 23.75rem;
  background-color: ${THEME.colors.white};
  display: flex;
  flex-direction: column;
  box-shadow: ${THEME.shadows.paperShadow};
`;

const DesignerTitle = styled.div`
  margin-top: 3.125rem;
  color: ${THEME.colors.mainPurple};
  margin-left: ${THEME.spacing.space40};
`;

const WorkflowOptionsType = styled.div`
  padding: ${THEME.spacing.space40};
`;
const WorkflowDesginPanel = ({ dropOptions }) => {
  const { type, data } = dropOptions;
  const haveOptions = useMemo(() => {
    return data && data.length > 0;
  }, [data]);
  return (
    <DesignerPanel>
      <DesignerTitle>
        <Text type='title'>
          {type === 'item' ? (
            <Intl id='workflowItems' />
          ) : (
            <Intl id='itemConditions' />
          )}
        </Text>
      </DesignerTitle>
      <Scrollbar>
        <WorkflowOptionsType>
          <div>
            {haveOptions &&
              data.map((column, index) => {
                return <FlowItemGroup key={index} column={column} />;
              })}
          </div>
        </WorkflowOptionsType>
      </Scrollbar>
    </DesignerPanel>
  );
};

export default WorkflowDesginPanel;
