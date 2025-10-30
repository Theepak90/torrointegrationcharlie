/* third lib*/
import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';

/* MUI */
import Collapse from '@mui/material/Collapse';
import AddIcon from '@mui/icons-material/Add';

// 从theme.js中导入全局变量
import { COLORS, SPACING } from '../../theme';

// 导入本地组件
import Text from '@basics/Text';

// 使用@emotion/styled创建样式组件
const CollapseContainer = styled.div`
  border-top: 1px solid ${COLORS.lightGrey};

  &:last-child {
    border-bottom: 1px solid ${COLORS.lightGrey};
  }
`;

const CollapseLabel = styled.div`
  color: ${COLORS.textGrey};
  line-height: 3.75rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;

  &.active {
    color: ${COLORS.mainPurple};
  }
  &.disabled {
    color: ${COLORS.textGrey};
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AddIconContainer = styled.div``;

const CollapseC = ({ children, title, disabled, column }) => {
  const [open, setOpen] = useState(false);
  const toggleHandle = () => {
    setOpen(!open);
  };
  const currentOpen = useMemo(() => {
    return open && !disabled;
  }, [open, disabled]);

  return (
    <CollapseContainer>
      <CollapseLabel
        className={currentOpen ? 'active' : disabled ? 'disabled' : ''}
      >
        <Text type='subTitle'>{title}</Text>
        <AddIconContainer onClick={toggleHandle}>
          <AddIcon />
        </AddIconContainer>
      </CollapseLabel>
      <Collapse in={currentOpen}>{children}</Collapse>
    </CollapseContainer>
  );
};

export default CollapseC;
