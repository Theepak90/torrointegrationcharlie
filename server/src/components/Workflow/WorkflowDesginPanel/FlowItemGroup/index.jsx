/* third lib*/
import React, { useState, useMemo } from 'react';
import cn from 'classnames';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';

/* material-ui */
import Collapse from '@mui/material/Collapse';
import AddIcon from '@mui/icons-material/Add';

/* local components & methods */
import Text from '@basics/Text';
import { THEME } from '../../../theme';

// Styled components
const WorkflowOptions = styled.div`
  border-top: 1px solid ${THEME.colors.lightGrey};

  &:last-child {
    border-bottom: 1px solid ${THEME.colors.lightGrey};
  }
`;

const WorkflowType = styled.div`
  color: ${THEME.colors.textGrey};
  line-height: 3.75rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;

  &.active {
    color: ${THEME.colors.mainPurple};
  }
  &.disabled {
    color: ${THEME.colors.textGrey};
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WorkflowItemList = styled.div`
  margin-top: ${THEME.spacing.space12};
`;

const WorkflowItem = styled.div`
  padding: 0.75rem 0;
  color: ${THEME.colors.textGrey};
  user-select: none;

  &.dragging {
    padding: 0.75rem;
    border-radius: 4px;
    box-shadow: -3px 3px 6px rgba(0, 0, 0, 0.5);
    background: ${THEME.colors.mainPurple};
    color: ${THEME.colors.white};
    opacity: 1;
  }
`;

const CloneItem = styled.div`
  padding: 0.75rem 0;
  color: ${THEME.colors.textGrey};
  user-select: none;

  &.dragging {
    padding: 0.75rem;
    border-radius: 4px;
    box-shadow: -3px 3px 6px rgba(0, 0, 0, 0.5);
    background: ${THEME.colors.mainPurple};
    color: ${THEME.colors.white};
    opacity: 1;
  }
`;

const FlowItemGroup = ({ column }) => {
  const itemList = column.itemList;
  const [open, setOpen] = useState(false);
  const toggleHandle = () => {
    setOpen(!open);
  };
  const currentOpen = useMemo(() => {
    return open;
  }, [open]);

  return (
    <WorkflowOptions>
      <WorkflowType className={cn({ active: currentOpen })}>
        <Text type='subTitle'>{column.label}</Text>
        <div onClick={toggleHandle}>
          <AddIcon />
        </div>
      </WorkflowType>
      <Collapse in={currentOpen}>
        <WorkflowItemList>
          <Droppable droppableId={column.group} isDropDisabled={true}>
            {(provided, snapshot) => {
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {itemList.map((item, index) => {
                    return (
                      <Draggable
                        key={column.group + item.id}
                        draggableId={
                          column.group + '_' + item.id + '_' + item.label
                        }
                        index={index}
                      >
                        {(provided, snapshot) => {
                          return (
                            <React.Fragment>
                              <WorkflowItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn({
                                  dragging: snapshot.isDragging,
                                })}
                                style={
                                  snapshot.isDragging
                                    ? provided.draggableProps.style
                                    : null
                                }
                              >
                                {item.label}
                              </WorkflowItem>
                              {!column.unique && snapshot.isDragging && (
                                <CloneItem>{item.label}</CloneItem>
                              )}
                            </React.Fragment>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  <div style={{ display: 'none' }}>{provided.placeholder}</div>
                </div>
              );
            }}
          </Droppable>
        </WorkflowItemList>
      </Collapse>
    </WorkflowOptions>
  );
};

export default FlowItemGroup;
