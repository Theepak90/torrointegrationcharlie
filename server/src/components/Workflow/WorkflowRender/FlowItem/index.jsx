/* third lib*/
import React, { useState, useMemo, useEffect } from 'react';
import cn from 'classnames';
import { FormattedMessage as Intl } from 'react-intl';
import styled from '@emotion/styled';

/* material-ui*/
import EditIcon from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

/* local components & methods */
import Text from '@basics/Text';
import { Droppable } from 'react-beautiful-dnd';
import ConditionItem from './ConditionItem';
import { THEME } from '../../../theme';

// Styled components
const FlowItemContainer = styled.div`
  padding: ${THEME.spacing.space20};
  border: 1px dashed transparent;

  &.editState {
    border: 1px dashed ${THEME.colors.mainPurple};
  }
`;

const FlowContainer = styled.div`
  width: 30.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  border: 1px solid ${THEME.colors.darkPurple};
  min-height: 3.5rem;
  overflow: hidden;

  &.Approval {
    border: 1px solid ${THEME.colors.darkYellow} !important;
  }
  &.GoogleCloud {
    border: 1px solid ${THEME.colors.darkRed} !important;
  }
  &.System {
    border: 1px solid ${THEME.colors.darkPurple} !important;
  }
  &.empty {
    border: 1px dashed ${THEME.colors.darkPurple} !important;
  }

  &.draggingOver {
    background-color: ${THEME.colors.lightPurple} !important;
  }
`;

const FlowMainBox = styled.div`
  min-height: 3.5rem;
  width: 100%;
  background-color: #fff;
  position: relative;
  min-height: 5rem;
  padding: ${THEME.spacing.space8};
  visibility: ${props => (props.isDraggingOver ? 'hidden' : 'visible')};

  &.cannotOperate {
    pointer-events: none;
  }
`;

const DroppableItemLabel = styled.div`
  width: 30.5rem;
  height: 3.5rem;
  color: ${THEME.colors.mainPurple};
  display: flex;
  justify-content: space-between;
  padding: ${THEME.spacing.space20};
  position: relative;
  background-color: ${props => {
    if (props.flowType === 'Approval') return THEME.colors.darkYellow;
    if (props.flowType === 'GoogleCloud') return THEME.colors.darkRed;
    if (props.flowType === 'System') return THEME.colors.darkPurple;
    if (props.isEmpty) return 'transparent';
    return THEME.colors.mainPurple;
  }};
  color: ${props =>
    props.isEmpty ? THEME.colors.darkPurple : THEME.colors.white};
  visibility: ${props => (props.isDraggingOver ? 'hidden' : 'visible')};

  .operationBox {
    position: absolute;
    right: 1rem;
    svg {
      width: 1.25rem;
      height: 1.25rem;
      margin-left: ${THEME.spacing.space8};
      cursor: pointer;
    }
  }
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
const PLACEHODER = 'PLACEHODER';

const FlowItem = ({
  editFlow,
  data,
  index,
  onEdit,
  onDelete,
  closeEdit,
  formFieldOptions,
}) => {
  const [currentData, setCurrentData] = useState(data);
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  const canDroppable = useMemo(() => {
    return currentData.group === PLACEHODER || editFlow;
  }, [currentData, editFlow]);

  const disableDelete = useMemo(() => {
    return (
      currentData.flowType === 'Trigger' || currentData.flowType === 'Approval'
    );
  }, [currentData]);

  return (
    <FlowItemContainer
      className={cn({
        editState: editFlow,
      })}
    >
      <Droppable
        droppableId={'droppable' + index}
        isDropDisabled={disableDelete || editFlow || currentData.disabled}
      >
        {(provided, snapshot) => {
          return (
            <FlowContainer
              className={cn(currentData.flowType, {
                draggingOver: snapshot.isDraggingOver,
                empty: currentData.group === PLACEHODER,
              })}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <DroppableItemLabel
                flowType={currentData.flowType}
                isEmpty={currentData.group === PLACEHODER}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <Text type='large'>
                  {currentData.group === PLACEHODER ? (
                    <Intl id='dropwfItem' />
                  ) : (
                    currentData.label
                  )}
                </Text>
                {editFlow && (
                  <div className='operationBox'>
                    <CheckIcon
                      onClick={() => {
                        onEdit(null);
                        closeEdit(currentData);
                      }}
                    />
                  </div>
                )}
                {!canDroppable && (
                  <div className='operationBox'>
                    <EditIcon
                      onClick={() => {
                        onEdit(index, data);
                      }}
                    />
                    {!disableDelete && (
                      <Delete
                        onClick={() => {
                          onDelete(index);
                        }}
                      />
                    )}
                  </div>
                )}
              </DroppableItemLabel>

              {currentData.group !== PLACEHODER && currentData.condition && (
                <FlowMainBox
                  className={cn({
                    cannotOperate: !editFlow,
                  })}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <ConditionItem
                    currentData={currentData}
                    editFlow={editFlow}
                    flowIndex={index}
                    onChange={data => {
                      setCurrentData(data);
                    }}
                    formFieldOptions={formFieldOptions}
                  />
                </FlowMainBox>
              )}

              {snapshot.isDraggingOver && (
                <DraggingHolder>
                  <Intl id='dropwfItem' />
                </DraggingHolder>
              )}
              <Placeholder>{provided.placeholder}</Placeholder>
            </FlowContainer>
          );
        }}
      </Droppable>
    </FlowItemContainer>
  );
};

export default FlowItem;
