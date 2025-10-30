/* third lib*/
import React, { Fragment, useCallback } from 'react';
import cn from 'classnames';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

import AddCircleOutline from '@mui/icons-material/AddCircleOutline';

/* local components & methods */
import FlowItem from './FlowItem';
import ProcessArrow from '@assets/icons/ProcessArrow';
import { THEME } from '../../theme';

// Styled components
const WorkflowRenderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

const StartButton = styled.div`
  width: 8.75rem;
  height: 3.5rem;
  background-color: ${THEME.colors.mainPurple};
  border-radius: 4px;
  color: ${THEME.colors.white};
  line-height: 3.5rem;
  text-align: center;
  font-weight: ${THEME.fontWeights.medium};
  font-family: Roboto;
  font-size: 1rem;
  margin-bottom: ${THEME.spacing.space20};
  position: relative;

  &.end {
    margin-top: ${THEME.spacing.space20};
  }
`;

const ProcessIcon = styled.div`
  svg {
    width: 3rem;
    height: 3rem;
    color: ${THEME.colors.darkPurple};
  }
`;

const AddStageBtn = styled.div`
  cursor: pointer;
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: ${THEME.colors.darkPurple};
  }
`;

const ProcessAnchor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StartButtonComponent = () => (
  <StartButton>
    <Intl id='start' />
    <span id='anchorStartBtn' style={{ display: 'none' }}></span>
  </StartButton>
);

const EndButtonComponent = () => (
  <StartButton className='end'>
    <Intl id='end' />
    <span id='anchorStartBtn' style={{ display: 'none' }}></span>
  </StartButton>
);

const ProcessAnchorComponent = ({ addPlaceHolder, showAdd }) => {
  return (
    <ProcessAnchor>
      <ProcessIcon>
        <ProcessArrow />
      </ProcessIcon>
      {showAdd && (
        <AddStageBtn onClick={addPlaceHolder} title='add Flow Item'>
          <AddCircleOutline />
        </AddStageBtn>
      )}
    </ProcessAnchor>
  );
};

const PLACEHODER = 'PLACEHODER';

const WorkflowRender = ({
  workflowData,
  onChange,
  onEdit,
  editFlow,
  editIndex,
  closeEdit,
  formFieldOptions,
}) => {
  const addHolderHandle = useCallback(
    index => {
      let tmpData = JSON.parse(JSON.stringify(workflowData));
      tmpData.splice(index + 1, 0, {
        group: PLACEHODER,
        label: <Intl id='dropwfItem' />,
        id: 0,
      });
      onChange(tmpData);
    },
    [onChange, workflowData]
  );

  const deleteHandle = useCallback(
    index => {
      let tmpData = JSON.parse(JSON.stringify(workflowData));
      let typeMap = tmpData.map(item => item.group);
      if (typeMap.includes('PLACEHODER')) {
        tmpData.splice(tmpData.length - 1, 1);
      }
      tmpData.splice(index, 1);
      onChange(tmpData);
    },
    [onChange, workflowData]
  );

  return (
    <WorkflowRenderContainer>
      <StartButtonComponent />

      <ProcessIcon>
        <ProcessArrow />
      </ProcessIcon>

      {workflowData.map((item, index) => {
        let preId = index === 0 ? 'StartBtn' : workflowData[index - 1].id;
        let tmpEditMode = (editFlow && editIndex === index) || false;
        return (
          <Fragment key={index}>
            <FlowItem
              key={'contanier' + item.id}
              data={item}
              index={index}
              onEdit={onEdit}
              editFlow={tmpEditMode}
              closeEdit={closeEdit}
              onDelete={index => {
                deleteHandle(index);
              }}
              fromId={preId}
              formFieldOptions={formFieldOptions}
            />
            <ProcessAnchorComponent
              addPlaceHolder={() => {
                addHolderHandle(index);
              }}
              data={item}
              showAdd={
                index === workflowData.length - 1 && item.group !== PLACEHODER
              }
            />
          </Fragment>
        );
      })}
      <EndButtonComponent />
    </WorkflowRenderContainer>
  );
};

export default WorkflowRender;
