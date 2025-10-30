/* third lib */
import React from 'react';
import styled from '@emotion/styled';
import Text from '@basics/Text';
import classNames from 'classnames';

// Import global variables from theme.js
import { COLORS, SPACING } from '../../theme';

// Create styled button component using @emotion/styled
const StyledButton = styled.button`
  min-width: 12.5rem;
  height: 3.75rem;
  padding: ${SPACING.space8} ${SPACING.space16};
  margin-right: ${SPACING.space32};
  color: ${COLORS.mainPurple};
  border: 2px solid ${COLORS.mainPurple};
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: inherit;
  outline: none;

  &:hover:not(.disabled) {
    background-color: ${COLORS.mainPurple};
    color: white;
  }

  &.filled {
    background-color: ${COLORS.mainPurple};
    color: white;

    &:hover:not(.disabled) {
      background-color: ${COLORS.darkPurple};
      border-color: ${COLORS.darkPurple};
    }
  }

  &.text {
    background-color: transparent;
    border: none;
    color: ${COLORS.mainPurple};
    padding: 0.5rem 1rem;
    min-width: auto;
    height: auto;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.small {
    min-width: 8rem;
    height: 2.5rem;
    padding: ${SPACING.space8};
    font-size: 0.875rem;
  }

  &.large {
    min-width: 16rem;
    height: 4.5rem;
    padding: ${SPACING.space24};
    font-size: 1.25rem;
  }
`;

const CustomButton = ({
  children,
  type = 'button',
  onClick,
  filled = false,
  text = false,
  size,
  disabled = false,
  className,
  style,
}) => {
  // Use classnames library to build class names, more concise and elegant
  const buttonClasses = classNames(className, {
    filled: filled,
    text: text,
    disabled: disabled,
    [size]: size,
  });

  return (
    <StyledButton
      onClick={onClick}
      className={buttonClasses}
      type={type}
      disabled={disabled}
      style={style}
    >
      <Text
        type='subTitle'
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: 'inherit',
        }}
      >
        {children}
      </Text>
    </StyledButton>
  );
};

export default CustomButton;
