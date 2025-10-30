/* third lib */
import React from 'react';
import styled from '@emotion/styled';

// 从theme.js中导入全局变量
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../../theme';

// 使用@emotion/styled创建样式组件
const StyledHeadLine = styled.h1`
  font-size: ${FONT_SIZES.fontSize1};
  font-weight: ${FONT_WEIGHTS.bold};
  font-family: Comfortaa;
  line-height: 2.75rem;
  color: ${COLORS.darkPurple};
`;

const HeadLine = ({ children }) => {
  return <StyledHeadLine>{children}</StyledHeadLine>;
};

export default HeadLine;
