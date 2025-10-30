/* third lib */
import React from 'react';
import styled from '@emotion/styled';
import { FONT_SIZES, FONT_WEIGHTS } from '../../theme';

// Create base text styles using @emotion/styled
const BaseText = styled.span`
  font-family: Roboto;
`;

const Text = ({ type = 'regular', title, className, children, ...props }) => {
  // Determine styles based on type property
  const getTextStyles = () => {
    switch (type) {
      case 'title':
        return {
          fontSize: FONT_SIZES.fontSize2,
          fontWeight: FONT_WEIGHTS.medium,
          lineHeight: '2.5rem',
        };
      case 'subTitle':
        return {
          fontSize: FONT_SIZES.fontSize3,
          fontWeight: FONT_WEIGHTS.medium,
        };
      case 'large':
        return {
          fontSize: FONT_SIZES.fontSize4,
          fontWeight: FONT_WEIGHTS.medium,
        };
      case 'regular':
      case 'secondary':
      default:
        return {
          fontSize: FONT_SIZES.fontSize4,
          fontWeight: FONT_WEIGHTS.regular,
        };
    }
  };

  // Create styled text component
  const StyledText = styled(BaseText)({
    ...getTextStyles(),
    ...props.style,
  });

  return (
    <StyledText title={title} className={className} {...props}>
      {children}
    </StyledText>
  );
};

// Removed defaultProps - using default parameters instead

export default Text;
