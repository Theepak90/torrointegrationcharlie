/* third lib*/
import React from 'react';
import { FormattedMessage as Intl } from 'react-intl';
import cn from 'classnames';
import styled from '@emotion/styled';

/* local components & methods */
import { Droppable } from 'react-beautiful-dnd';
import { THEME } from '../../../../theme';

// Styled components
const MainBoxHolder = styled.div`
  line-height: 1;
  font-size: 1rem;
  margin: ${THEME.spacing.space8};
  padding: 0.75rem 0;
  border: 1px dashed ${THEME.colors.mainPurple};
  border-radius: 18px;
  text-align: center;
  color: ${THEME.colors.mainPurple};
  overflow: hidden;
  position: relative;
`;

const Placeholder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: ${THEME.colors.mainPurple};
  z-index: -1;
`;

const DraggingHolder = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${THEME.colors.mainPurple};
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${THEME.colors.white};
  top: 0;
`;

const CommonConditionHolder = ({ droppable, index, title }) => {
  return (
    <MainBoxHolder>
      <Droppable
        droppableId={'droppable' + index + 'condition'}
        isDropDisabled={!droppable}
      >
        {(provided, snapshot) => {
          return (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <div>
                {droppable ? (
                  title || <Intl id='dropCondtion' />
                ) : (
                  <Intl id='plsClickEdit' />
                )}
              </div>

              {snapshot.isDraggingOver && (
                <DraggingHolder>
                  <Intl id='dropwfItem' />
                </DraggingHolder>
              )}
              <Placeholder>{provided.placeholder}</Placeholder>
            </div>
          );
        }}
      </Droppable>
    </MainBoxHolder>
  );
};

export default CommonConditionHolder;
