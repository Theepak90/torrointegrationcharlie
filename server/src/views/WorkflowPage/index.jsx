/* third lib*/
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

/* material-ui */

/* local components & methods */
import { getQueryString } from 'src/utils/url-util.js';
import Workflow from '@comp/Workflow';
import { getAllStages } from '@lib/api';
import { sendNotify } from 'src/utils/systerm-error';

// Styled components
const WorkflowPageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;

const WorkflowPage = () => {
  const workflowId = getQueryString('id');

  const [droppableItems, setDroppableItems] = useState(null);
  useEffect(() => {
    getAllStages({ workflow_id: workflowId })
      .then(res => {
        let optionsList = res.data;
        setDroppableItems(optionsList);
      })
      .catch(e => {
        sendNotify({ msg: e.message, status: 3, show: true });
      });
  }, [workflowId]);

  return (
    <WorkflowPageContainer>
      {droppableItems && (
        <Workflow flowId={workflowId} droppableItems={droppableItems} />
      )}
    </WorkflowPageContainer>
  );
};

export default WorkflowPage;
