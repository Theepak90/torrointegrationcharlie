import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '@comp/theme';

const FrequentlyContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FrequentForm = styled.div`
  margin-left: ${SPACING.space20};
  display: flex;
  align-items: center;
  padding: 0 0.25rem;
`;

const StyledLink = styled(Link)`
  color: ${COLORS.darkPurple};
  font-size: ${FONT_SIZES.fontSize3};
  font-family: Roboto;
  font-weight: ${FONT_WEIGHTS.medium};
  text-decoration: underline;
`;

const Frequently = ({ favoritLlinks }) => {
  return (
    <FrequentlyContainer>
      {favoritLlinks.map(item => {
        return (
          <FrequentForm key={`form-${item.id}`}>
            <StyledLink to={item.link}>{item.title}</StyledLink>
          </FrequentForm>
        );
      })}
    </FrequentlyContainer>
  );
};

export default Frequently;
